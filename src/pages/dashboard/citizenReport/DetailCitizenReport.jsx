import { useAuth, useService } from '@/hooks';
import { CitizenReportService } from '@/services';
import asset from '@/utils/asset';
import timeAgo from '@/utils/timeAgo';
import { CommentOutlined, DownloadOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Skeleton, Timeline } from 'antd';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const DetailCitizenReport = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const { execute: fetchDetailCitizenReport, ...getDetailCitizenReport } = useService(CitizenReportService.getById);
  const [showReplies, setShowReplies] = useState(false);

  useEffect(() => {
    fetchDetailCitizenReport(id, token);
  }, [fetchDetailCitizenReport, id, token]);

  const detailCitizenReport = getDetailCitizenReport.data ?? {};

  console.log(detailCitizenReport);

  return (
    <Card className="p-4">
      {Object.keys(detailCitizenReport).length === 0 ? (
        <Skeleton active />
      ) : (
        <>
          <Timeline>
            <Timeline.Item dot={<Avatar className="bg-color-primary-100 text-color-primary-500 font-semibold" src={detailCitizenReport?.resident?.foto} />}>
              <Card
                actions={[
                  <div key="comment" className="inline-flex items-center gap-x-2" onClick={() => setShowReplies(!showReplies)}>
                    <CommentOutlined />
                    {String(detailCitizenReport.reply.length)}
                  </div>
                ]}
                className="ms-2 border bg-gray-100"
              >
                <div className="flex flex-col gap-y-2">
                  <b className="text-sm">{`(${detailCitizenReport?.resident?.full_name} - ${timeAgo(detailCitizenReport?.created_at)} )`} ,</b>
                  <b className="text-sm">{detailCitizenReport?.report_title}</b>
                  <p className="mt-2">{detailCitizenReport?.desc}</p>
                  {detailCitizenReport?.doc && (
                    <>
                      <hr className="my-2" />
                      <div className="flex flex-col gap-2">
                        <p>Lampiran :</p>

                        {!detailCitizenReport.doc.split('.').pop().toLowerCase().includes('pdf') && <img className="max-w-96" src={asset(detailCitizenReport.doc)} alt="Lampiran" />}

                        {detailCitizenReport.doc.split('.').pop().toLowerCase() === 'pdf' && (
                          <Button icon={<DownloadOutlined />} className="w-fit" type="primary" onClick={() => window.open(detailCitizenReport.doc, '_blank')}>
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
              detailCitizenReport?.reply.map((reply) => (
                <Timeline.Item key={reply.id} dot={<Avatar src={reply?.resident?.foto} />}>
                  <Card className="ms-2 border">
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
        </>
      )}
    </Card>
  );
};

export default DetailCitizenReport;
