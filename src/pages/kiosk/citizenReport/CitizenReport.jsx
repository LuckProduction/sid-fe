import { useKioskAuth } from '@/context/KiosAuth';
import { useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import { createWithoutFile } from '@/pages/dashboard/citizenReport/FormFields';
import { LandingService } from '@/services';
import asset from '@/utils/asset';
import timeAgo from '@/utils/timeAgo';
import { CommentOutlined, DownloadOutlined, InfoCircleFilled, LeftOutlined, LikeFilled, LikeOutlined, PlusOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Image, Input, Modal, Result, Timeline, Tooltip, Typography } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CitizenReport = () => {
  const navigate = useNavigate();
  const [clueModal, setClueModal] = useState({ isModalOpen: false });
  const { success, error } = useNotification();
  const modal = useCrudModal();
  const { user } = useKioskAuth();
  const { execute, ...getAllCitizenReport } = useService(LandingService.getAllCitizenReports);
  const likeCitizenReport = useService(LandingService.likeCitizenReport);
  const likeCitizenReportReply = useService(LandingService.likeCitizenReportReply);
  const pagination = usePagination({ totalData: getAllCitizenReport.totalData });
  const [filterValues, setFilterValues] = useState({ search: '', status: null });
  const storeCitizenReport = useService(LandingService.storeCitizenReport);
  const [showReplies, setShowReplies] = useState({});

  const fetchCitizenReport = useCallback(() => {
    execute({
      page: pagination.page,
      per_page: pagination.per_page,
      search: filterValues.search,
      status: filterValues.status,
      master_penduduk_id: user.id
    });
  }, [execute, filterValues.search, filterValues.status, pagination.page, pagination.per_page, user.id]);

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
        <div className="flex w-full max-w-2xl flex-col gap-y-4">
          <div className="inline-flex items-center gap-x-2">
            <Tooltip title="Buat Pengaduan">
              <Button
                icon={<PlusOutlined />}
                shape="circle"
                size="large"
                variant="solid"
                onClick={() => {
                  setClueModal({ isModalOpen: true });
                }}
              />
            </Tooltip>
            <Input.Search allowClear size="large" placeholder="Masukan Judul Pengaduan" onSearch={(values) => setFilterValues({ ...filterValues, search: values })} />
          </div>
          <div className="flex h-full max-h-[28rem] flex-col gap-y-6 overflow-y-auto">
            {citizenReport?.map((reportItem) => (
              <Card key={reportItem.id} className="p-2">
                <Timeline>
                  <Timeline.Item dot={<Avatar className="bg-color-primary-100 text-color-primary-500 font-semibold" src={reportItem?.resident?.foto} />}>
                    <div className="flex w-full flex-col gap-y-2 px-2">
                      <b className="text-sm">{`(${reportItem?.resident?.full_name} - ${timeAgo(reportItem?.created_at)} )`} ,</b>
                      <b className="text-sm">{reportItem?.report_title}</b>
                      <p className="mt-2">{reportItem?.desc}</p>
                      {reportItem?.doc && (
                        <>
                          <hr className="my-2" />
                          <div className="flex flex-col gap-2">
                            <p>Lampiran :</p>

                            {!reportItem.doc.split('.').pop().toLowerCase().includes('pdf') && <img className="max-w-96" src={asset(reportItem.doc)} alt="Lampiran" />}

                            {reportItem.doc.split('.').pop().toLowerCase() === 'pdf' && (
                              <Button icon={<DownloadOutlined />} className="w-fit" type="primary" onClick={() => window.open(reportItem.doc, '_blank')}>
                                Unduh PDF
                              </Button>
                            )}
                          </div>
                        </>
                      )}
                      <div className="flex w-full items-center gap-x-2">
                        <Button
                          icon={reportItem.has_like ? <LikeFilled className="text-blue-500" /> : <LikeOutlined />}
                          size="large"
                          className="w-full"
                          style={{ width: '100%' }}
                          onClick={async () => {
                            await likeCitizenReport.execute(reportItem.id);
                            fetchCitizenReport();
                          }}
                        />
                        <Button icon={<CommentOutlined />} size="large" className="w-full" style={{ width: '100%' }} onClick={() => toggleReplies(reportItem.id)} />
                      </div>
                    </div>
                  </Timeline.Item>
                  {showReplies[reportItem.id] &&
                    reportItem?.reply.map((reply) => (
                      <Timeline.Item key={reply.id} dot={<Avatar src={reply?.resident?.foto} />}>
                        <Card
                          className="ms-2 border"
                          actions={[
                            <div
                              key="like"
                              className="inline-flex items-center gap-x-2"
                              onClick={async () => {
                                await likeCitizenReportReply.execute(reply.id);
                                fetchCitizenReport();
                              }}
                            >
                              {reply.has_like ? <LikeFilled className="text-blue-500" /> : <LikeOutlined />}
                              {String(reply.liked)}
                            </div>
                          ]}
                        >
                          <div className="flex flex-col gap-y-2">
                            <b className="text-sm">{`(${reply?.resident?.full_name} - ${timeAgo(reply?.created_at)} )`} ,</b>
                            <p className="mt-2">{reply?.content}</p>
                            {reply?.doc && (
                              <>
                                <hr className="my-2" />
                                <p>Lampiran :</p>

                                {!reply?.doc.split('.').pop().toLowerCase().includes('pdf') && <img className="max-w-96" src={asset(reply.doc)} alt="Lampiran" />}

                                {reply?.doc.split('.').pop().toLowerCase() === 'pdf' && (
                                  <Button icon={<DownloadOutlined />} className="w-fit" variant="solid" color="primary" onClick={() => window.open(asset(reply?.doc), '_blank')}>
                                    Dokumen
                                  </Button>
                                )}
                              </>
                            )}
                          </div>
                        </Card>
                      </Timeline.Item>
                    ))}
                </Timeline>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 w-[17rem]">
        <img src="/illustration/rocket.png" />
      </div>
      <Modal width={700} open={clueModal.isModalOpen} onCancel={() => setClueModal({ ...clueModal, isModalOpen: false })} footer={null}>
        <Result status="info" title="Buat Pengaduan" subTitle="Silakan buat pengaduan Anda dengan penuh tanggung jawab.">
          <div className="desc">
            <Typography.Paragraph>
              <Typography.Text
                strong
                style={{
                  fontSize: 16
                }}
              >
                Hal-hal yang perlu diperhatikan sebelum membuat pengaduan:
              </Typography.Text>
            </Typography.Paragraph>
            <Typography.Paragraph>
              <InfoCircleFilled className="text-blue-500" /> Pastikan pengaduan berkaitan dengan kejadian yang <b>aktual</b> atau benar-benar terjadi.
            </Typography.Paragraph>
            <Typography.Paragraph>
              <InfoCircleFilled className="text-blue-500" /> Sampaikan informasi secara <b>jelas dan informatif</b>, agar mudah dipahami dan ditindaklanjuti.
            </Typography.Paragraph>
            <Typography.Paragraph>
              <InfoCircleFilled className="text-blue-500" /> Isi kolom NIK jika Anda ingin pengaduan disampaikan secara <b>non-anonim</b> (dengan identitas).
              <br />
              <Image src="/illustration/pengaduan-nonanonim.png" />
            </Typography.Paragraph>
            <Typography.Paragraph>
              <InfoCircleFilled className="text-blue-500" /> Biarkan kolom NIK kosong jika Anda ingin pengaduan tetap <b>anonim</b> (tanpa menyebut identitas).
              <br />
              <Image src="/illustration/pengaduan-anonim.png" />
            </Typography.Paragraph>
            <div className="flex w-full items-center justify-center">
              <Button
                className="mt-4 w-full"
                color="primary"
                variant="solid"
                size="large"
                onClick={() => {
                  setClueModal({ isModalOpen: false });
                  modal.create({
                    title: `Buat Pengaduan`,
                    formFields: createWithoutFile,
                    onSubmit: async (values) => {
                      const { message, isSuccess } = await storeCitizenReport.execute(values, values.doc?.file ? values.doc.file : null);
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
              >
                Saya Siap Mengajukan Pengaduan
              </Button>
            </div>
          </div>
        </Result>
      </Modal>
    </section>
  );
};

export default CitizenReport;
