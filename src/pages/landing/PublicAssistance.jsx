import { DataTable, Reveal } from '@/components';
import { useNotification, useService } from '@/hooks';
import { LandingService, StatisticService } from '@/services';
import { Column } from '@ant-design/charts';
import { LeftOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Card, Descriptions, Form, Input, Modal, Result, Tabs, Tag, Typography } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PublicAssistance = () => {
  const [modal, setModal] = useState({ isVisible: false, type: '' });
  const { execute: executePublicAssistanceStatistic, ...getAllPublicAssistanceStatistic } = useService(StatisticService.getAllPublicAssistanceStatistic);
  const [response, setResponse] = useState(null);
  const { error } = useNotification();
  const navigate = useNavigate();

  const checkBeneficiary = useService(LandingService.beneficiaryCheck);

  useEffect(() => {
    executePublicAssistanceStatistic();
  }, [executePublicAssistanceStatistic]);

  const publicAssistanceStatistic = useMemo(() => {
    return getAllPublicAssistanceStatistic.data ?? [];
  }, [getAllPublicAssistanceStatistic.data]);

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

  const publicAssistanceStatisticColumn = [
    {
      title: 'Nama Bantuan',
      dataIndex: 'nama_bantuan'
    },
    {
      title: 'Sasaran Program',
      dataIndex: 'sasaran_program'
    },
    {
      title: 'Asal Dana',
      dataIndex: 'asal_dana'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (_, record) => {
        switch (record.status) {
          case 'aktif':
            return <Tag color="blue">Aktif</Tag>;
          case 'nonaktif':
            return <Tag color="warning">Non-Aktif</Tag>;
          default:
            return <Tag color="error">{record.status}</Tag>;
        }
      }
    },
    {
      title: 'Total Peserta',
      dataIndex: 'peserta_bantuan_count'
    }
  ];
  const chartConfigs = useMemo(() => {
    return {
      data: publicAssistanceStatistic,
      xField: 'nama_bantuan',
      yField: 'peserta_bantuan_count',
      autoFit: true,
      padding: 'auto',
      label: {
        position: 'middle',
        style: {
          fill: '#FFFFFF',
          opacity: 0.6
        }
      },
      xAxis: {
        label: {
          autoHide: true,
          autoRotate: false
        }
      },
      yAxis: {
        minInterval: 1
      },
      meta: {
        nama_bantuan: { alias: 'Nama Bantuan' },
        peserta_bantuan_count: { alias: 'Jumlah Peserta' }
      }
    };
  }, [publicAssistanceStatistic]);

  return (
    <>
      <section className="relative w-full bg-blue-500 text-white">
        <div className="relative z-10 mx-auto max-w-screen-xl px-6 py-24">
          <button className="mb-12 inline-flex items-center gap-x-2 text-sm" onClick={() => navigate(-1)}>
            <LeftOutlined />
            kembali
          </button>
          <Reveal>
            <Typography.Title style={{ color: '#fff' }}>Bantuan</Typography.Title>
          </Reveal>
          <Reveal>
            <div className="max-w-lg">
              <small>Temukan penerima bantuan dengan cepat! Masukkan data yang diperlukan untuk melihat daftar penerima bantuan secara real-time.</small>
            </div>
          </Reveal>
        </div>
        <img src="/illustration/city_sillhoute_transparent.png" className="absolute bottom-0 left-0 z-0 w-full" />
      </section>
      <section className="min-h-screen w-full bg-white">
        <div className="mx-auto flex max-w-screen-lg flex-col gap-y-6 px-6 py-12">
          <Card className="bg-blue-500 p-4">
            <Reveal>
              <Typography.Title level={4} style={{ color: 'white' }} className="mb-6">
                Cari Penerima Bantuan
              </Typography.Title>
            </Reveal>
            <Form onFinish={handleBeneficiaryCheck} className="mt-3 flex w-full flex-col items-start gap-x-2 gap-y-4 lg:flex-row">
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
          <Card className="">
            <Typography.Title level={5}>Data Perkembangan penyaluran bantuan</Typography.Title>
            <p className="mb-6">Dataset ini berisi data statistik bantuan desa dimana data statistik bantuan desa ini diambil pada saat melakukan penginputan data bantuan dalam aplikasi sistem informasi desa</p>
            <Tabs type="card" defaultActiveKey="raw">
              <Tabs.TabPane tab="Raw Data" key="raw">
                <div className="w-full overflow-x-auto">
                  <DataTable columns={publicAssistanceStatisticColumn} loading={getAllPublicAssistanceStatistic.isLoading} data={publicAssistanceStatistic} rowKey="id" />
                </div>
              </Tabs.TabPane>
              <Tabs.TabPane tab="Visualisasi" key="visualisasi">
                <Column {...chartConfigs} />
              </Tabs.TabPane>
            </Tabs>
          </Card>
        </div>
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
    </>
  );
};

export default PublicAssistance;
