import { FileAddOutlined, FileSearchOutlined, LeftOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

const Lettering = () => {
  const navigate = useNavigate();
  return (
    <section className="relative flex h-full w-full">
      <div className="flex h-full w-full flex-[2] items-center justify-center pb-60">
        <div className="flex flex-col px-24">
          <button className="mb-6 inline-flex items-center gap-x-2 text-sm" onClick={() => navigate(-1)}>
            <LeftOutlined />
            kembali
          </button>
          <Typography.Title level={1} style={{ marginTop: 0 }}>
            Permohonan Surat
          </Typography.Title>
        </div>
      </div>
      <div className="flex h-full w-full flex-[4] items-center justify-center bg-blue-500">
        <div className="grid max-w-xl grid-cols-2 gap-6">
          <button onClick={() => navigate('/kiosk/features/lettering/browse_letter')} className="col-span-1 flex flex-col items-center justify-center gap-y-4 rounded-md bg-white p-16 text-blue-500 transition-all duration-300 hover:-translate-y-2">
            <FileSearchOutlined className="text-6xl" />
            Cari Permohonan Surat
          </button>
          <button onClick={() => navigate('/kiosk/features/lettering/submit_letter')} className="col-span-1 flex flex-col items-center justify-center gap-y-4 rounded-md bg-white p-16 text-blue-500 transition-all duration-300 hover:-translate-y-2">
            <FileAddOutlined className="text-6xl" />
            Buat Permohonan Surat
          </button>
        </div>
      </div>
      <div className="absolute bottom-0 w-[22rem]">
        <img src="/illustration/briefcase.png" />
      </div>
    </section>
  );
};

export default Lettering;
