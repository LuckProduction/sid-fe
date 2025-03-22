import { DataLoader, DataTable, Reveal } from '@/components';
import { useService } from '@/hooks';
import { StatisticService } from '@/services';
import { Column } from '@ant-design/charts';
import { LeftOutlined, ManOutlined, TeamOutlined, UserOutlined, WomanOutlined } from '@ant-design/icons';
import { Card, Statistic, Tabs, Typography } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ResidentStatistic = () => {
  const navigate = useNavigate();

  const { execute: executeResidentStatisticFetch, ...getAllResidentStatistic } = useService(StatisticService.getAllResidentStatistic);

  useEffect(() => {
    executeResidentStatisticFetch();
  }, [executeResidentStatisticFetch]);

  const residentStatistic = useMemo(() => getAllResidentStatistic.data ?? {}, [getAllResidentStatistic.data]);

  const tabKeys = Object.keys(residentStatistic).filter((key) => key !== 'penduduk');
  const [chartConfigs, setChartConfigs] = useState(null);
  const [activeKey, setActiveKey] = useState(tabKeys[0] || '');

  useEffect(() => {
    if (activeKey && residentStatistic[activeKey]) {
      setChartConfigs(getChartConfigs(residentStatistic[activeKey]));
    }
  }, [activeKey, residentStatistic]);

  const getColumns = (data) => {
    if (!data || data.length === 0) return [];

    const keys = Object.keys(data[0]).filter((key) => key !== 'jumlah');

    return keys
      .map((key) => ({
        title: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize
        dataIndex: key
      }))
      .concat({
        title: 'Jumlah',
        dataIndex: 'jumlah',
        sorter: (a, b) => a.jumlah - b.jumlah
      });
  };

  const getChartConfigs = (data) => {
    if (!data || data.length === 0) return null;

    const xField = Object.keys(data[0]).find((key) => key !== 'jumlah');

    return {
      data,
      xField,
      yField: 'jumlah',
      autoFit: true,
      padding: 'auto',
      barWidthRatio: 0.6,
      label: {
        position: 'middle',
        style: { fill: '#fff', fontSize: 12 }
      }
    };
  };

  return (
    <>
      {getAllResidentStatistic.isLoading ? (
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
                <Typography.Title style={{ color: '#fff' }}>Statistik Kependudukan</Typography.Title>
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
                <Typography.Title level={5}>Data Kependudukan Desa</Typography.Title>
                <p className="mb-6">Dataset ini berisi data statistik kependudukan desa dimana data statistik kependudukan desa ini diambiil pada saat melakukan penginputan data kependudukan dalam aplikasi sistem informasi desa</p>
                <div className="grid w-full grid-cols-12 gap-4">
                  <Card className="col-span-12 md:col-span-6 lg:col-span-3">
                    <Statistic title="Jumlah Penduduk" value={residentStatistic?.penduduk?.jumlah_penduduk} prefix={<TeamOutlined />} />
                  </Card>
                  <Card className="col-span-12 md:col-span-6 lg:col-span-3">
                    <Statistic title="Jumlah Kepala Keluarga" value={residentStatistic?.penduduk?.jumlah_kepala_keluarga} prefix={<UserOutlined />} />
                  </Card>
                  <Card className="col-span-12 md:col-span-6 lg:col-span-3">
                    <Statistic title="Perempuan" value={residentStatistic?.penduduk?.jumlah_perempuan} prefix={<WomanOutlined />} />
                  </Card>
                  <Card className="col-span-12 md:col-span-6 lg:col-span-3">
                    <Statistic title="Laki - Laki" value={residentStatistic?.penduduk?.jumlah_laki_laki} prefix={<ManOutlined />} />
                  </Card>
                </div>
              </Card>
              <Card>
                <Tabs type="card" activeKey={activeKey} onChange={setActiveKey}>
                  {tabKeys.map((key) => (
                    <Tabs.TabPane tab={key.charAt(0).toUpperCase() + key.slice(1)} key={key}>
                      <Tabs>
                        <Tabs.TabPane tab="Raw Data" key="rawdata">
                          <div className="w-full overflow-x-auto">
                            <DataTable columns={getColumns(residentStatistic[key])} data={residentStatistic[key] ?? []} loading={getAllResidentStatistic.isLoading} />
                          </div>
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="Visualisasi" key="visualisasi">
                          {chartConfigs && <Column {...chartConfigs} className="mt-6 h-auto w-full" />}
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

export default ResidentStatistic;
