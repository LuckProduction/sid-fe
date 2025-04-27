import { useKioskAuth } from '@/context/KiosAuth';
import { useNotification, useService } from '@/hooks';
import { KioskService, LandingService } from '@/services';
import dateFormatter from '@/utils/dateFormatter';
import timeAgo from '@/utils/timeAgo';
import { CommentOutlined, DownloadOutlined, LeftOutlined, LikeFilled, LikeOutlined, SendOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Image, Input, Skeleton, Timeline, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const DetailCitizenReport = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { user } = useKioskAuth();
  const { success, error } = useNotification();
  const { execute: fetchDetailCitizenReport, ...getDetailCitizenReport } = useService(LandingService.getDetailCitizenReport);
  const likeCitizenReport = useService(LandingService.likeCitizenReport);
  const createCitizenReply = useService(KioskService.storeCitizenReportReply);
  const [showReplies, setShowReplies] = useState(true);
  const [replyValue, setReplyValue] = useState('');

  useEffect(() => {
    fetchDetailCitizenReport(slug);
  }, [fetchDetailCitizenReport, slug]);

  const citizenReport = getDetailCitizenReport.data ?? {};

  return (
    <section className="relative flex h-full w-full">
      <div className="flex h-full w-full flex-[2] items-center justify-center pb-60">
        <div className="flex flex-col px-24">
          <button className="mb-6 inline-flex items-center gap-x-2 text-sm" onClick={() => navigate(-1)}>
            <LeftOutlined />
            kembali
          </button>
          <Typography.Title level={1} style={{ marginTop: 0 }}>
            Detail Pengaduan
          </Typography.Title>
        </div>
      </div>
      <div className="flex h-full w-full flex-[4] items-center justify-center bg-blue-500">
        <div className="flex w-full max-w-3xl flex-col gap-y-6">
          <div className="flex h-full max-h-[23rem] flex-col gap-y-6 overflow-y-auto">
            <Card>
              {Object.keys(citizenReport).length === 0 ? (
                <Skeleton active />
              ) : (
                <Timeline className="w-full">
                  <Timeline.Item dot={<Avatar className="bg-color-primary-100 text-color-primary-500 font-semibold" src={citizenReport?.resident?.foto} />}>
                    <div className="flex w-full flex-col gap-y-2 px-2">
                      <b className="text-sm">
                        {`(${citizenReport?.resident?.full_name} - ${timeAgo(citizenReport?.created_at)} )`} , {dateFormatter(citizenReport?.created_at)}{' '}
                      </b>
                      <p className="mt-2">{citizenReport?.desc}</p>
                      {citizenReport?.doc && (
                        <>
                          <hr className="my-2" />
                          <div className="flex flex-col gap-2">
                            <p>Lampiran :</p>

                            {!citizenReport.doc.split('.').pop().toLowerCase().includes('pdf') && <Image src={citizenReport.doc} width={200} height={200} />}

                            {citizenReport.doc.split('.').pop().toLowerCase() === 'pdf' && (
                              <Button icon={<DownloadOutlined />} className="w-fit" type="primary" onClick={() => window.open(citizenReport.doc, '_blank')}>
                                Unduh PDF
                              </Button>
                            )}
                          </div>
                        </>
                      )}
                      <div className="flex w-full items-center gap-x-2">
                        <Button
                          icon={citizenReport.has_like ? <LikeFilled className="text-blue-500" /> : <LikeOutlined />}
                          size="large"
                          className="w-full"
                          style={{ width: '100%' }}
                          onClick={async () => {
                            await likeCitizenReport.execute(citizenReport.id);
                            fetchDetailCitizenReport(slug);
                          }}
                        >
                          {String(citizenReport.liked)}
                        </Button>
                        <Button icon={<CommentOutlined />} size="large" className="w-full" style={{ width: '100%' }} onClick={() => setShowReplies(!showReplies)}>
                          {String(citizenReport.reply.length)}
                        </Button>
                      </div>
                    </div>
                  </Timeline.Item>
                  {showReplies &&
                    citizenReport?.reply.map((reply) => (
                      <Timeline.Item key={reply.id} dot={<Avatar src={reply?.resident?.foto} />}>
                        <Card className="ms-2 border">
                          <div className="flex flex-col gap-y-2">
                            <b className="text-sm">{`(${reply?.resident?.full_name} - ${timeAgo(reply?.created_at)} )`} ,</b>
                            <p className="mt-2">{reply?.content}</p>
                            {reply?.doc && (
                              <>
                                <hr className="my-2" />
                                <p>Lampiran :</p>

                                {!reply?.doc.split('.').pop().toLowerCase().includes('pdf') && <Image src={reply.doc} width={400} height={400} />}

                                {reply?.doc.split('.').pop().toLowerCase() === 'pdf' && (
                                  <Button icon={<DownloadOutlined />} className="w-fit" variant="solid" color="primary" onClick={() => window.open(reply?.doc, '_blank')}>
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
              )}
            </Card>
          </div>
          <Card>
            <div className="inline-flex w-full items-center gap-x-2">
              <Input className="w-full" size="large" placeholder="Tambahkan Komentar" onChange={(e) => setReplyValue(e.target.value)} />
              <Button
                icon={<SendOutlined />}
                shape="circle"
                size="large"
                variant="solid"
                color="primary"
                loading={createCitizenReply.isLoading}
                onClick={async () => {
                  const { message, isSuccess } = await createCitizenReply.execute({ layanan_pengaduan_id: citizenReport.id, konten: replyValue, master_penduduk_id: user.id });
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchDetailCitizenReport(slug);
                    setReplyValue('');
                  } else {
                    error('Gagal', message);
                  }
                  return isSuccess;
                }}
              />
            </div>
          </Card>
        </div>
      </div>
      <div className="absolute bottom-0 w-[17rem]">
        <img src="/illustration/rocket.png" />
      </div>
    </section>
  );
};

export default DetailCitizenReport;
