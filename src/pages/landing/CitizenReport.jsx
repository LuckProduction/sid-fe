import { Reveal } from '@/components';
import Modul from '@/constants/Modul';
import { useCrudModal, useNotification, useService } from '@/hooks';
import { LandingService } from '@/services';
import { DownloadOutlined, LeftOutlined, LikeOutlined, PlusOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Input, Skeleton, Timeline, Tooltip, Typography } from 'antd';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createFormFields } from '../dashboard/citizenReport/FormFields';
import timeAgo from '@/utils/timeAgo';

const CitizenReport = () => {
  const navigate = useNavigate();
  const modal = useCrudModal();
  const { success, error } = useNotification();
  const { execute, ...getAllCitizenReport } = useService(LandingService.getAllCitizenReports);
  const [filterValues, setFilterValues] = useState({ search: '', status: null });
  const [pagination, setPagination] = useState({ page: 1, per_page: 10 });
  const [showReplies, setShowReplies] = useState({});
  const storeCitizenReport = useService(LandingService.storeCitizenReport);
  const likeCitizenReport = useService(LandingService.likeCitizenReport);

  const sentinelRef = useRef(null);

  const fetchCitizenReport = useCallback(() => {
    execute({
      page: pagination.page,
      per_page: pagination.per_page,
      search: filterValues.search,
      status: filterValues.status
    });
  }, [execute, filterValues.search, filterValues.status, pagination.page, pagination.per_page]);

  useEffect(() => {
    fetchCitizenReport();
  }, [fetchCitizenReport]);

  const citizenReport = getAllCitizenReport.data ?? [];

  const toggleReplies = (reportId) => {
    setShowReplies((prevState) => ({
      ...prevState,
      [reportId]: !prevState[reportId]
    }));
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPagination((prev) => ({
            ...prev,
            per_page: prev.per_page + 10 // Tambah jumlah data yang diambil
          }));
        }
      },
      { threshold: 1.0 }
    );

    const currentSentinel = sentinelRef.current;

    if (currentSentinel) {
      observer.observe(currentSentinel);
    }

    return () => {
      if (currentSentinel) {
        observer.unobserve(currentSentinel);
      }
    };
  }, []);

  return (
    <>
      <section className="relative w-full bg-blue-500 text-white">
        <div className="relative z-10 mx-auto max-w-screen-xl px-6 py-24">
          <button className="mb-12 inline-flex items-center gap-x-2 text-sm" onClick={() => navigate(-1)}>
            <LeftOutlined />
            kembali
          </button>
          <Reveal>
            <Typography.Title style={{ color: '#fff' }}>Pengaduan Masyarakat</Typography.Title>
          </Reveal>
          <Reveal>
            <div className="max-w-lg">
              <small>Laporkan permasalahan di desa Anda dengan mudah! Sampaikan pengaduan mengenai fasilitas, layanan, atau kejadian penting lainnya secara real-time untuk perbaikan dan tindak lanjut yang lebih cepat.</small>
            </div>
          </Reveal>
        </div>
        <img src="/illustration/city_sillhoute_transparent.png" className="absolute bottom-0 left-0 z-0 w-full" />
      </section>
      <section>
        <div className="mx-auto flex w-full max-w-screen-lg flex-col gap-y-2 px-6 py-24">
          <div className="flex w-full items-center gap-x-2">
            <Tooltip title="Buat Pengaduan">
              <Button
                icon={<PlusOutlined />}
                shape="circle"
                size="large"
                variant="solid"
                color="primary"
                onClick={() => {
                  modal.create({
                    title: `Tambah ${Modul.CITIZEN_REPORT}`,
                    formFields: createFormFields,
                    onSubmit: async (values) => {
                      const { message, isSuccess } = await storeCitizenReport.execute(values, values.doc.file);
                      if (isSuccess) {
                        success('Berhasil', message);
                        fetchCitizenReport({ page: pagination.page, per_page: pagination.per_page });
                      } else {
                        error('Gagal', message);
                      }
                      return isSuccess;
                    }
                  });
                }}
              />
            </Tooltip>
            <Input.Search size="large" placeholder="Cari Topik Pengaduan" onSearch={(values) => setFilterValues({ ...filterValues, search: values })} />
          </div>
          <div className="flex w-full flex-col divide-y-2">
            {citizenReport?.map((reportItem) => (
              <div key={reportItem.id} className="px-4 pb-6 pt-12">
                <Timeline>
                  <Timeline.Item dot={<Avatar className="bg-color-primary-100 text-color-primary-500 font-semibold" src={reportItem?.resident?.foto} />}>
                    <Card
                      actions={[
                        <div key="like" className="inline-flex items-center gap-x-2">
                          <LikeOutlined
                            onClick={async () => {
                              await likeCitizenReport.execute(reportItem.id);
                              fetchCitizenReport();
                            }}
                          />
                          {String(reportItem.liked)}
                        </div>
                      ]}
                      className="ms-2 border bg-gray-100"
                      title={
                        <div className="">
                          {`(${reportItem?.resident?.full_name})`}, {reportItem?.report_title}
                        </div>
                      }
                      extra={<div className="">{timeAgo(reportItem?.created_at)}</div>}
                    >
                      <div className="flex flex-col gap-y-2">
                        {reportItem?.desc}
                        <hr className="my-2" />
                        <p>Lampiran :</p>
                        {reportItem?.doc && !reportItem.doc.split('.').pop().toLowerCase().includes('pdf') && <img className="max-w-96" src={reportItem?.doc} alt="Lampiran" />}

                        {reportItem?.doc && reportItem.doc.split('.').pop().toLowerCase() === 'pdf' && (
                          <Button icon={<DownloadOutlined />} className="w-fit" variant="solid" color="primary" onClick={() => window.open(reportItem?.doc, '_blank')}>
                            Unduh PDF
                          </Button>
                        )}
                      </div>
                    </Card>
                  </Timeline.Item>
                  {showReplies[reportItem.id] &&
                    reportItem?.reply.map((reply) => (
                      <Timeline.Item key={reply.id} dot={<Avatar src={reply?.resident?.foto} />}>
                        <Card className="ms-2 border" title={<div className="">Balasan, {`(${reply?.resident?.full_name})`}, </div>} extra={<div className="">{timeAgo(reply?.created_at)}</div>}>
                          <div className="flex flex-col gap-y-2">
                            {reply?.content}
                            <hr className="my-2" />
                            <p>Lampiran :</p>
                            {reply?.doc !== null && (
                              <Button icon={<DownloadOutlined />} className="w-fit" variant="solid" color="primary" onClick={() => window.open(reply?.doc, '_blank')}>
                                Dokumen
                              </Button>
                            )}
                          </div>
                        </Card>
                      </Timeline.Item>
                    ))}
                </Timeline>
                <Button className="mt-2 w-full" variant="filled" color="primary" onClick={() => toggleReplies(reportItem.id)}>
                  {showReplies[reportItem.id] ? 'Sembunyikan Balasan' : 'Tampilkan Balasan'}
                </Button>
              </div>
            ))}
          </div>
          {getAllCitizenReport.isLoading && <Skeleton active className="mt-4" />}
        </div>
      </section>
      <div ref={sentinelRef} className="h-10 w-full"></div>
    </>
  );
};

export default CitizenReport;
