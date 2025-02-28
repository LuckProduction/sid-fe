import { Reveal } from '@/components';
import { useService } from '@/hooks';
import { LandingService } from '@/services';
import { DownloadOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, Modal, Result, Typography } from 'antd';
import { useState } from 'react';

const Browse = () => {
  const [modal, setModal] = useState({ type: '', isVisible: false });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [statusResponse, setStatusResponse] = useState(null);
  const statusCheck = useService(LandingService.statusCheck);

  const handleStatusCheck = async (values) => {
    setSubmitLoading(true);
    try {
      const { data, isSuccess } = await statusCheck.execute({ ...values });
      setStatusResponse(isSuccess && data ? { ...data } : {});
      if (isSuccess) {
        setModal({ isVisible: true, type: data.status });
      }
    } catch (err) {
      console.error('Terjadi kesalahan:', err);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <section className="relative h-screen w-full bg-white">
      <div className="relative z-10 mx-auto flex h-full max-w-screen-sm flex-col items-center justify-center px-6 text-center">
        <Reveal>
          <Typography.Title>
            Pantau Status <span className="text-blue-500">Surat</span> Kamu
          </Typography.Title>
        </Reveal>
        <Reveal>
          <div className="flex items-center justify-center">
            <small className="text-center">Cek status surat Anda dengan mudah! Masukkan token yang diberikan saat pengajuan untuk mengetahui perkembangan permohonan Anda secara real-time.</small>
          </div>
        </Reveal>
        <Card className="mt-12 w-full">
          <Form onFinish={handleStatusCheck} className="flex w-full flex-col gap-x-2 gap-y-4 lg:flex-row">
            <Form.Item
              className="m-0 w-full"
              name="token"
              rules={[
                {
                  required: true,
                  message: 'Token wajib di isi!'
                }
              ]}
            >
              <Input className="w-full" size="large" placeholder="Masukan Token Surat" />
            </Form.Item>
            <Form.Item className="m-0">
              <Button className="w-full" loading={submitLoading} icon={<SearchOutlined />} size="large" color="primary" variant="solid" htmlType="submit">
                Cari Surat
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
      <img src="/illustration/city_sillhoute.png" className="absolute bottom-0 left-0 z-0 w-full" />
      <Modal footer={null} width={700} open={modal.isVisible} onCancel={() => setModal(false)}>
        {modal.type === 'selesai' && (
          <Result
            status="success"
            title="Surat telah selesai dibuat"
            subTitle="Silahkan unduh berkas surat dengan menekan tombol download dibawah"
            extra={
              <Button icon={<DownloadOutlined />} variant="solid" color="blue" onClick={() => window.open(statusResponse.link_download, '_blank')}>
                download
              </Button>
            }
          />
        )}
        {modal.type === 'verifikasi' && <Result status="info" title="Surat masih dalam tahap verifikasi" subTitle="Silahkan menunggu hingga status surat berubah menjadi selesai" />}
        {modal.type === 'menunggu' && <Result status="warning" title="Surat masih dalam tahap menunggu" subTitle="Silahkan menunggu hingga status surat berubah menjadi verifikasi" />}
      </Modal>
    </section>
  );
};

export default Browse;
