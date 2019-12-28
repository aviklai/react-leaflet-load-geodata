export default class Parser {
    protected files: FileList;
    protected mapRef: any;
    constructor(files: FileList, mapRef: any) {
        this.files = files;
        this.mapRef = mapRef;
    }    
}