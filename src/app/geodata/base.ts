export default class GeoData {
    public zoom: number; 
    public center: any;
    constructor(zoom: number, center: any) {
        this.zoom = zoom;
        this.center = center;
    }
}