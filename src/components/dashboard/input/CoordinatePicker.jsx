/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { Marker, useMapEvents } from 'react-leaflet';
import markerIconPng from 'leaflet/dist/images/marker-icon.png';
import markerShadowPng from 'leaflet/dist/images/marker-shadow.png';
import L from 'leaflet';

const CoordinatePicker = ({ onChange, initialPosition }) => {
  const [position, setPosition] = useState(initialPosition || null);

  const customIcon = L.icon({
    iconUrl: markerIconPng,
    shadowUrl: markerShadowPng,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
  });

  useEffect(() => {
    setPosition(initialPosition || null);
  }, [initialPosition]);

  useMapEvents({
    click(e) {
      const newCoords = [e.latlng.lat, e.latlng.lng];
      setPosition(newCoords);
      onChange(newCoords);
    }
  });

  return position ? <Marker position={position} icon={customIcon} /> : null;
};

export default CoordinatePicker;
