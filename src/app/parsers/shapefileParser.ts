import { spawn, Thread, Worker } from 'threads';
import * as L from 'leaflet';
import Parser from "./base";
import GeoJsonData from 'app/geodata/geoJsonData';

export default class ShapefileParser extends Parser {
    constructor(files: FileList, mapRef: any) {
        super(files, mapRef);
    }
    async createLayer() {
        let data: any = null;
        if (this.files.length === 1) {
            const readShapefilesFromZip = await spawn(new Worker('../workers/readShapefilesFromZip'));
            data = await readShapefilesFromZip(this.files[0]);
            await Thread.terminate(readShapefilesFromZip);         
        }else{            
            const readShapeFiles = await spawn(new Worker('../workers/readShapeFiles'));
            data = await readShapeFiles(this.files);
            await Thread.terminate(readShapeFiles);             
        }         
        var geoJosnOverlay = new L.GeoJSON(data);
        const geoJsonBounds = geoJosnOverlay.getBounds();
        const zoom = this.mapRef.current.leafletElement.getBoundsZoom(geoJsonBounds);
        const center = geoJsonBounds.getCenter();
        return new GeoJsonData(data, zoom, center);      
    }

}