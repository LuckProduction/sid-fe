import { Reveal } from '@/components';
import { useCrudModal, useService } from '@/hooks';
import { LandingService } from '@/services';
import { rupiahFormat } from '@/utils/rupiahFormat';
import { EyeOutlined, PushpinOutlined, UserOutlined, WhatsAppOutlined } from '@ant-design/icons';
import { Button, Card, Descriptions, Image, Skeleton, Tag, Typography } from 'antd';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const DetailVillageEnterprise = () => {
  const { slug } = useParams();
  const { execute: fetchDetailEnterprise, ...getAllDetailEnterprise } = useService(LandingService.getDetailEnterprise);
  const modal = useCrudModal();

  useEffect(() => {
    fetchDetailEnterprise(slug);
  }, [fetchDetailEnterprise, slug]);

  const detailEnterprise = getAllDetailEnterprise.data ?? {};

  return (
    <>
      <section className="mx-auto w-full max-w-screen-md px-4 pt-24">
        <img src={detailEnterprise.foto} className="aspect-video w-full rounded-lg object-cover" />
      </section>
      <section className="mx-auto w-full max-w-screen-md px-4 pb-16 pt-12">
        {Object.keys(detailEnterprise).length === 0 ? (
          <Skeleton active />
        ) : (
          <>
            <Typography.Title level={1}>
              {detailEnterprise.enterprise_name} {`(${detailEnterprise.resident.full_name})`}
            </Typography.Title>
            <Descriptions className="mt-12" bordered column={1}>
              <Descriptions.Item label="Nama Lapak BUMDes">{detailEnterprise.enterprise_name}</Descriptions.Item>
              <Descriptions.Item label="Deskripsi">{detailEnterprise.desc}</Descriptions.Item>

              <Descriptions.Item label="Kontak (WA)">
                <Button icon={<WhatsAppOutlined />} variant="outlined" color="green" onClick={() => window.open(`https://wa.me/${detailEnterprise.contact}`, '_blank')}>
                  WhatsApp
                </Button>
              </Descriptions.Item>
              <Descriptions.Item label="Lokasi (GMAPS)">
                {detailEnterprise.coordinate &&
                  (() => {
                    const [longitude, latitude] = detailEnterprise.coordinate.split(',').map((coord) => coord.trim());
                    return (
                      <Button icon={<PushpinOutlined />} variant="outlined" color="red" onClick={() => window.open(`https://www.google.com/maps?q=${latitude},${longitude}`, '_blank', 'noopener,noreferrer')}>
                        Google Maps
                      </Button>
                    );
                  })()}
              </Descriptions.Item>
              <Descriptions.Item label="Informasi Pemilik">
                <Button
                  icon={<UserOutlined />}
                  variant="outlined"
                  color="primary"
                  onClick={() => {
                    modal.show.description({
                      title: detailEnterprise.enterprise_name,
                      data: [
                        {
                          key: 'full_name',
                          label: `Nama`,
                          children: detailEnterprise.resident.full_name
                        },
                        {
                          key: 'gender',
                          label: `Jenis Kelamin`,
                          children: detailEnterprise.resident.gender
                        },
                        {
                          key: 'foto',
                          label: `Foto `,
                          children: <Image width={120} src={detailEnterprise.resident.foto} />
                        },
                        {
                          key: 'family_relation',
                          label: `Hubungan Keluarga`,
                          children: detailEnterprise.resident.family_relation
                        },
                        {
                          key: 'resident_status',
                          label: `Status Perkawinan`,
                          children: detailEnterprise.resident.resident_status
                        }
                      ]
                    });
                  }}
                >
                  Pemilik
                </Button>
              </Descriptions.Item>
            </Descriptions>
          </>
        )}
      </section>
      <section className="mx-auto flex w-full max-w-screen-md flex-col gap-y-6 px-4 pb-20">
        <div className="flex flex-col items-end justify-between gap-y-6 md:flex-row">
          <div className="flex w-full flex-col gap-y-2">
            <Reveal>
              <p className="text-xl font-semibold">Menu Lapak</p>
            </Reveal>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-4">
          {getAllDetailEnterprise.isLoading
            ? Array.from({ length: 5 }, (_, i) => i).map((index) => (
                <Card className="col-span-12 md:col-span-6 lg:col-span-3" key={index}>
                  <Skeleton active />
                </Card>
              ))
            : detailEnterprise?.enterprise_menu?.map((item, index) => (
                <Card
                  key={index}
                  className="col-span-12 w-full md:col-span-6 lg:col-span-3"
                  cover={<img className={item.status === 'tersedia' ? 'grayscale-0' : 'grayscale'} alt="example" style={{ height: '120px', objectFit: 'cover' }} src={item.foto} />}
                >
                  <Reveal>
                    <b className="news-text">{item.menu_name}</b>
                  </Reveal>
                  <Reveal>
                    <Tag className="news-text mb-4 mt-2" color={item.status === 'tersedia' ? 'blue' : 'red'}>
                      {item.status}
                    </Tag>
                  </Reveal>
                  <Reveal>
                    <div className="text-xl font-semibold">{rupiahFormat(item.price)}</div>
                  </Reveal>

                  <div className="mt-2 flex flex-col gap-y-1">
                    <div className="inline-flex items-center gap-x-2 text-xs text-gray-400">
                      <EyeOutlined className="text-xs" />
                      {item.seen}
                    </div>
                  </div>
                </Card>
              ))}
        </div>
      </section>
    </>
  );
};

export default DetailVillageEnterprise;
