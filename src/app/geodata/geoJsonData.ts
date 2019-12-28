import GeoData from "./base";
import { GEOJSON_OVERLAY } from "app/consts";

export default class GeoJsonData extends GeoData {
    data: any;
    public type = GEOJSON_OVERLAY;
    constructor(data: any, zoom: number, position: any) {
        super(zoom, position);
        this.data = data;
    }
}