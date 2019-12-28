import * as shp from 'shpjs';
import { expose } from 'threads/worker';
import { readFileAsync } from 'app/utils';

expose(async function readShapefilesFromZip(inputData) {
  let resultData: any = await readFileAsync(inputData);
  return await shp.parseZip(resultData);
});