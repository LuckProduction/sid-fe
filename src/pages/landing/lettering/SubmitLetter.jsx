import { Crud, Reveal } from '@/components';
import { useNotification, useService } from '@/hooks';
import { LandingService } from '@/services';
import { copyToClipboard } from '@/utils/clipBoard';
import dateFormatter from '@/utils/dateFormatter';
import { mapLetterAttributesToFormFields } from '@/utils/letterAttributToForm';
import { CloseCircleOutlined, CopyOutlined, LeftOutlined } from '@ant-design/icons';
import { Button, Card, DatePicker, Form, Input, Modal, Result, Select, Tooltip, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SubmitLetter = () => {
  const navigate = useNavigate();
  const { error, success } = useNotification();
  const [form] = Form.useForm();

  // State Management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [modalStatus, setModalStatus] = useState('initial'); // 'initial' | 'success' | 'error'
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Fetch Data
  const { execute: fetchLetterType, ...getAllLetterType } = useService(LandingService.getAllLetterType);
  const { execute: fetchLetterTypeDetail, ...getLetterTypeDetail } = useService(LandingService.getLetterTypeDetail);
  const searchResident = useService(LandingService.getResident);
  const storeSubmitLetter = useService(LandingService.sumbitLetter);

  useEffect(() => {
    fetchLetterType();
  }, [fetchLetterType]);

  const LetterType = getAllLetterType.data ?? [];
  const letterTypeDetail = getLetterTypeDetail.data ?? {};

  // Handle Check Letter
  const handleCheckLetter = async (values) => {
    setSubmitLoading(true);
    try {
      const { data, isSuccess } = await searchResident.execute({
        ...values,
        tanggal_lahir: dateFormatter(values.tanggal_lahir)
      });
      setFormData(isSuccess && data ? { ...data, jenis_surat: values.jenis_surat } : {});
      setModalStatus('initial');
      setIsModalOpen(true);
    } catch (err) {
      console.error('Terjadi kesalahan:', err);
    } finally {
      setSubmitLoading(false);
    }
  };

  // Handle Submit Letter
  const handleSubmitLetter = async (values) => {
    setSubmitLoading(true);
    try {
      const formattedData = {
        resident: formData.id,
        letter_type: letterTypeDetail.id,
        letter_attribute: letterTypeDetail.letter_attribut.map((attr) => ({
          letter_attribute_id: attr.id,
          content: values[attr.attribute]
        }))
      };
      const { message, isSuccess, data } = await storeSubmitLetter.execute(formattedData);

      if (isSuccess) {
        success('Berhasil', message);
        setFormData(isSuccess && data ? { ...formData, token: data.token } : { ...formData });
        setModalStatus('success');
        setIsSubmitted(true); // Hilangkan form setelah submit berhasil
      } else {
        error('Gagal', message);
        setModalStatus('error');
      }
    } finally {
      setSubmitLoading(false);
      setIsModalOpen(true);
    }
  };

  // Handle Close Modal and Reset Form
  const handleModalClose = () => {
    setIsModalOpen(false);
    setModalStatus('initial');
    setFormData({});
    form.resetFields();
  };

  const renderModalContent = () => {
    if (modalStatus === 'success') {
      return (
        <Result status="success" title="Permohonan Berhasil!" subTitle="Surat Anda telah berhasil dibuat dan diproses.">
          <div className="flex flex-col items-center justify-center gap-y-4">
            <div className="desc inline-flex w-full items-center justify-center gap-x-6">
              <b className="text-5xl text-gray-500">{formData.token}</b>
              <Tooltip title={'Salin Ke Clipboard'}>
                <button onClick={() => copyToClipboard(formData.token)} className="flex h-12 w-12 items-center justify-center rounded-md border-2 border-gray-300 text-gray-400">
                  <CopyOutlined />
                </button>
              </Tooltip>
            </div>
          </div>
        </Result>
      );
    }

    if (modalStatus === 'error') {
      return (
        <Result
          status="error"
          title="Permohonan Gagal!"
          subTitle="Terjadi kesalahan dalam proses pengajuan surat. Coba lagi."
          extra={
            <Button type="primary" onClick={handleModalClose}>
              Coba Lagi
            </Button>
          }
        />
      );
    }

    return Object.keys(formData).length === 0 ? (
      <>
        <Result status="error" title="Gagal Mengambil Data" subTitle="Kami tidak dapat menemukan data kependudukan Anda. Coba lagi.">
          <div>
            <Typography.Paragraph
              strong
              style={{
                fontSize: 16
              }}
            >
              Terdapat kesalahan dalam pengajuan Anda:
            </Typography.Paragraph>
            <Typography.Paragraph>
              <CloseCircleOutlined className="me-2 text-red-500" />
              Data yang Anda masukkan mungkin salah. Silakan periksa kembali.
            </Typography.Paragraph>
            <Typography.Paragraph>
              <CloseCircleOutlined className="me-2 text-red-500" />
              Anda tidak terdaftar dalam database kependudukan. Hubungi petugas untuk langkah lebih lanjut.
            </Typography.Paragraph>
            <Typography.Paragraph>
              <CloseCircleOutlined className="me-2 text-red-500" />
              Server sedang mengalami masalah. Silakan coba lagi nanti.
            </Typography.Paragraph>
          </div>
        </Result>
        <div className="flex w-full items-center justify-end gap-x-2">
          <Button type="default" onClick={() => setIsModalOpen(false)}>
            Batal
          </Button>
          <Button
            variant="solid"
            color="primary"
            onClick={() => {
              setIsModalOpen(false);
            }}
          >
            Coba Lagi
          </Button>
        </div>
      </>
    ) : (
      <Result
        status="success"
        title="Lanjutkan Membuat Surat"
        subTitle="Anda terdaftar dalam database kependudukan desa. Silakan lanjutkan."
        extra={
          <Button
            type="primary"
            onClick={() => {
              fetchLetterTypeDetail(formData.jenis_surat);
              setIsModalOpen(false);
            }}
          >
            Lanjutkan
          </Button>
        }
      />
    );
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
            <Typography.Title style={{ color: '#fff' }}>Permohonan Surat</Typography.Title>
          </Reveal>
          <Reveal>
            <div className="max-w-lg">
              <small>Ajukan surat sesuai kebutuhan Anda dalam hitungan menit. Isi detail yang diperlukan, dan biarkan sistem kami mengurus sisanya dengan cepat dan efisien!</small>
            </div>
          </Reveal>
        </div>
        <img src="/illustration/city_sillhoute_transparent.png" className="absolute bottom-0 left-0 z-0 w-full" />
      </section>
      <section className="min-h-screen w-full bg-white">
        <div className="mx-auto flex max-w-screen-lg flex-col gap-y-6 px-6 py-12">
          <Card className="w-full">
            <Form form={form} className="flex w-full flex-col items-center gap-2" onFinish={handleCheckLetter}>
              <Form.Item
                className="col-span-4 m-0 w-full"
                name="nik"
                rules={[
                  {
                    required: true,
                    message: 'NIK wajib diisi!'
                  },
                  {
                    pattern: /^[0-9]+$/,
                    message: 'NIK harus berupa angka !'
                  }
                ]}
              >
                <Input className="w-full" size="large" placeholder="Masukan NIK" />
              </Form.Item>
              <Form.Item
                className="col-span-4 m-0 w-full"
                name="tanggal_lahir"
                rules={[
                  {
                    required: true,
                    message: 'Tanggal lahir wajib diisi!'
                  }
                ]}
              >
                <DatePicker className="w-full" size="large" placeholder="Masukan Tanggal Lahir" />
              </Form.Item>
              <Form.Item
                className="col-span-4 m-0 w-full"
                name="jenis_surat"
                rules={[
                  {
                    required: true,
                    message: 'Jenis Surat wajib diisi!'
                  }
                ]}
              >
                <Select className="w-full" size="large" placeholder="Pilih Jenis Surat">
                  {LetterType?.map((item) => (
                    <Select.Option key={item.id} value={item.id}>
                      {item.letter_name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Button className="w-full" loading={submitLoading} variant="solid" color="primary" size="large" htmlType="submit">
                Proses
              </Button>
            </Form>
          </Card>
          {!isSubmitted && Object.keys(letterTypeDetail).length > 0 && (
            <Card>
              <Typography.Title level={5}>{letterTypeDetail.letter_name}</Typography.Title>
              <Crud formFields={mapLetterAttributesToFormFields(letterTypeDetail.letter_attribut)} type="create" onSubmit={handleSubmitLetter} isLoading={submitLoading} />
            </Card>
          )}
        </div>
      </section>

      <Modal width={700} open={isModalOpen} onCancel={handleModalClose} footer={null}>
        {renderModalContent()}
      </Modal>
    </>
  );
};

export default SubmitLetter;
