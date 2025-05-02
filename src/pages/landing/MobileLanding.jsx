import { Reveal } from '@/components';
import { AndroidOutlined } from '@ant-design/icons';
import { Button, Typography } from 'antd';

const MobileLanding = () => {
  return (
    <section className="relative h-screen w-full bg-white">
      <div className="relative z-10 mx-auto flex h-full max-w-screen-sm flex-col items-center justify-center px-6 text-center">
        <Reveal>
          <Typography.Title>
            Akses <span className="text-blue-500">Layanan</span> dalam Genggaman
          </Typography.Title>
        </Reveal>
        <Reveal>
          <div className="flex items-center justify-center">
            <small className="text-center">
              Unduh aplikasi <strong>Mobile Govillage</strong> sekarang dan pantau perkembangan laporan Anda serta akses berbagai layanan desa langsung dari smartphone Anda – cepat, mudah, dan praktis!
            </small>
          </div>
        </Reveal>
        <div className="mt-6">
          <Button onClick={() => window.open('https://drive.google.com/drive/folders/1q6SwIFI6a33eaItmRtXgbW_V7G791Fcy', '_blank')} icon={<AndroidOutlined />} variant="solid" color="primary" size="large">
            Download APK
          </Button>
        </div>
      </div>
      <img src="/illustration/city_sillhoute.png" className="absolute bottom-0 left-0 z-0 w-full" />
    </section>
  );
};

export default MobileLanding;
