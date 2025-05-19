import { useNotification, useService } from '@/hooks';
import { LandingService } from '@/services';
import { EyeOutlined, FacebookOutlined, ShareAltOutlined, WhatsAppOutlined, XOutlined } from '@ant-design/icons';
import { Button, Card, Skeleton, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { useParams } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import parse from 'html-react-parser';
import markerIconPng from 'leaflet/dist/images/marker-icon.png';
import markerShadowPng from 'leaflet/dist/images/marker-shadow.png';
import L from 'leaflet';
import { SocialMediaShare } from '@/utils/SocialMediaShare';
import { MapCenterUpdater } from '@/components';

const DetailVillagePotential = () => {
  const { error } = useNotification();
  const { slug } = useParams();
  const { execute: fetchVillagePotential, ...getAllVillagePotential } = useService(LandingService.getDetailVillagePotential);
  const [coordinate, setCoodinate] = useState(null);

  const customIcon = L.icon({
    iconUrl: markerIconPng,
    shadowUrl: markerShadowPng,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
  });

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

  const shareData = {
    title: villagePotential.potential_name,
    text: villagePotential.potential_name,
    url: window.location.href
  };

  const handleShare = async () => {
    try {
      if (window.navigator.share) {
        await window.navigator.share(shareData);
      } else {
        await window.navigator.clipboard.writeText(shareData.url);
        error('Gagal', 'Gagal Membagikan');
      }
    } catch (error) {
      error('Gagal membagikan:', error);
    }
  };

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
            <div className="mb-4 flex w-full items-center gap-x-4">
              <div className="inline-flex items-center gap-x-2 text-xs text-gray-400">
                <EyeOutlined className="text-xs" />
                {villagePotential.seen}
              </div>
              <div className="inline-flex items-center text-xs text-gray-400">{villagePotential.created_at}</div>
            </div>
            <div className="mb-12 flex flex-wrap gap-2">
              <Button
                icon={<FacebookOutlined />}
                color="blue"
                variant="filled"
                onClick={() =>
                  window.open(
                    SocialMediaShare({
                      currentUrl: window.location.href,
                      text: villagePotential.potential_name,
                      media: 'facebook'
                    }),
                    '_blank'
                  )
                }
              >
                Bagikan di Facebook
              </Button>
              <Button
                icon={<XOutlined />}
                color="default"
                variant="filled"
                onClick={() =>
                  window.open(
                    SocialMediaShare({
                      currentUrl: window.location.href,
                      text: villagePotential.potential_name,
                      media: 'x'
                    }),
                    '_blank'
                  )
                }
              >
                Bagikan di X
              </Button>
              <Button
                icon={<WhatsAppOutlined />}
                color="green"
                variant="filled"
                onClick={() =>
                  window.open(
                    SocialMediaShare({
                      currentUrl: window.location.href,
                      text: villagePotential.potential_name,
                      media: 'whatsapp'
                    }),
                    '_blank'
                  )
                }
              >
                Bagikan di WhatsApp
              </Button>
              <Button icon={<ShareAltOutlined />} color="default" variant="filled" onClick={handleShare} />
            </div>
            <div className="mb-12 text-justify leading-8">{villagePotential.description ? parse(villagePotential.description) : <Skeleton active />}</div>
            <Typography.Title level={3}>{villagePotential.location}</Typography.Title>
            <Card>
              <MapContainer center={coordinate || [0.693, 122.4704]} zoom={13} style={{ height: '500px', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {coordinate && (
                  <>
                    <Marker position={coordinate} icon={customIcon}>
                      <Popup>Lokasi Potensi Desa</Popup>
                    </Marker>
                    <MapCenterUpdater coordinate={coordinate} />
                  </>
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
