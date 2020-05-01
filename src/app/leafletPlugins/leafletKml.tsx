// @ts-nocheck
import * as React from 'react';
import * as L from 'leaflet';
import { ContextProps, MapLayer, withLeaflet, LeafletContext } from 'react-leaflet';
import 'leaflet-kml';

interface IProps extends ContextProps {
  kml: string;
}

class ReactLeafletKml extends MapLayer<IProps> {
  public createLeafletElement(props: IProps) {
    const { kml } = props;
    this.leafletElement = new L.KML(kml);
    if (this.props.leaflet.map.options.preferCanvas && this.props.leaflet.map._renderer) {
      setTimeout((map: LeafletContext.map) => {        
        // Handling leaflet bug of canvas renderer not updating
        map._renderer._update();
      }, 0, this.props.leaflet.map) 
    }
    return this.leafletElement;
  } 

  componentWillUnmount() {
    super.componentWillUnmount();  
    if (this.props.leaflet.map.options.preferCanvas && this.props.leaflet.map._renderer) {
      // Handling leaflet bug of canvas renderer not updating
      this.props.leaflet.map._renderer._update();
    }    
  }
}

export default withLeaflet(ReactLeafletKml);
