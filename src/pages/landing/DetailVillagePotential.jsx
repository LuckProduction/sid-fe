import { useService } from '@/hooks';
import { LandingService } from '@/services';
import { EyeOutlined } from '@ant-design/icons';
import { Card, Skeleton, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { useParams } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';

const DetailVillagePotential = () => {
  const { slug } = useParams();
  const { execute: fetchVillagePotential, ...getAllVillagePotential } = useService(LandingService.getDetailVillagePotential);
  const [coordinate, setCoodinate] = useState(null);

  useEffect(() => {
    fetchVillagePotential(slug);
  }, [fetchVillagePotential, slug]);

  const villagePotential = getAllVillagePotential.data ?? {};

  useEffect(() => {
    if (villagePotential.coordinate) {
      const coords = villagePotential.coordinate.split(', ').map(Number);
      if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
        setCoodinate([coords[1], coords[0]]);
      }
    }
  }, [villagePotential.coordinate]);

  return (
    <>
      <section className="mx-auto w-full max-w-screen-md px-4 pt-24">
        <img src={villagePotential.foto} className="aspect-video w-full rounded-lg object-cover" />
      </section>
      <section className="mx-auto w-full max-w-screen-md px-4 pb-16 pt-12">
        {Object.keys(villagePotential).length === 0 ? (
          <Skeleton active />
        ) : (
          <>
            <Typography.Title level={1}>{villagePotential.potential_name}</Typography.Title>
            <div className="mb-12 flex w-full items-center gap-x-4">
              <div className="inline-flex items-center gap-x-2 text-xs text-gray-400">
                <EyeOutlined className="text-xs" />
                {villagePotential.seen}
              </div>
              <div className="inline-flex items-center text-xs text-gray-400">{villagePotential.created_at}</div>
            </div>
            <div className="mb-12">{villagePotential.description ? villagePotential.description : <Skeleton active />}</div>
            <Typography.Title level={3}>{villagePotential.location}</Typography.Title>
            <Card>
              <MapContainer center={[0.693, 122.4704]} zoom={8} style={{ height: '500px', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {coordinate && (
                  <Marker position={coordinate}>
                    <Popup>Lokasi Potensi Desa</Popup>
                  </Marker>
                )}
              </MapContainer>
            </Card>
          </>
        )}
      </section>
    </>
  );
};

export default DetailVillagePotential;
