import * as dom from 'xmldom';
// @ts-ignore
import { kml } from '@tmcw/togeojson/dist/togeojson.es.js';
import { expose } from 'threads/worker';
import { readFileAsync } from 'app/utils';

expose(async function readKML(inputData) {
  const resultData: any = await readFileAsync(inputData, true);
  const domKML = new dom.DOMParser().parseFromString(resultData, "text/xml");
  return kml(domKML);  
});
