import { useService } from '@/hooks';
import { KioskService } from '@/services';
import dateFormatter from '@/utils/dateFormatter';
import timeAgo from '@/utils/timeAgo';
import { CalendarOutlined, ClockCircleOutlined, LeftOutlined } from '@ant-design/icons';
import { Card, Descriptions, Skeleton, Tag, Typography } from 'antd';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const DetailVillageReport = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { execute: fetchDetailReport, ...getAllDetailReport } = useService(KioskService.getDetailReport);

  useEffect(() => {
    fetchDetailReport(id);
  }, [fetchDetailReport, id]);

  const detailReport = getAllDetailReport.data ?? {};

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
        {Object.keys(detailReport).length === 0 ? (
          <div className="flex w-full max-w-2xl flex-col gap-y-4">
            <Card>
              <Skeleton active />
            </Card>
            <Card>
              <Skeleton active />
            </Card>
          </div>
        ) : (
          <div className="flex w-full max-w-2xl flex-col gap-y-4">
            <div className="flex w-full items-center justify-between">
              <Typography.Title level={3} style={{ color: '#fff', margin: 0 }}>
                {detailReport.token}
              </Typography.Title>
              <Tag>{detailReport.status}</Tag>
            </div>
            <div className="flex w-full items-center justify-between text-white">
              <Typography.Title level={4} style={{ color: '#fff', margin: 0 }}>
                {detailReport.master_laporan_id.nama_laporan}
              </Typography.Title>
              <div className="flex items-center gap-x-6">
                <div className="flex items-center gap-x-2">
                  <CalendarOutlined />
                  {dateFormatter(detailReport.created_at)}
                </div>
                <div className="flex items-center gap-x-2">
                  <ClockCircleOutlined />
                  {timeAgo(detailReport.created_at)}
                </div>
              </div>
            </div>
            <Card>
              <div className="flex h-full max-h-72 flex-col gap-y-4 overflow-y-auto">
                <Descriptions bordered column={1} title="Laporan">
                  <Descriptions.Item label="Tipe Laporan">{detailReport.tipe_pelapor}</Descriptions.Item>
                </Descriptions>
                <Descriptions bordered column={1} title="Attribut">
                  {detailReport.atribut_laporan_penduduk.map((item) => (
                    <Descriptions.Item key={item.id} label={item.nama_atribut}>
                      {item.konten}
                    </Descriptions.Item>
                  ))}
                </Descriptions>
              </div>
            </Card>
          </div>
        )}
      </div>
      <div className="absolute bottom-0 w-[20rem]">
        <img src="/illustration/woman.png" />
      </div>
    </section>
  );
};

export default DetailVillageReport;
