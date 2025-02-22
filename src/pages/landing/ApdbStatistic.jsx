import { DataLoader, DataTable, Reveal } from '@/components';
import { useService } from '@/hooks';
import { LandingService } from '@/services';
import { rupiahFormat } from '@/utils/rupiahFormat';
import { Column } from '@ant-design/charts';
import { DollarOutlined, ExportOutlined, GroupOutlined, LeftOutlined, ShopOutlined, ShoppingCartOutlined, WalletOutlined } from '@ant-design/icons';
import { Card, Statistic, Tabs, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ApdbStatistic = () => {
  const navigate = useNavigate();

  const { execute: executeApbdStatisticFetch, ...getAllApbdStatistic } = useService(LandingService.getAllApbdtStatistic);

  useEffect(() => {
    executeApbdStatisticFetch();
  }, [executeApbdStatisticFetch]);

  const apbdStatistic = getAllApbdStatistic.data ?? [];

  const tabKeys = Object.keys(apbdStatistic).filter((key) => key !== 'perTahun' && key !== 'semua');
  const [activeKey, setActiveKey] = useState(tabKeys[0] || '');

  // DataTable untuk data semua
  const semuaColumns = [
    { title: 'Nama Laporan', dataIndex: 'nama_laporan' },
    { title: 'Tahun', dataIndex: 'tahun' },
    {
      title: 'Belanja',
      dataIndex: 'belanja_pendapatan',
      render: (bp) => rupiahFormat(bp?.belanja || 0)
    },
    {
      title: 'Pendapatan',
      dataIndex: 'belanja_pendapatan',
      render: (bp) => rupiahFormat(bp?.pendapatan || 0)
    },
    {
      title: 'Pengeluaran',
      dataIndex: 'pembiayaan',
      render: (pb) => rupiahFormat(pb?.pengeluaran || 0)
    },
    {
      title: 'Pembiayaan',
      dataIndex: 'pembiayaan',
      render: (pb) => rupiahFormat(pb?.pembiayaan || 0)
    }
  ];

  // Persiapan data untuk Chart
  const semuaChartData = apbdStatistic?.semua?.map((item) => ({
    tahun: item.tahun,
    nama_laporan: item.nama_laporan,
    belanja: item.belanja_pendapatan.belanja
  }));

  const semuaChartConfig = {
    data: semuaChartData,
    xField: 'tahun',
    yField: 'belanja',
    seriesField: 'nama_laporan',
    autoFit: true,
    padding: 'auto'
  };

  // Chart Config untuk setiap data selain semua dan perTahun
  const getChartConfig = (data) => ({
    data,
    xField: 'nama_komponen',
    yField: 'jumlah_anggaran',
    seriesField: 'sumber_anggaran',
    autoFit: true,
    padding: 'auto'
  });

  return (
    <>
      {getAllApbdStatistic.isLoading ? (
        <DataLoader type="datatable" />
      ) : (
        <>
          <section className="relative w-full bg-blue-500 text-white">
            <div className="relative z-10 mx-auto max-w-screen-xl px-6 py-24">
              <button className="mb-12 inline-flex items-center gap-x-2 text-sm" onClick={() => navigate(-1)}>
                <LeftOutlined />
                kembali
              </button>
              <Reveal>
                <Typography.Title style={{ color: '#fff' }}>Statistik APBD</Typography.Title>
              </Reveal>
              <Reveal>
                <div className="max-w-lg">
                  <small>Pantau perkembangan desa melalui data statistik desa secara real time</small>
                </div>
              </Reveal>
            </div>
            <img src="/illustration/city_sillhoute_transparent.png" className="absolute bottom-0 left-0 z-0 w-full" />
          </section>
          <section className="min-h-screen w-full bg-white">
            <div className="mx-auto flex max-w-screen-lg flex-col gap-y-6 px-6 py-12">
              <Card>
                <Typography.Title level={5}>Data APBD Desa</Typography.Title>
                <p className="mb-6">Dataset ini berisi data statistik APBD desa dimana data statistik APBD desa ini diambil pada saat melakukan penginputan data APBD dalam aplikasi sistem informasi desa</p>
                <div className="mb-6 grid w-full grid-cols-12 gap-4">
                  <Card className="col-span-4">
                    <Statistic title="Jumlah Belanja" value={rupiahFormat(apbdStatistic?.perTahun?.belanja)} prefix={<ShoppingCartOutlined />} />
                  </Card>
                  <Card className="col-span-4">
                    <Statistic title="Jumlah Pendapatan" value={rupiahFormat(apbdStatistic?.perTahun?.pendapatan)} prefix={<DollarOutlined />} />
                  </Card>
                  <Card className="col-span-4">
                    <Statistic title="Defisit" value={rupiahFormat(apbdStatistic?.perTahun?.defisit)} prefix={<GroupOutlined />} />
                  </Card>
                  <Card className="col-span-4">
                    <Statistic title="Pengeluaran" value={rupiahFormat(apbdStatistic?.perTahun?.pengeluaran)} prefix={<ShopOutlined />} />
                  </Card>
                  <Card className="col-span-4">
                    <Statistic title="Pembiayaan" value={rupiahFormat(apbdStatistic?.perTahun?.pembiayaan)} prefix={<ExportOutlined />} />
                  </Card>
                  <Card className="col-span-4">
                    <Statistic title="Sisa Pembiayaan" value={rupiahFormat(apbdStatistic?.perTahun?.sisa_pembiayaan)} prefix={<WalletOutlined />} />
                  </Card>
                </div>
                <div className="w-full p-4">
                  <Tabs>
                    <Tabs.TabPane tab="Raw Data" key="rawdata">
                      <DataTable loading={getAllApbdStatistic.isLoading} columns={semuaColumns} data={apbdStatistic.semua ?? []} rowKey="id" />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Visualisasi" key="visualisasi">
                      <Column {...semuaChartConfig} />
                    </Tabs.TabPane>
                  </Tabs>
                </div>
              </Card>
              <Card>
                <Tabs type="card" activeKey={activeKey} onChange={setActiveKey}>
                  {tabKeys.map((key, index) => (
                    <Tabs.TabPane tab={key.charAt(0).toUpperCase() + key.slice(1)} key={key}>
                      <Tabs>
                        <Tabs.TabPane tab="Raw Data" key={key + index + 'raw'}>
                          <DataTable
                            columns={[
                              { title: 'Nama Komponen', dataIndex: 'nama_komponen' },
                              { title: 'Jumlah', dataIndex: 'jumlah_anggaran' }
                            ]}
                            loading={getAllApbdStatistic.isLoading}
                            data={apbdStatistic[key] ?? []}
                            rowKey="id"
                          />
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="Visualisasi" key={key + index + 'visualisasi'}>
                          <Column {...getChartConfig(apbdStatistic[key])} />
                        </Tabs.TabPane>
                      </Tabs>
                    </Tabs.TabPane>
                  ))}
                </Tabs>
              </Card>
            </div>
          </section>
        </>
      )}
    </>
  );
};

export default ApdbStatistic;
