// @ts-ignore
import loam from 'loam';
import Parser from './base';
import TifData from 'app/geodata/tifData';
import * as L from 'leaflet';

export default class TifParser extends Parser {
    constructor(files: FileList, mapRef: any) {
        super(files, mapRef);
    }
    async createLayer() {
        const dataset = await loam.open(this.files[0]);
        const wktDest =
          'GEOGCS["WGS 84",DATUM["WGS_1984",SPHEROID["WGS 84",6378137,298.257223563,AUTHORITY["EPSG","7030"]],AUTHORITY["EPSG","6326"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.01745329251994328,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4326"]]';
        const smallDataset = await dataset.convert([
          '-of',
          'GTiff',
          '-outsize',
          '1000',
          '0',
          '-r',
          'nearest'
        ]);
        dataset.close();
        const newDataset = await smallDataset.warp([
          '-co',
          'PREDICTOR=2',
          '-dstnodata',
          '0',
          '-of',
          'GTiff',
          '-t_srs',
          'EPSG:3857',
          '-r',
          'near'
        ]);
        smallDataset.close();
        const width: number = await newDataset.width();
        const height: number = await newDataset.height();
        const geoTransform: number[] = await newDataset.transform();
        const wktSource = await newDataset.wkt();
        const corners = [[0, 0], [width, 0], [width, height], [0, height]];
        const geoCorners = corners.map(function(coords) {
          var x = coords[0];
          var y = coords[1];
          return [
            geoTransform[0] + geoTransform[1] * x + geoTransform[2] * y,
            geoTransform[3] + geoTransform[4] * x + geoTransform[5] * y
          ];
        });
        const wgs84GeoCornersGdal: [number, number][] = await loam.reproject(
          wktSource,
          wktDest,
          geoCorners
        );
        const wgs84GeoCorners = wgs84GeoCornersGdal.map((coords) => [coords[1], coords[0]]) as [
          number,
          number
        ][];
        const pngDataset = await newDataset.convert(['-of', 'PNG']);
        const imageBytes = await pngDataset.closeAndReadBytes();        
        const outputBlob = new Blob([imageBytes], { type: 'image/png' });
        const imageURL = window.URL.createObjectURL(outputBlob);
        const imageOverlay = L.imageOverlay(imageURL, wgs84GeoCorners);
        const imageBounds = imageOverlay.getBounds();
        const zoom = this.mapRef.current.leafletElement.getBoundsZoom(imageBounds);
        const center = imageBounds.getCenter();
        return new TifData(imageURL, wgs84GeoCorners, zoom, center);       
    }
}