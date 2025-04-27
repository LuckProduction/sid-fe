import { useKioskAuth } from '@/context/KiosAuth';
import { useCrudModal, usePagination, useService } from '@/hooks';
import { KioskService } from '@/services';
import { BASE_URL } from '@/utils/api';
import { CalendarOutlined, ClockCircleOutlined, LeftOutlined } from '@ant-design/icons';
import { Button, Card, Empty, Input, Pagination, Skeleton, Tag, Typography } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BrowseLetter = () => {
  const navigate = useNavigate();
  const { user } = useKioskAuth();
  const { execute, ...getAllSubmitLetter } = useService(KioskService.getAllSubmitLetter);
  const [filterValues, setFilterValues] = useState({ search: '', master_penduduk_id: user.id });
  const modal = useCrudModal();

  const pagination = usePagination({ totalData: getAllSubmitLetter.totalData });

  const fetchSubmitLetter = useCallback(() => {
    execute({
      page: pagination.page,
      per_page: 2,
      search: filterValues.search,
      master_penduduk_id: filterValues.master_penduduk_id
    });
  }, [execute, filterValues.master_penduduk_id, filterValues.search, pagination.page]);

  useEffect(() => {
    fetchSubmitLetter();
  }, [fetchSubmitLetter]);

  const submitLetter = getAllSubmitLetter.data ?? [];
  return (
    <>
      <section className="relative flex h-full w-full">
        <div className="flex h-full w-full flex-[2] items-center justify-center pb-60">
          <div className="flex flex-col px-24">
            <button className="mb-6 inline-flex items-center gap-x-2 text-sm" onClick={() => navigate(-1)}>
              <LeftOutlined />
              kembali
            </button>
            <Typography.Title level={1} style={{ marginTop: 0 }}>
              Riwayat Permohonan Surat
            </Typography.Title>
          </div>
        </div>
        <div className="flex h-full w-full flex-[4] items-center justify-center bg-blue-500">
          <div className="flex w-full max-w-2xl flex-col gap-y-4">
            <Input.Search allowClear onSearch={(values) => setFilterValues({ ...filterValues, search: values })} size="large" placeholder="Masukan nama surat" />
            <div className="flex flex-col gap-y-4">
              {getAllSubmitLetter.isLoading ? (
                Array.from({ length: 2 }, (_, i) => i).map((index) => (
                  <Card key={index}>
                    <Skeleton active />
                  </Card>
                ))
              ) : submitLetter.length === 0 ? (
                <Card className="py-12">
                  <Empty description="Riwayat Surat Tidak Ditemukan" />
                </Card>
              ) : (
                <>
                  {submitLetter.map((item) => (
                    <Card
                      title={
                        <div className="inline-flex items-center gap-x-4">
                          <div className="inline-flex items-center gap-x-2">
                            <CalendarOutlined />
                            {item.created_at}
                          </div>
                          <div className="inline-flex items-center gap-x-2">
                            <ClockCircleOutlined />
                            {item.created_at}
                          </div>
                        </div>
                      }
                      extra={(() => {
                        switch (item.status) {
                          case 'menunggu':
                            return <Tag color="warning">Menunggu</Tag>;
                          case 'verifikasi':
                            return <Tag color="blue">Verifikasi</Tag>;
                          case 'selesai':
                            return <Tag color="green">Selesai</Tag>;
                          case 'anjungan':
                            return <Tag color="green">Anjungan</Tag>;
                          default:
                            return <Tag color="default">{item.status}</Tag>;
                        }
                      })()}
                      key={item.id}
                    >
                      <div className="inline-flex w-full items-center justify-between">
                        <div className="flex flex-col gap-y-2">
                          <b className="text-xl">{item.token}</b>
                          <span className="text-lg">{item.letter_type.letter_name}</span>
                        </div>
                        <Button
                          disabled={item.status !== 'selesai' && item.status !== 'anjungan'}
                          size="large"
                          variant="solid"
                          color="primary"
                          onClick={() => {
                            modal.show.paragraph({
                              title: 'Print Surat',
                              width: 1000,
                              data: {
                                content: (
                                  <>
                                    <iframe
                                      style={{ aspectRatio: 16 / 9, width: '100%' }}
                                      className="h-full w-full"
                                      src={`${BASE_URL}/permohonan-surat/download/${item.token}`}
                                      title="YouTube video player"
                                      frameBorder="0"
                                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                      allowFullScreen
                                    ></iframe>
                                  </>
                                )
                              }
                            });
                          }}
                        >
                          Cetak Surat
                        </Button>
                      </div>
                    </Card>
                  ))}
                </>
              )}
            </div>
            <Card className="w-fit">
              <Pagination className="text-white" current={pagination.page} total={pagination.totalData} onChange={pagination.onChange} pageSize={2} />
            </Card>
          </div>
        </div>
        <div className="absolute bottom-0 w-[22rem]">
          <img src="/illustration/briefcase.png" />
        </div>
      </section>
    </>
  );
};

export default BrowseLetter;
