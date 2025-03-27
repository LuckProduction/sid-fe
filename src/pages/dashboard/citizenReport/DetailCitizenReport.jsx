import { useAuth, useService } from '@/hooks';
import { CitizenReportService } from '@/services';
import timeAgo from '@/utils/timeAgo';
import { DownloadOutlined } from '@ant-design/icons';
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

  return (
    <Card className="p-4">
      {Object.keys(detailCitizenReport).length === 0 ? (
        <Skeleton active />
      ) : (
        <>
          <Timeline>
            <Timeline.Item dot={<Avatar className="bg-color-primary-100 text-color-primary-500 font-semibold" src={detailCitizenReport?.resident?.foto} />}>
              <Card
                className="ms-2 border bg-gray-100"
                title={
                  <div className="">
                    {`(${detailCitizenReport?.resident?.full_name})`}, {detailCitizenReport?.report_title}
                  </div>
                }
                extra={<div className="">{timeAgo(detailCitizenReport?.created_at)}</div>}
              >
                <div className="flex flex-col gap-y-2">
                  {detailCitizenReport?.desc}
                  <hr className="my-2" />
                  <p>Lampiran :</p>
                  {detailCitizenReport?.doc && !detailCitizenReport.doc.split('.').pop().toLowerCase().includes('pdf') && <img className="max-w-96" src={detailCitizenReport?.doc} alt="Lampiran" />}

                  {detailCitizenReport?.doc && detailCitizenReport.doc.split('.').pop().toLowerCase() === 'pdf' && (
                    <Button icon={<DownloadOutlined />} className="w-fit" variant="solid" color="primary" onClick={() => window.open(detailCitizenReport?.doc, '_blank')}>
                      Unduh PDF
                    </Button>
                  )}
                </div>
              </Card>
            </Timeline.Item>
            {showReplies &&
              detailCitizenReport?.reply.map((reply) => (
                <Timeline.Item key={reply.id} dot={<Avatar src={reply?.resident?.foto} />}>
                  <Card className="ms-2 border" title={<div className="">Balasan, {`(${reply?.resident?.full_name})`}, </div>} extra={<div className="">{timeAgo(reply?.created_at)}</div>}>
                    <div className="flex flex-col gap-y-2">
                      {reply?.content}
                      <hr className="my-2" />
                      <p>Lampiran :</p>
                      <img className="max-w-96" src="/image_asset/card_background.png" />
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
          <Button className="mt-2 w-full" variant="filled" color="primary" onClick={() => setShowReplies(!showReplies)}>
            {showReplies ? 'Sembunyikan Balasan' : 'Tampilkan Balasan'}
          </Button>
        </>
      )}
    </Card>
  );
};

export default DetailCitizenReport;
