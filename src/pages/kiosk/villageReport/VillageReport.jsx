import { useKioskAuth } from '@/context/KiosAuth';
import { ExclamationCircleOutlined, HistoryOutlined, LeftOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

const VillageReport = () => {
  const navigate = useNavigate();
  const { user } = useKioskAuth();

  return (
    <section className="relative flex h-full w-full">
      <div className="flex h-full w-full flex-[2] items-center justify-center pb-60">
        <div className="flex flex-col px-24">
          <button className="mb-6 inline-flex items-center gap-x-2 text-sm" onClick={() => navigate(-1)}>
            <LeftOutlined />
            kembali
          </button>
          <Typography.Title level={1} style={{ marginTop: 0 }}>
            Lapor Penduduk
          </Typography.Title>
        </div>
      </div>
      <div className="flex h-full w-full flex-[4] items-center justify-center bg-blue-500">
        <div className="grid max-w-xl grid-cols-2 gap-6">
          <button
            disabled={!user}
            onClick={() => navigate('/kiosk/features/village_report/village_report_list')}
            className={`col-span-1 flex flex-col items-center justify-center gap-y-4 rounded-md bg-white p-16 ${!user ? 'cursor-not-allowed text-blue-200' : 'cursor-pointer text-blue-500'} transition-all duration-300 hover:-translate-y-2`}
          >
            <HistoryOutlined className="text-6xl" />
            Riwayat Lapor Penduduk
          </button>
          <button
            onClick={() => navigate('/kiosk/features/village_report/submit_village_report')}
            className="col-span-1 flex flex-col items-center justify-center gap-y-4 rounded-md bg-white p-16 text-blue-500 transition-all duration-300 hover:-translate-y-2"
          >
            <ExclamationCircleOutlined className="text-6xl" />
            Buat Laporan Penduduk
          </button>
        </div>
      </div>
      <div className="absolute bottom-0 w-[20rem]">
        <img src="/illustration/woman.png" />
      </div>
    </section>
  );
};

export default VillageReport;
