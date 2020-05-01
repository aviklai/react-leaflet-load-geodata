import GeoData from "./base";
import { KML_OVERLAY } from "app/consts";

export default class KmlData extends GeoData {
    data: any;
    public type = KML_OVERLAY;
    constructor(data: any, zoom: number, center: any) {
        super(zoom, center);
        this.data = data;
    }
}