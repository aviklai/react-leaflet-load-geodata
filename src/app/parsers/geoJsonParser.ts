import * as L from 'leaflet';
import Parser from "./base";
import GeoJsonData from 'app/geodata/geoJsonData';
import { readFileAsync } from 'app/utils';

export default class GeoJsonParser extends Parser {
    constructor(files: FileList, mapRef: any) {
        super(files, mapRef);
    }
    async createLayer() {
        const data: any = await readFileAsync(this.files[0], true);
        const geoJsonData = JSON.parse(data);
        var geoJosnOverlay = new L.GeoJSON(geoJsonData);
        const geoJsonBounds = geoJosnOverlay.getBounds();
        const zoom = this.mapRef.current.leafletElement.getBoundsZoom(geoJsonBounds);
        const center = geoJsonBounds.getCenter();
        return new GeoJsonData(geoJsonData, zoom, center);      
    }

}