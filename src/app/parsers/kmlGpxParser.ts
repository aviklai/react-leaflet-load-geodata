import * as L from 'leaflet';
import { spawn, Thread, Worker } from 'threads';
import Parser from "./base";
import GeoJsonData from 'app/geodata/geoJsonData';

export default class KMLParser extends Parser {
    private isGpx: boolean;
    constructor(files: FileList, mapRef: any, isGpx: boolean) {
        super(files, mapRef);
        this.isGpx = isGpx;
    }
    async createLayer() {
        const readKmlGpx = await spawn(new Worker('../workers/readKmlGpx'));
        const geoJsonData = await readKmlGpx(this.files[0], this.isGpx);
        await Thread.terminate(readKmlGpx);      
        const geoJosnOverlay = new L.GeoJSON(geoJsonData);
        const geoJsonBounds = geoJosnOverlay.getBounds();
        const zoom = this.mapRef.current.leafletElement.getBoundsZoom(geoJsonBounds);
        const center = geoJsonBounds.getCenter();
        return new GeoJsonData(geoJsonData, zoom, center);      
    }

}