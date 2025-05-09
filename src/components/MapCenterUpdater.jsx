import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

// eslint-disable-next-line react/prop-types
function MapCenterUpdater({ coordinate }) {
  const map = useMap();

  useEffect(() => {
    if (coordinate) {
      map.flyTo(coordinate, map.getZoom());
    }
  }, [coordinate, map]);

  return null;
}

export default MapCenterUpdater;
