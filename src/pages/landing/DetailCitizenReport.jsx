import { useService } from '@/hooks';
import { LandingService } from '@/services';
import { SocialMediaShare } from '@/utils/SocialMediaShare';
import timeAgo from '@/utils/timeAgo';
import { CommentOutlined, DownloadOutlined, FacebookOutlined, HeartFilled, HeartOutlined, LeftOutlined, ShareAltOutlined, WhatsAppOutlined, XOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Dropdown, Image, Skeleton, Timeline } from 'antd';
import useNotification from 'antd/es/notification/useNotification';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const DetailCitizenReport = () => {
  const { error } = useNotification();
  const { slug } = useParams();
  const navigate = useNavigate();
  const { execute: fetchDetailCitizenReport, ...getDetailCitizenReport } = useService(LandingService.getDetailCitizenReport);
  const [showReplies, setShowReplies] = useState(true);
  const likeCitizenReport = useService(LandingService.likeCitizenReport);
  const likeCitizenReportReply = useService(LandingService.likeCitizenReportReply);

  useEffect(() => {
    fetchDetailCitizenReport(slug);
  }, [fetchDetailCitizenReport, slug]);

  const citizenReport = getDetailCitizenReport.data ?? {};

  const shareData = {
    title: citizenReport.report_title,
    text: citizenReport.report_title,
    url: window.location.href
  };

  const handleShare = async () => {
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

  const handleShareItemClick = ({ key }) => {
    switch (key) {
      case 'facebook':
        window.open(
          SocialMediaShare({
            currentUrl: window.location.href,
            text: citizenReport.report_title,
            media: 'facebook'
          }),
          '_blank'
        );
        break;
      case 'x':
        window.open(
          SocialMediaShare({
            currentUrl: window.location.href,
            text: citizenReport.report_title,
            media: 'x'
          }),
          '_blank'
        );
        break;
      case 'whatsapp':
        window.open(
          SocialMediaShare({
            currentUrl: window.location.href,
            text: citizenReport.report_title,
            media: 'whatsapp'
          }),
          '_blank'
        );
        break;
      case 'share':
        handleShare();
        break;
    }
  };

  return (
    <section className="mx-auto flex w-full max-w-screen-md gap-x-6 px-4 pb-16 pt-24">
      {Object.keys(citizenReport).length === 0 ? (
        <Skeleton active />
      ) : (
        <div className="flex w-full flex-col gap-y-2">
          <div className="mb-6 inline-flex items-center gap-x-2">
            <Button onClick={() => navigate(-1)} icon={<LeftOutlined />} color="primary" variant="solid">
              Kembali
            </Button>
          </div>
          <Timeline className="w-full">
            <Timeline.Item className="w-full" dot={<Avatar className="bg-color-primary-100 text-color-primary-500 font-semibold" src={citizenReport?.resident?.foto} />}>
              <Card
                classNames="w-full"
                title={<b className="text-sm">{citizenReport?.resident?.full_name}</b>}
                extra={<div className="text-sm">{timeAgo(citizenReport?.created_at)}</div>}
                actions={[
                  <div
                    key="like"
                    className="inline-flex items-center gap-x-2"
                    onClick={async () => {
                      await likeCitizenReport.execute(citizenReport.id);
                      fetchDetailCitizenReport(slug);
                    }}
                  >
                    {citizenReport.has_like ? <HeartFilled className="text-red-500" /> : <HeartOutlined />}
                    {String(citizenReport.liked)}
                  </div>,
                  <div key="comment" className="inline-flex items-center gap-x-2" onClick={() => setShowReplies(!showReplies)}>
                    <CommentOutlined />
                    {String(citizenReport.reply.length)}
                  </div>,
                  <Dropdown key="share" menu={{ items: shareItems, onClick: handleShareItemClick }}>
                    <div key="comment" className="inline-flex items-center gap-x-2">
                      <ShareAltOutlined />
                    </div>
                  </Dropdown>
                ]}
                className="ms-2 border bg-gray-100"
              >
                <div className="flex w-full flex-col gap-y-2">
                  <b className="text-sm">{citizenReport?.report_title}</b>
                  <p className="mt-2 w-full">{citizenReport?.desc}</p>
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
                </div>
              </Card>
            </Timeline.Item>
            {showReplies &&
              citizenReport?.reply.map((reply) => (
                <Timeline.Item key={reply.id} dot={<Avatar src={reply?.resident?.foto} />}>
                  <Card
                    actions={[
                      <div
                        key="like"
                        className="inline-flex items-center gap-x-2"
                        onClick={async () => {
                          await likeCitizenReportReply.execute(reply.id);
                          fetchDetailCitizenReport(slug);
                        }}
                      >
                        {reply.has_like ? <HeartFilled className="text-red-500" /> : <HeartOutlined />}
                        {String(reply.liked)}
                      </div>
                    ]}
                    className="ms-2 border"
                  >
                    <div className="flex flex-col gap-y-2">
                      <b className="text-sm">{`(${reply?.resident?.full_name} - ${timeAgo(reply?.created_at)} )`} ,</b>
                      <p className="mt-2">{reply?.content}</p>
                      {reply?.doc && (
                        <>
                          <hr className="my-2" />
                          <p>Lampiran :</p>

                          {!reply?.doc.split('.').pop().toLowerCase().includes('pdf') && <img className="max-w-96" src={reply.doc} alt="Lampiran" />}

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
        </div>
      )}
    </section>
  );
};

export default DetailCitizenReport;
