import { useKioskAuth } from '@/context/KiosAuth';
import { usePagination, useService } from '@/hooks';
import { KioskService } from '@/services';
import dateFormatter from '@/utils/dateFormatter';
import timeAgo from '@/utils/timeAgo';
import { CalendarOutlined, ClockCircleOutlined, LeftOutlined } from '@ant-design/icons';
import { Card, Input, Pagination, Skeleton, Tag, Typography } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BrowseVillageReport = () => {
  const navigate = useNavigate();
  const { user } = useKioskAuth();
  const { execute, ...getAllVillageReport } = useService(KioskService.kioskBrowseReport);
  const [filterValues, setFilterValues] = useState({ search: '' });
  const pagination = usePagination({ totalData: getAllVillageReport.totalData });

  const fetchLegalProducts = useCallback(() => {
    execute({
      master_penduduk_id: user.id,
      search: filterValues.search,
      page: pagination.page,
      per_page: pagination.per_page
    });
  }, [execute, filterValues.search, pagination.page, pagination.per_page, user.id]);

  useEffect(() => {
    fetchLegalProducts();
  }, [fetchLegalProducts]);

  const villageReport = getAllVillageReport.data ?? {};
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
        <div className="flex w-full max-w-2xl flex-col gap-y-4">
          <Input.Search allowClear size="large" placeholder="Masukan Judul Laporan" onSearch={(values) => setFilterValues({ search: values })} />
          <div className="flex h-full max-h-[23rem] flex-col gap-y-4 overflow-y-auto">
            {!villageReport.length ? (
              <Card>
                <Skeleton active />
              </Card>
            ) : (
              <>
                {villageReport?.map((item) => (
                  <Card
                    className="cursor-pointer"
                    onClick={() => navigate('/kiosk/features/village_report/detail/' + item.id)}
                    key={item.id}
                    title={
                      <div className="inline-flex items-center gap-x-4">
                        <div className="inline-flex items-center gap-x-2">
                          <CalendarOutlined />
                          {dateFormatter(item.created_at)}
                        </div>
                        <div className="inline-flex items-center gap-x-2">
                          <ClockCircleOutlined />
                          {timeAgo(item.created_at)}
                        </div>
                      </div>
                    }
                    extra={(() => {
                      switch (item.status) {
                        case 'proses':
                          return <Tag color="blue">Proses</Tag>;
                        case 'tolak':
                          return <Tag color="error">Tolak</Tag>;
                        default:
                          return <Tag color="default">{item.status}</Tag>;
                      }
                    })()}
                  >
                    <div className="flex flex-col gap-y-2">
                      <b className="text-xl">{item.token}</b>
                      <span className="text-lg">{item.master_laporan_id.nama_laporan}</span>
                    </div>
                  </Card>
                ))}
              </>
            )}
          </div>
          <Card className="w-fit">
            <Pagination className="text-white" current={pagination.page} total={pagination.totalData} onChange={pagination.onChange} pageSize={pagination.per_page} />
          </Card>
        </div>
      </div>

      <div className="absolute bottom-0 w-[20rem]">
        <img src="/illustration/woman.png" />
      </div>
    </section>
  );
};

export default BrowseVillageReport;
