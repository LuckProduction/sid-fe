import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.fullscreen';
import 'leaflet.fullscreen/Control.FullScreen.css';

const FullscreenControl = () => {
  const map = useMap();

  useEffect(() => {
    if (!map._fullscreenControlAdded) {
      const control = L.control.fullscreen({
        position: 'topleft'
      });
      control.addTo(map);
      map._fullscreenControlAdded = true; // custom flag
    }
    return () => {};
  }, [map]);

  return null;
};

export default FullscreenControl;
