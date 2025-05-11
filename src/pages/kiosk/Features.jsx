import { useKioskAuth } from '@/context/KiosAuth';
import { CommentOutlined, DollarOutlined, FileProtectOutlined, UserOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

const Features = () => {
  const navigate = useNavigate();
  const { user } = useKioskAuth();

  return (
    <section className="relative flex h-full w-full">
      <div className="flex h-full w-full flex-[2] items-center justify-center pb-60">
        <div className="flex flex-col px-24">
          <Typography.Paragraph>Hai!!! {user?.full_name ?? 'Pengguna'}</Typography.Paragraph>
          <Typography.Title level={2} style={{ marginTop: 0 }}>
            Mau Apa Hari Ini?
          </Typography.Title>
        </div>
      </div>
      <div className="flex h-full w-full flex-[4] items-center justify-center bg-blue-500">
        <div className="grid max-w-xl grid-cols-2 gap-6">
          <button
            disabled={!user}
            onClick={() => navigate('/kiosk/features/lettering')}
            className={`col-span-1 flex flex-col items-center justify-center gap-y-4 rounded-md bg-white p-16 ${!user ? 'cursor-not-allowed text-green-200' : 'cursor-pointer text-green-500'} transition-all duration-300 hover:-translate-y-2`}
          >
            <FileProtectOutlined className="text-6xl" />
            Permohonan Surat
          </button>
          <button
            disabled={!user}
            onClick={() => navigate('/kiosk/features/citizen_report/citizen_report_list')}
            className={`col-span-1 flex flex-col items-center justify-center gap-y-4 rounded-md bg-white p-16 ${!user ? 'cursor-not-allowed text-purple-200' : 'cursor-pointer text-purple-500'} transition-all duration-300 hover:-translate-y-2`}
          >
            <CommentOutlined className="text-6xl" />
            Pengaduan
          </button>
          <button onClick={() => navigate('/kiosk/features/village_report')} className={`col-span-1 flex flex-col items-center justify-center gap-y-4 rounded-md bg-white p-16 text-orange-500 transition-all duration-300 hover:-translate-y-2`}>
            <UserOutlined className="text-6xl" />
            Lapor Penduduk
          </button>
          <button
            disabled={!user}
            onClick={() => navigate('/kiosk/features/public_service')}
            className={`col-span-1 flex flex-col items-center justify-center gap-y-4 rounded-md bg-white p-16 ${!user ? 'cursor-not-allowed text-blue-200' : 'cursor-pointer text-blue-500'} transition-all duration-300 hover:-translate-y-2`}
          >
            <DollarOutlined className="text-6xl" />
            Bantuan Sosial / Cek Pajak
          </button>
        </div>
      </div>
      <div className="absolute bottom-0 w-[17rem]">
        <img src="/illustration/rocket.png" />
      </div>
    </section>
  );
};

export default Features;
