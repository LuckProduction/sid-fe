import { DataLoader, MapCenterUpdater, Reveal } from '@/components';
import { useService } from '@/hooks';
import { LandingService } from '@/services';
import { LeftOutlined, PushpinOutlined } from '@ant-design/icons';
import { Button, Card, Descriptions, Empty, Typography } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, GeoJSON } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import markerIconPng from 'leaflet/dist/images/marker-icon.png';
import markerShadowPng from 'leaflet/dist/images/marker-shadow.png';
import L from 'leaflet';

const baseUrl = import.meta.env.VITE_BASE_URL;
const tenant = import.meta.env.VITE_TENANTS;

const VillageBoundaries = () => {
  const { execute: fetchVillageBoundaries, data: villageBoundaries, isLoading } = useService(LandingService.getAllVillageBoundaries);
  const [headVillageCoord, setHeadVillageCoord] = useState(null);
  const [geojsonData, setGeojsonData] = useState(null);
  const navigate = useNavigate();

  const customIcon = L.icon({
    iconUrl: markerIconPng,
    shadowUrl: markerShadowPng,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
  });

  useEffect(() => {
    fetchVillageBoundaries();
  }, [fetchVillageBoundaries]);

  const formatGeoJsonUrl = useCallback((url) => {
    if (!url) return null;
    const path = url.split('/storage/')[1];
    return baseUrl.replace('://', `://${tenant}.`) + `/geojson?filename=${path}`;
  }, []);

  useEffect(() => {
    if (villageBoundaries?.administrative_file) {
      fetch(formatGeoJsonUrl(villageBoundaries.administrative_file))
        .then((response) => response.json())
        .then((data) => setGeojsonData(data))
        .catch((error) => console.error('Error fetching GeoJSON:', error));
    }
  }, [formatGeoJsonUrl, villageBoundaries]);

  useEffect(() => {
    if (villageBoundaries?.headvillage_coordinate) {
      const coords = villageBoundaries.headvillage_coordinate.split(', ').map(Number);
      if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
        setHeadVillageCoord([coords[1], coords[0]]);
      }
    }
  }, [villageBoundaries]);

  return (
    <>
      <section className="relative w-full bg-blue-500 text-white">
        <div className="relative z-10 mx-auto max-w-screen-xl px-6 py-24">
          <button className="mb-12 inline-flex items-center gap-x-2 text-sm" onClick={() => navigate(-1)}>
            <LeftOutlined />
            kembali
          </button>
          <Reveal>
            <Typography.Title style={{ color: '#fff' }}>Batas Desa</Typography.Title>
          </Reveal>
          <Reveal>
            <div className="max-w-lg">
              <small>Mencegah tumpang tindih klaim dengan memastikan batas administratif desa resmi.</small>
            </div>
          </Reveal>
        </div>
        <img src="/illustration/city_sillhoute_transparent.png" className="absolute bottom-0 left-0 z-0 w-full" />
      </section>
      <section className="min-h-screen w-full bg-white">
        {isLoading ? (
          <div className="mx-auto max-w-screen-lg px-6 py-12">
            <DataLoader type="datatable" />
          </div>
        ) : !villageBoundaries ? (
          <div className="mx-auto max-w-screen-lg px-6 py-12 text-center">
            <Empty />
          </div>
        ) : (
          <div className="mx-auto grid max-w-screen-lg grid-cols-12 gap-4 px-6 py-12">
            <Card className="col-span-12 h-fit lg:col-span-6">
              <Descriptions column={1} bordered>
                <Descriptions.Item label="Batas Utara">{villageBoundaries.north}</Descriptions.Item>
                <Descriptions.Item label="Batas Selatan">{villageBoundaries.south}</Descriptions.Item>
                <Descriptions.Item label="Batas Timur">{villageBoundaries.east}</Descriptions.Item>
                <Descriptions.Item label="Batas Barat">{villageBoundaries.west}</Descriptions.Item>
                <Descriptions.Item label="Luas Wilayah">{villageBoundaries.area}</Descriptions.Item>
                <Descriptions.Item label="Lokasi Kantor Desa (GMAPS)">
                  {villageBoundaries.headvillage_coordinate &&
                    (() => {
                      const [longitude, latitude] = villageBoundaries.headvillage_coordinate.split(',').map((coord) => coord.trim());
                      return (
                        <Button icon={<PushpinOutlined />} variant="outlined" color="red" onClick={() => window.open(`https://www.google.com/maps?q=${latitude},${longitude}`, '_blank', 'noopener,noreferrer')}>
                          Google Maps
                        </Button>
                      );
                    })()}
                </Descriptions.Item>
              </Descriptions>
            </Card>
            <Card className="col-span-12 lg:col-span-6">
              <MapContainer center={headVillageCoord || [0.693, 122.4704]} zoom={13} style={{ height: '500px', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {geojsonData && <GeoJSON key={Math.random()} data={geojsonData} />}
                {headVillageCoord && (
                  <>
                    <Marker position={headVillageCoord} icon={customIcon}>
                      <Popup>Kantor Kepala Desa</Popup>
                    </Marker>
                    <MapCenterUpdater coordinate={headVillageCoord} />
                  </>
                )}
              </MapContainer>
            </Card>
          </div>
        )}
      </section>
    </>
  );
};

export default VillageBoundaries;
