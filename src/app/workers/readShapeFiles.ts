import * as shp from 'shpjs';
import { expose } from 'threads/worker';
import * as JSZip from 'jszip';
import { readFileAsync } from 'app/utils';

expose(async function readShapefiles(inputFiles) {
    const dataFiles = [];
    for (const file of Array.from(inputFiles)) {
        let resultData = await readFileAsync(file);
        dataFiles.push(resultData);
    }
    var zip = new JSZip();
    dataFiles.forEach((inputFile: any, index: number) => {
        zip.file(inputFiles[index].name, inputFile);
    })
    const zipFile: any = await zip.generateAsync({type:"arraybuffer"});
    return await shp.parseZip(zipFile);
});
