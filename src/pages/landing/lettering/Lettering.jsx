import { Reveal } from '@/components';
import { FileOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Image, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

const CariSurat = () => {
  const navigate = useNavigate();
  return (
    <section className="w-full">
      <div className="flex w-full grid-cols-12 flex-col lg:flex-row">
        <div className="flex w-full flex-1 flex-col items-center justify-center gap-y-6 bg-blue-500 px-8 py-32">
          <Reveal>
            <Typography.Title level={2} style={{ color: '#ffff' }}>
              Cari Surat
            </Typography.Title>
          </Reveal>
          <Image src="/illustration/cari_surat.png" width={240} preview={false} className="mb-12" />
          <Reveal>
            <p className="max-w-xs text-center text-sm text-white">Cek status surat Anda kapan saja dengan token unik—mudah, cepat, tanpa ribet!</p>
          </Reveal>
          <Reveal>
            <Button onClick={() => navigate('/lettering/browse')} shape="round" variant="solid" size="large" icon={<SearchOutlined />}>
              Mulai Cari Surat
            </Button>
          </Reveal>
        </div>
        <div className="flex w-full flex-1 flex-col items-center justify-center gap-y-6 bg-blue-400 px-8 py-32">
          <Reveal>
            <Typography.Title level={2} style={{ color: '#ffff', textAlign: 'center' }}>
              Permohonan Surat
            </Typography.Title>
          </Reveal>
          <Image src="/illustration/permohonan_surat.png" width={230} preview={false} className="mb-12" />
          <Reveal>
            <p className="max-w-xs text-center text-sm text-white">Ajukan surat sesuai kebutuhan dalam hitungan menit—praktis, tanpa antre! 🚀</p>
          </Reveal>
          <Reveal>
            <Button onClick={() => navigate(window.location.pathname + '/submitletter')} shape="round" variant="solid" size="large" icon={<FileOutlined />}>
              Buat Permohonan
            </Button>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default CariSurat;
