import * as React from 'react';
import { useState, useRef } from 'react';
import Map from '../map/Map';
import Loader from 'react-loader-spinner';
import Switch from 'react-switch';
import * as styles from './style.css';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import createParser from 'app/parsers/parserFactory';
import { ImageOverlay, GeoJSON } from 'react-leaflet';
import { IMAGE_OVERLAY, GEOJSON_OVERLAY, GEO_JSON_MARKER_OPTIONS } from 'app/consts';
import { uuidv4 } from 'app/utils';
// @ts-ignore
import loam from 'loam';

require('loamLib/loam-worker.js');
require('gdalJs/gdal.js');
require('gdalJs/gdal.wasm');
require('gdalJs/gdal.data');

loam.initialize();

/* This code is needed to properly load the images in the Leaflet CSS */
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

const App: React.FC = () => {
  const mapRef = useRef<any>(null);
  const [zoomPosition, setZoomPosition] = useState<any>({zoom: 12, position: L.latLng(32.0461, 34.8516)});
  const [showLoader, setShowLoader] = useState(false);
  const [showError, setShowError] = useState(false);
  const [overlays, setOverlays] = useState<any>([]);
  
  
  function handleChange(index: number, checked: boolean) {
    const newOverlays = [...overlays];
    const changedOverlay = {...newOverlays[index]};
    changedOverlay.show = checked;
    newOverlays[index] = changedOverlay;
    setOverlays(newOverlays);
  }

  function zoomToLayer(index: number) {
    setZoomPosition({ zoom: overlays[index].data.zoom, position: overlays[index].data.center });
  }

  function remove(index: number) {
    const newOverlays = [...overlays];
    newOverlays.splice(index, 1);
    setOverlays(newOverlays);
  }

  function onDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }

  async function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setShowError(false);
    setShowLoader(true);
    try{
      const files = e!.dataTransfer.files;
      const parser = createParser(files, mapRef);
      const layerData = await parser.createLayer()
      setZoomPosition({ zoom: layerData.zoom, position: layerData.center });
      setOverlays((ovelays: any) => [...ovelays, {show: true, data: layerData, id: uuidv4()}]);
    }catch {
      setShowError(true);
    }finally{
      setShowLoader(false);  
    }
  }

  function onMoveEnd(e: L.LeafletEvent) {
    const center = e.target.getCenter();
    const zoom = e.target.getZoom();
    setZoomPosition({ zoom: zoom, position: center });
  }

  function pointToLayer(feature: any, latlng: any) {
    return L.circleMarker(latlng, GEO_JSON_MARKER_OPTIONS);
  }

  function popUp(f: any, l: any) {
    var out = [];
    if (f.properties) {
      for (var key in f.properties) {
        out.push(key + ': ' + f.properties[key]);
      }
      l.bindPopup(out.join('<br />'));
    }
  }

  return (
    <>
      <div className={styles.header}>
        <div className={styles.headerText}>Drag geodata files (tif, shp, shp zipped, geojson) onto the map...</div>
        {showLoader && (
          <div className={styles.headerLoader}>
            <Loader type="ThreeDots" color="#00BFFF" height={30} width={50} />
          </div>
        )}  
        {showError && (
          <div className={styles.headerError}>
            Invalid file/s
          </div>
        )}      
      </div>
      <div className={styles.mainContainer}>
        <div className={styles.leftSidebar}>
            <div className={styles.layersHeader}>
              Imported layers
            </div>
            {overlays.map((overlay: any, index: number) => {
              return (
                <div key={overlay.id} className={styles.headerSwitch}>
                  <div className={styles.zoomToLayerText} onClick={() => zoomToLayer(index)}>
                    Zoom to
                  </div>
                  <Switch onChange={(checked) => handleChange(index, checked)} checked={overlay.show} />
                  <div className={styles.removeLayer} onClick={() => remove(index)}>Remove</div>
              </div>
              )
            })}
        </div>
        <div className={styles.mapContainer} onDragOver={onDragOver} onDrop={onDrop}>
          <Map onMoveEnd={onMoveEnd} position={zoomPosition.position} zoom={zoomPosition.zoom} ref={mapRef} >
            {overlays.map((overlay: any, index: number) => {
              if (overlay.data.type === IMAGE_OVERLAY && overlay.show) {
                return (
                  <ImageOverlay key={overlay.id} url={overlay.data.imageUrl} bounds={overlay.data.bounds} />
                )
              }else if (overlay.data.type === GEOJSON_OVERLAY && overlay.show) {
                return (
                  <GeoJSON key={overlay.id} data={overlay.data.data} pointToLayer={pointToLayer} onEachFeature={popUp} />
                )
              }
              return null;              
            })}
          </Map>
        </div>
      </div>
    </>
  );
};

export default App;
