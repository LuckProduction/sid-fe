import { DataTable, Reveal } from '@/components';
import { useService } from '@/hooks';
import { StatisticService } from '@/services';
import { Column } from '@ant-design/charts';
import { LeftOutlined } from '@ant-design/icons';
import { Card, Tabs, Tag, Typography } from 'antd';
import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const PublicAssistance = () => {
  const { execute: executePublicAssistanceStatistic, ...getAllPublicAssistanceStatistic } = useService(StatisticService.getAllPublicAssistanceStatistic);
  const navigate = useNavigate();

  useEffect(() => {
    executePublicAssistanceStatistic();
  }, [executePublicAssistanceStatistic]);

  const publicAssistanceStatistic = useMemo(() => {
    return getAllPublicAssistanceStatistic.data ?? [];
  }, [getAllPublicAssistanceStatistic.data]);

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
      </section>
    </>
  );
};

export default PublicAssistance;
