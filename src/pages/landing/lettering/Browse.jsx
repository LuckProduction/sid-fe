import { Reveal } from '@/components';
import { useService } from '@/hooks';
import { LandingService } from '@/services';
import { CaretRightOutlined, DownloadOutlined, MailOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Card, Collapse, Descriptions, Empty, Form, Input, Modal, Result, Steps, theme, Typography } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Browse = () => {
  const [modal, setModal] = useState({ isVisible: false, error: false });
  const [response, setResponse] = useState(null);
  const browseLetter = useService(LandingService.browseLetter);
  const navigate = useNavigate();

  const handleStatusCheck = async (values) => {
    try {
      const { data, isSuccess } = await browseLetter.execute({ ...values });
      setResponse(isSuccess && data ? { ...data } : {});
      if (isSuccess) {
        setModal({ isVisible: true });
      } else {
        setModal({ isVisible: true, error: true });
      }
    } catch (err) {
      console.error('Terjadi kesalahan:', err);
    }
  };

  const { token } = theme.useToken();
  const panelStyle = {
    marginBottom: 12,
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: 'none'
  };

  const renderLetterItem = ({ panelStyle, data }) => {
    if (!data || data.length === 0) return [];

    return data.map((item, index) => ({
      key: String(index + 1),
      label: item.jenis_surat.nama_surat,
      children: (
        <div className="flex w-full flex-col gap-y-2">
          <div className="flex w-full items-center">
            <div className="flex w-full flex-col">
              <b>{item.token}</b>
              <small>{item.jenis_surat.nama_surat}</small>
            </div>
            <Button
              disabled={item.status !== 'selesai'}
              icon={<DownloadOutlined />}
              size="small"
              className="text-xs"
              color="primary"
              variant="solid"
              onClick={() => window.open(`https://desa1.api-example.govillage.id/api/permohonan-surat/download/${item.token}`, '_blank')}
            >
              Unduh
            </Button>
          </div>
          <hr className="mt-4" />
          <div className="w-full">
            <Steps
              className="mt-4"
              direction="vertical"
              size="small"
              current={item.status === 'menunggu' ? 1 : item.status === 'verifikasi' ? 2 : 3}
              items={[
                {
                  title: 'Menunggu',
                  description: 'Permohonan surat masih dalam proses menunggu'
                },
                {
                  title: 'Verifikasi',
                  description: 'Permohonan surat masih dalam prose verifikasi oleh admin'
                },
                {
                  title: 'Selesai',
                  description: 'Permohonan surat berhasil disetujui'
                }
              ]}
            />
          </div>
        </div>
      ),
      style: panelStyle
    }));
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
              name="nik"
              rules={[
                {
                  required: true,
                  message: 'NIK wajib di isi!'
                }
              ]}
            >
              <Input className="w-full" size="large" placeholder="Masukan NIK Pemohon" />
            </Form.Item>
            <Form.Item className="m-0">
              <Button className="w-full" loading={browseLetter.isLoading} icon={<SearchOutlined />} size="large" color="primary" variant="solid" htmlType="submit">
                Cari Surat
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
      <img src="/illustration/city_sillhoute.png" className="absolute bottom-0 left-0 z-0 w-full" />
      <Modal footer={null} width={500} open={modal.isVisible} onCancel={() => setModal(false)}>
        {response && !modal.error && (
          <Descriptions title="Detail Data Pemohon" bordered column={1}>
            <Descriptions.Item label="Nama Lengkap">{response?.master_penduduk_id?.nama_lengkap}</Descriptions.Item>
            <Descriptions.Item label="NIK">{response?.master_penduduk_id?.nik}</Descriptions.Item>
            <Descriptions.Item label="Hubungan Keluarga">{response?.master_penduduk_id?.hubungan_keluarga}</Descriptions.Item>
            <Descriptions.Item label="Nomor KK">{response?.master_penduduk_id?.nomor_kk}</Descriptions.Item>
            <Descriptions.Item label="Jenis Kelamin">{response?.master_penduduk_id?.jenis_kelamin}</Descriptions.Item>
          </Descriptions>
        )}
        {response?.permohonan_surat?.length === 0 ? (
          <Empty description="Tidak ada permohonan surat" />
        ) : (
          <>
            <Collapse
              className="mt-4"
              bordered={false}
              defaultActiveKey={['1']}
              expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
              style={{
                background: token.colorBgContainer
              }}
              items={renderLetterItem({ panelStyle: panelStyle, data: response?.permohonan_surat })}
            />
          </>
        )}
        {modal.error && (
          <Result
            status="error"
            title="Gagal Mengambil Data"
            subTitle="Ada kesalahan saat melakukan pencarian permohonan surat, NIK penduduk mungkin belum pernah digunakan untuk melakukan permohonan surat"
            extra={
              <Button size="large" icon={<MailOutlined />} variant="solid" color="blue" onClick={() => navigate('/lettering/submitletter')}>
                Buat Permohonan Surat
              </Button>
            }
          />
        )}
      </Modal>
    </section>
  );
};

export default Browse;
