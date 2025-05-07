import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import CoordinatePicker from './CoordinatePicker';
import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useService } from '@/hooks';
import { LandingService } from '@/services';

// eslint-disable-next-line react/prop-types
const SetMapCenter = ({ center }) => {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView(center, 12);
    }
  }, [center, map]);

  return null;
};

const MapPicker = ({ form, handleValuesChange, realtimeData }) => {
  const { execute: fetchVillageBoundaries, data: villageBoundaries } = useService(LandingService.getAllVillageBoundaries);
  const [headVillageCoord, setHeadVillageCoord] = useState(null);

  useEffect(() => {
    fetchVillageBoundaries();
  }, [fetchVillageBoundaries]);

  useEffect(() => {
    if (villageBoundaries?.headvillage_coordinate) {
      const coords = villageBoundaries.headvillage_coordinate.split(',').map((c) => Number(c.trim()));
      if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
        setHeadVillageCoord([coords[1], coords[0]]); // [lat, lng]
      }
    }
  }, [villageBoundaries]);

  const mapRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
      }
    }, 300);
  }, []);

  const defaultCenter = [0.556174, 123.058548];

  return (
    <div style={{ height: '300px', marginBottom: '16px' }}>
      <MapContainer center={defaultCenter} zoom={6} style={{ height: '100%', width: '100%' }} whenCreated={(map) => (mapRef.current = map)}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <SetMapCenter center={headVillageCoord} />
        <CoordinatePicker
          onChange={(coords) => {
            form.setFieldsValue({ latitude: coords[0], longitude: coords[1] });
            handleValuesChange({ latitude: coords[0], longitude: coords[1] });
          }}
          initialPosition={realtimeData?.latitude && realtimeData?.longitude ? [realtimeData.latitude, realtimeData.longitude] : null}
        />
      </MapContainer>
    </div>
  );
};

MapPicker.propTypes = {
  form: PropTypes.object.isRequired,
  handleValuesChange: PropTypes.func.isRequired,
  realtimeData: PropTypes.object
};

export default MapPicker;
