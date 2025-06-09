import { Reveal } from '@/components';
import { useNotification, useService } from '@/hooks';
import { LandingService } from '@/services';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Card, Descriptions, Form, Input, Modal, Result, Typography } from 'antd';
import { useState } from 'react';

const BrowseBeneficiary = () => {
  const checkBeneficiary = useService(LandingService.beneficiaryCheck);
  const [modal, setModal] = useState({ isVisible: false, type: '' });
  const [response, setResponse] = useState(null);
  const { error } = useNotification();

  const handleBeneficiaryCheck = async (values) => {
    try {
      const { data, isSuccess } = await checkBeneficiary.execute({ ...values });
      setResponse(isSuccess && data ? { ...data } : {});
      if (isSuccess) {
        setModal({ isVisible: true, type: 'berhasil' });
        setResponse(data);
      } else {
        setModal({ isVisible: true, type: 'gagal' });
      }
    } catch (err) {
      error('Gagal', err);
    }
  };
  return (
    <section className="relative h-screen w-full bg-white">
      <div className="relative z-10 mx-auto flex h-full max-w-screen-sm flex-col items-center justify-center px-6 text-center">
        <Reveal>
          <Typography.Title>
            Cari Peserta <span className="text-blue-500">Bantuan</span>
          </Typography.Title>
        </Reveal>
        <Reveal>
          <div className="flex items-center justify-center">
            <small className="text-center">Cek status surat Anda dengan mudah! Masukkan NIK yang diberikan saat pengajuan untuk mengetahui perkembangan permohonan Anda secara real-time.</small>
          </div>
        </Reveal>
        <Card className="mt-12 w-full">
          <Form onFinish={handleBeneficiaryCheck} className="flex w-full flex-col gap-x-2 gap-y-4 lg:flex-row">
            <Form.Item
              className="m-0 w-full"
              name="nik"
              rules={[
                {
                  required: true,
                  message: 'NIK wajib di isi!'
                },
                {
                  pattern: /^[0-9]+$/,
                  message: 'NIK harus berupa angka !'
                }
              ]}
            >
              <Input className="w-full" size="large" placeholder="Masukan NIK Penduduk" />
            </Form.Item>
            <Form.Item className="m-0">
              <Button loading={checkBeneficiary.isLoading} className="w-full" icon={<SearchOutlined />} size="large" variant="solid" htmlType="submit">
                Cari
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
      <img src="/illustration/city_sillhoute.png" className="absolute bottom-0 left-0 z-0 w-full" />
      <Modal footer={null} width={500} open={modal.isVisible} onCancel={() => setModal(false)}>
        {modal.type === 'berhasil' && (
          <>
            <Descriptions column={1} bordered title="Detail peserta">
              <Descriptions.Item label="Nama penerima bantuan">{response.peserta.nama_lengkap}</Descriptions.Item>
              <Descriptions.Item label="NIK">{response.peserta.nik}</Descriptions.Item>
              <Descriptions.Item label="Hubungan Keluarga">{response.peserta.hubungan_keluarga}</Descriptions.Item>
              <Descriptions.Item label="Nomor KK">{response.peserta.nomor_kk}</Descriptions.Item>
              <Descriptions.Item label="Jenis Kelamin">{response.peserta.jenis_kelamin}</Descriptions.Item>
              <Descriptions.Item label="Agama">{response.peserta.agama}</Descriptions.Item>
            </Descriptions>
            <div className="mt-6 flex flex-col gap-y-2">
              {response.bantuan.map((item, index) => (
                <Descriptions bordered column={1} title={item.nama_bantuan} key={index}>
                  <Descriptions.Item label="Sasaran Program">{item.sasaran_program}</Descriptions.Item>
                  <Descriptions.Item label="Keterangan">{item.keterangan}</Descriptions.Item>
                  <Descriptions.Item label="Asal Dana">{item.asal_dana}</Descriptions.Item>
                </Descriptions>
              ))}
            </div>
          </>
        )}
        {modal.type === 'gagal' && <Result status="error" title="Data Tidak Ditemukan" subTitle="Penduduk tidak terdaftar dalam program bantuan manapun" />}
      </Modal>
    </section>
  );
};

export default BrowseBeneficiary;
