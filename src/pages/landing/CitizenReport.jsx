import { Reveal } from '@/components';
import { useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import { LandingService } from '@/services';
import { CommentOutlined, DownloadOutlined, FacebookOutlined, HeartFilled, HeartOutlined, InfoCircleFilled, LeftOutlined, PlusOutlined, ShareAltOutlined, WhatsAppOutlined, XOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Dropdown, Image, Input, Modal, Pagination, Result, Skeleton, Timeline, Tooltip, Typography } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { createFormFields } from '../dashboard/citizenReport/FormFields';
import timeAgo from '@/utils/timeAgo';
import asset from '@/utils/asset';
import { SocialMediaShare } from '@/utils/SocialMediaShare';

const CitizenReport = () => {
  const navigate = useNavigate();
  const modal = useCrudModal();
  const { success, error } = useNotification();
  const { execute, ...getAllCitizenReport } = useService(LandingService.getAllCitizenReports);
  const [filterValues, setFilterValues] = useState({ search: '', status: null });
  const [showReplies, setShowReplies] = useState({});
  const pagination = usePagination({ totalData: getAllCitizenReport.totalData });
  const storeCitizenReport = useService(LandingService.storeCitizenReport);
  const likeCitizenReport = useService(LandingService.likeCitizenReport);
  const likeCitizenReportReply = useService(LandingService.likeCitizenReportReply);
  const [clueModal, setClueModal] = useState({ isModalOpen: false });

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

  const shareItems = [
    {
      label: 'Bagikan di Facebook',
      key: 'facebook',
      icon: <FacebookOutlined />
    },
    {
      label: 'Bagikan di WhatsApp',
      key: 'whatsapp',
      icon: <WhatsAppOutlined />
    },
    {
      label: 'Bagikan di X',
      key: 'x',
      icon: <XOutlined />
    },
    {
      label: 'Bagikan',
      key: 'share',
      icon: <ShareAltOutlined />
    }
  ];

  const handleShare = async (reportItem) => {
    const shareData = {
      title: reportItem.report_title,
      text: reportItem.report_title,
      url: window.location.href
    };
    try {
      if (window.navigator.share) {
        await window.navigator.share(shareData);
      } else {
        await window.navigator.clipboard.writeText(shareData.url);
        error('Gagal', 'Gagal Membagikan');
      }
    } catch (error) {
      error('Gagal membagikan:', error);
    }
  };

  const handleShareItemClick = (key, reportItem) => {
    switch (key) {
      case 'facebook':
        window.open(
          SocialMediaShare({
            currentUrl: window.location.href,
            text: reportItem.report_title,
            media: 'facebook'
          }),
          '_blank'
        );
        break;
      case 'x':
        window.open(
          SocialMediaShare({
            currentUrl: window.location.href,
            text: reportItem.report_title,
            media: 'x'
          }),
          '_blank'
        );
        break;
      case 'whatsapp':
        window.open(
          SocialMediaShare({
            currentUrl: window.location.href,
            text: reportItem.report_title,
            media: 'whatsapp'
          }),
          '_blank'
        );
        break;
      case 'share':
        handleShare(reportItem);
        break;
    }
  };

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
                  setClueModal({ isModalOpen: true });
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
                      title={<b className="text-sm">{reportItem?.resident?.full_name}</b>}
                      extra={<div className="text-sm">{timeAgo(reportItem?.created_at)}</div>}
                      actions={[
                        <div
                          key="like"
                          className="inline-flex items-center gap-x-2"
                          onClick={async () => {
                            await likeCitizenReport.execute(reportItem.id);
                            fetchCitizenReport();
                          }}
                        >
                          {reportItem.has_like ? <HeartFilled className="text-red-500" /> : <HeartOutlined />}
                          {String(reportItem.liked)}
                        </div>,
                        <div key="comment" className="inline-flex items-center gap-x-2" onClick={() => toggleReplies(reportItem.id)}>
                          <CommentOutlined />
                          {String(reportItem.reply.length)}
                        </div>,
                        <Dropdown
                          key="share"
                          menu={{
                            items: shareItems,
                            onClick: ({ key }) => handleShareItemClick(key, reportItem)
                          }}
                        >
                          <div className="inline-flex cursor-pointer items-center gap-x-2">
                            <ShareAltOutlined />
                          </div>
                        </Dropdown>
                      ]}
                      className="ms-2 border bg-gray-100"
                    >
                      <div className="flex flex-col gap-y-2">
                        <NavLink to={window.location.pathname + `/detail/${reportItem.slug}`} className="text-sm font-bold underline">
                          {reportItem?.report_title}
                        </NavLink>
                        <p className="mt-2">{reportItem?.desc}</p>
                        {reportItem?.doc && (
                          <>
                            <hr className="my-2" />
                            <div className="flex flex-col gap-2">
                              <p>Lampiran :</p>

                              {!reportItem.doc.split('.').pop().toLowerCase().includes('pdf') && <Image src={reportItem.doc} width={200} height={200} />}

                              {reportItem.doc.split('.').pop().toLowerCase() === 'pdf' && (
                                <Button icon={<DownloadOutlined />} className="w-fit" type="primary" onClick={() => window.open(reportItem.doc, '_blank')}>
                                  Unduh PDF
                                </Button>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </Card>
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
                              {reply.has_like ? <HeartFilled className="text-red-500" /> : <HeartOutlined />}
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
              </div>
            ))}
          </div>
          {getAllCitizenReport.isLoading && <Skeleton active className="mt-4" />}
          <div className="flex w-full items-center justify-center">
            <Pagination current={pagination.page} total={pagination.totalData} onChange={pagination.onChange} pageSize={pagination.per_page} />
          </div>
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
                      formFields: createFormFields,
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
    </>
  );
};

export default CitizenReport;
