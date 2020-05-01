import * as dom from 'xmldom';
// @ts-ignore
import { kml, gpx } from '@tmcw/togeojson/dist/togeojson.es.js';
import { expose } from 'threads/worker';
import { readFileAsync } from 'app/utils';

expose(async function readGpx(inputData, isGpx=true) {
  const resultData: any = await readFileAsync(inputData, true);
  const domXML = new dom.DOMParser().parseFromString(resultData, "text/xml");
  return gpx(domXML);
});
