import { Reveal } from '@/components';
import { useService } from '@/hooks';
import { LandingService } from '@/services';
import { LeftOutlined } from '@ant-design/icons';
import { Card, Descriptions, Typography } from 'antd';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const VillageOfficials = () => {
  const navigate = useNavigate();
  const { execute: fetchVillageOfficials, ...getAllVillageOfficials } = useService(LandingService.getAllVillageOfficials);

  useEffect(() => {
    fetchVillageOfficials();
  }, [fetchVillageOfficials]);

  const villageOfficials = getAllVillageOfficials.data ?? [];
  const headVillage = villageOfficials.find((v) => v.employment?.employment_name === 'Kepala Desa');
  const otherOfficials = villageOfficials.filter((v) => v.employment?.employment_name !== 'Kepala Desa');

  return (
    <>
      <section className="relative w-full bg-blue-500 text-white">
        <div className="relative z-10 mx-auto max-w-screen-xl px-6 py-24">
          <button className="mb-12 inline-flex items-center gap-x-2 text-sm" onClick={() => navigate(-1)}>
            <LeftOutlined />
            kembali
          </button>
          <Reveal>
            <Typography.Title style={{ color: '#fff' }}>Perangkat Desa</Typography.Title>
          </Reveal>
          <Reveal>
            <div className="max-w-lg">
              <small>Temukan informasi lengkap tentang struktur organisasi desa, tugas dan tanggung jawab setiap perangkat desa, serta peraturan dan kebijakan yang mendukung tata kelola pemerintahan desa yang transparan dan akuntabel.</small>
            </div>
          </Reveal>
        </div>
        <img src="/illustration/city_sillhoute_transparent.png" className="absolute bottom-0 left-0 z-0 w-full" />
      </section>
      <section>
        <div className="mx-auto flex max-w-screen-lg flex-col items-center gap-y-6 px-6 py-24">
          <Typography.Title level={4}>
            Kepala <span className="text-blue-500">Desa</span>{' '}
          </Typography.Title>
          {headVillage && (
            <Card className="w-full max-w-2xl">
              <div className="flex w-full flex-col gap-x-6 gap-y-6 lg:flex-row">
                <div className="flex items-center justify-center">
                  <div className="flex h-52 w-52 items-start justify-center overflow-hidden rounded-lg border-4 border-gray-200">
                    <img src={headVillage.image} className="w-full rounded-lg" alt={headVillage.name} />
                  </div>
                </div>
                <div className="w-full">
                  <Descriptions bordered column={1}>
                    z
                    <Descriptions.Item label="Nama Kepala Desa">
                      <Typography.Title level={5}>{headVillage.name}</Typography.Title>
                    </Descriptions.Item>
                    <Descriptions.Item label="Jenis Kelamin">{headVillage.gender}</Descriptions.Item>
                    <Descriptions.Item label="Tempat Lahir">{headVillage.birth_place}</Descriptions.Item>
                    <Descriptions.Item label="Kontak">{headVillage.phone_number}</Descriptions.Item>
                  </Descriptions>
                </div>
              </div>
            </Card>
          )}
          <hr className="mb-6 mt-6 w-full" />
          <Typography.Title level={4}>
            Perangkat <span className="text-blue-500">Desa </span>{' '}
          </Typography.Title>

          <div className="grid w-full grid-cols-6 gap-12">
            {otherOfficials.map((official) => (
              <Card key={official.id} className="col-span-6 md:col-span-3 lg:col-span-2">
                <div className="flex flex-col items-center gap-y-2">
                  <div className="mb-2 flex w-full items-center justify-center">
                    <div className="flex h-52 w-52 items-center overflow-hidden rounded-lg border-8 border-gray-200">
                      <img src={official.image} className="h-full w-full rounded-lg object-cover" alt={official.name} />
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-y-2">
                    <Typography.Title level={5} style={{ margin: 0 }} className="mb-1 text-center">
                      {official.name}
                    </Typography.Title>
                    <p className="text-center">{official.employment.employment_name}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default VillageOfficials;
