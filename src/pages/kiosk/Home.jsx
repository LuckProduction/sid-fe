import { useKioskAuth } from '@/context/KiosAuth';
import { useService } from '@/hooks';
import { KioskService } from '@/services';
import { CloseCircleOutlined } from '@ant-design/icons';
import { Button, Card, Descriptions, Form, Input, List, Modal, Result, Typography } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [modal, setModal] = useState({ isVisible: false, status: false });
  const { login, user } = useKioskAuth();
  const navigate = useNavigate();
  const searchResident = useService(KioskService.searchResident);

  const handleSubmit = async (values) => {
    const { isSuccess, data } = await searchResident.execute(values);
    if (isSuccess) {
      setModal({ isVisible: true, status: true });
      login(data);
    } else {
      setModal({ isVisible: true, status: false });
    }
    return isSuccess;
  };

  return (
    <>
      <section className="relative flex h-full w-full">
        <div className="flex h-full w-full flex-[2] items-center justify-center pb-60">
          <div className="flex flex-col px-24">
            <Typography.Title level={2}>Selamat Datang</Typography.Title>
            <Typography.Paragraph>Sistem Informasi berbasis website untuk memenuhi kebutuhan pengelolaan manajemen desa</Typography.Paragraph>
          </div>
        </div>
        <div className="flex h-full w-full flex-[4] items-center justify-center bg-blue-500">
          <div className="flex w-full max-w-xl flex-col items-center gap-y-6">
            <Typography.Title level={3} style={{ color: '#fff' }}>
              Akses Fitur dan Layanan Desa
            </Typography.Title>
            <Card className="w-full">
              {/* FIXME: REMOVE AUTOCOMPLETEk */}
              <Form onFinish={handleSubmit}>
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
                  <Input placeholder="Masukan NIK" size="large" className="p-5 text-xl" />
                </Form.Item>
                <Form.Item className="m-0 w-full">
                  <Button loading={searchResident.isLoading} size="large" variant="solid" color="primary" className="mt-4 w-full p-6" htmlType="submit">
                    Lanjutkan
                  </Button>
                </Form.Item>
              </Form>
            </Card>
            <Button className="w-full p-6" size="large" variant="solid" onClick={() => navigate(window.location.pathname + '/features')}>
              Layanan Tanpa NIK
            </Button>
          </div>
        </div>
        <div className="absolute bottom-0 w-[22rem]">
          <img src="/illustration/man_waving_helo.png" />
        </div>
      </section>
      <Modal footer={null} width={600} open={modal.isVisible} onCancel={() => setModal(false)}>
        {modal.status === false && (
          <>
            <Result
              status="error"
              title="Data anda tidak valid"
              subTitle="Kami tidak dapat menemukan data kependudukan dengan nik yang anda masukan dalam sistem kami"
              extra={[
                <Button type="primary" key="console" onClick={() => setModal({ ...modal, isVisible: false })}>
                  Lanjutkan
                </Button>
              ]}
            >
              <Typography.Paragraph>
                <CloseCircleOutlined className="text-red-500" /> Server mengalami masalah saat mengambil data kependudukan
              </Typography.Paragraph>
              <Typography.Paragraph>
                <CloseCircleOutlined className="text-red-500" /> Terdapat kesalahan dalam penginputan NIK
              </Typography.Paragraph>
              <Typography.Paragraph>
                <CloseCircleOutlined className="text-red-500" /> Data kependudukan anda belum terdaftar dalam sistem
              </Typography.Paragraph>
            </Result>
          </>
        )}
        {modal.status === true && (
          <Result
            status="success"
            title="NIK Anda Valid"
            subTitle="Anda terdaftar dalam sistem informasi desa, silahkan lanjutkan untuk menggunakan pelayanan mandiri"
            extra={[
              <Button type="primary" key="console" onClick={() => navigate(window.location.pathname + '/features')}>
                Lanjutkan
              </Button>
            ]}
          >
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Nama Lengkap">{user?.full_name}</Descriptions.Item>
              <Descriptions.Item label="Tempat Tanggal Lahir">
                {user?.birth.birth_place} , {user?.birth.birth_date}
              </Descriptions.Item>
              <Descriptions.Item label="Status Pajak">
                <List
                  itemLayout="horizontal"
                  dataSource={user?.tax}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta title={item.tax_name} description={item.status} />
                    </List.Item>
                  )}
                />
              </Descriptions.Item>
            </Descriptions>
          </Result>
        )}
      </Modal>
    </>
  );
};

export default Home;
