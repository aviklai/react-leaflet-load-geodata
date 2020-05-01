import * as L from 'leaflet';
import Parser from "./base";
import KmlData from 'app/geodata/kmlData';
import { readFileAsync } from 'app/utils'
import 'leaflet-kml';

export default class KmlParser extends Parser {
    constructor(files: FileList, mapRef: any) {
        super(files, mapRef);
    }
    async createLayer() {        
        const resultData: any = await readFileAsync(this.files[0], true);
        const kml = new DOMParser().parseFromString(resultData, "text/xml");
        // @ts-ignore   
        const geoJosnOverlay = new L.KML(kml);
        const geoJsonBounds = geoJosnOverlay.getBounds();
        const zoom = this.mapRef.current.leafletElement.getBoundsZoom(geoJsonBounds);
        const center = geoJsonBounds.getCenter();
        return new KmlData(kml, zoom, center);      
    }

}