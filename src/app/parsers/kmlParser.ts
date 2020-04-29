import * as L from 'leaflet';
import { spawn, Thread, Worker } from 'threads';
import Parser from "./base";
import GeoJsonData from 'app/geodata/geoJsonData';

export default class KMLParser extends Parser {
    constructor(files: FileList, mapRef: any) {
        super(files, mapRef);
    }
    async createLayer() {
        const readKML = await spawn(new Worker('../workers/readKML'));
        const geoJsonData = await readKML(this.files[0]);
        await Thread.terminate(readKML);      
        const geoJosnOverlay = new L.GeoJSON(geoJsonData);
        const geoJsonBounds = geoJosnOverlay.getBounds();
        const zoom = this.mapRef.current.leafletElement.getBoundsZoom(geoJsonBounds);
        const center = geoJsonBounds.getCenter();
        return new GeoJsonData(geoJsonData, zoom, center);      
    }

}