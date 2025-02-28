import { Reveal } from '@/components';
import { useService } from '@/hooks';
import { LandingService } from '@/services';
import { LeftOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const VillageOfficials = () => {
  const navigate = useNavigate();
  const { execute: fetchVillageOfficials, ...getAllVillageOfficials } = useService(LandingService.getAllVillageOfficials);

  useEffect(() => {
    fetchVillageOfficials();
  }, [fetchVillageOfficials]);

  const villageOfficials = getAllVillageOfficials.data ?? [];
  const headVillage = villageOfficials.find((v) => v.employment?.employment_name === 'kepala desa');
  const otherOfficials = villageOfficials.filter((v) => v.employment?.employment_name !== 'kepala desa');

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
        <div className="mx-auto flex max-w-screen-lg flex-col gap-y-6 px-6 py-24">
          {headVillage && (
            <div className="mb-24 flex w-full items-center gap-x-6">
              <div className="flex w-full items-center justify-center">
                <div className="h-64 w-64 overflow-hidden rounded-full border-8 border-gray-200">
                  <img src={headVillage.image} className="w-full" alt={headVillage.name} />
                </div>
              </div>
              <div className="flex w-full flex-col gap-y-2">
                <Typography.Title level={2}>{headVillage.name}</Typography.Title>
                <b>{headVillage.employment.employment_name}</b>
                <p>NIP : {headVillage.nip}</p>
                <p>Alamat : {headVillage.address}</p>
              </div>
            </div>
          )}
          <hr className="mb-24" />
          <div className="grid w-full grid-cols-12 gap-12">
            {otherOfficials.map((official) => (
              <div key={official.id} className="col-span-4 flex flex-col items-center gap-y-2">
                <div className="flex w-full items-center justify-center">
                  <div className="h-52 w-52 overflow-hidden rounded-full border-8 border-gray-200">
                    <img src={official.image} className="w-full" alt={official.name} />
                  </div>
                </div>
                <div className="flex flex-col items-center gap-y-2">
                  <Typography.Title level={4} className="text-center">
                    {official.name}
                  </Typography.Title>
                  <b className="text-center">{official.employment.employment_name}</b>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default VillageOfficials;
