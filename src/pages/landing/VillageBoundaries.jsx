/* eslint-disable react-hooks/exhaustive-deps */
import { DataLoader, Reveal } from '@/components';
import { useService } from '@/hooks';
import { LandingService } from '@/services';
import { LeftOutlined } from '@ant-design/icons';
import { Card, Descriptions, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, GeoJSON } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';

const VillageBoundaries = () => {
  const { execute: fetchVillageBoundaries, ...getAllVillageBoundaries } = useService(LandingService.getAllVillageBoundaries);
  const [headVillageCoord, setHeadVillageCoord] = useState(null);
  const [geojsonData, setGeojsonData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchVillageBoundaries();
  }, [fetchVillageBoundaries]);

  const villageBoundaries = getAllVillageBoundaries.data ?? {};

  const formatGeoJsonUrl = (url) => {
    if (!url) return null;
    const path = url.split('/storage/')[1];
    return `http://desa1.localhost:8000/geojson?filename=${path}`;
  };

  useEffect(() => {
    if (villageBoundaries && villageBoundaries.administrative_file) {
      fetch(formatGeoJsonUrl(villageBoundaries.administrative_file), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/geo+json'
        },
        mode: 'cors'
      })
        .then((response) => response.json())
        .then((data) => {
          setGeojsonData(data);
        })
        .catch((error) => console.error('Error fetching GeoJSON:', error));
    }
  }, [villageBoundaries]);

  useEffect(() => {
    if (villageBoundaries && villageBoundaries.headvillage_coordinate) {
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
        {Object.keys(villageBoundaries).length === 0 ? (
          <div className="mx-auto max-w-screen-lg px-6 py-12">
            <DataLoader type="datatable" />
          </div>
        ) : (
          <div className="mx-auto grid max-w-screen-lg grid-cols-12 gap-4 px-6 py-12">
            <Card className="col-span-6 h-fit">
              <Descriptions column={1} bordered>
                <Descriptions.Item label="Batas Utara">{villageBoundaries.north}</Descriptions.Item>
                <Descriptions.Item label="Batas Selatan">{villageBoundaries.south}</Descriptions.Item>
                <Descriptions.Item label="Batas Timur">{villageBoundaries.east}</Descriptions.Item>
                <Descriptions.Item label="Batas Barat">{villageBoundaries.west}</Descriptions.Item>
                <Descriptions.Item label="Luas Wilayah">{villageBoundaries.area}</Descriptions.Item>
              </Descriptions>
            </Card>
            <Card className="col-span-6">
              <MapContainer center={[0.693, 122.4704]} zoom={8} style={{ height: '500px', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <GeoJSON ref={geojsonData} key={Math.random() + 1} data={geojsonData} />
                {headVillageCoord && (
                  <Marker position={headVillageCoord}>
                    <Popup>Kantor Kepala Desa</Popup>
                  </Marker>
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
