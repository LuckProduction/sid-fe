/* eslint-disable react-hooks/exhaustive-deps */
import { Column, Pie } from '@ant-design/charts';
import { GiftOutlined, HomeOutlined, MailOutlined, PaperClipOutlined } from '@ant-design/icons';
import { Card, Skeleton, Typography } from 'antd';
import { useEffect, useMemo } from 'react';
import { useAuth, useService } from '@/hooks';
import { StatisticService } from '@/services';

const Dashboard = () => {
  const { token } = useAuth();
  const { execute: executeApbdStatisticFetch, ...getAllApbdStatistic } = useService(StatisticService.getAllApbdtStatistic);
  const { execute: executeResidentStatisticFetch, ...getAllResidentStatistic } = useService(StatisticService.getAllResidentStatistic);
  const { execute: executePublicAssistanceStatistic, ...getAllPublicAssistanceStatistic } = useService(StatisticService.getAllPublicAssistanceStatistic);
  const { execute: executeOverview, ...getAllOverview } = useService(StatisticService.getAllOverview);

  useEffect(() => {
    if (token) {
      if (!getAllApbdStatistic.data) executeApbdStatisticFetch();
      if (!getAllResidentStatistic.data) executeResidentStatisticFetch();
      if (!getAllOverview.data) executeOverview(token);
    }
    executePublicAssistanceStatistic();
  }, [token, executeApbdStatisticFetch, executeResidentStatisticFetch, executeOverview, executePublicAssistanceStatistic]);

  const apbdStatistic = getAllApbdStatistic.data ?? {};
  const residentStatistic = getAllResidentStatistic.data ?? {};
  const overview = getAllOverview.data ?? {};

  const publicAssistanceStatistic = useMemo(() => {
    return getAllPublicAssistanceStatistic.data ?? [];
  }, [getAllPublicAssistanceStatistic.data]);

  const chartConfigs = useMemo(() => {
    if (!apbdStatistic.semua || !residentStatistic.penduduk) return { resident: null, apbd: null };

    const apbdData = apbdStatistic.semua.flatMap((item) => [
      { tahun: item.tahun, kategori: 'Belanja', nilai: item.belanja_pendapatan.belanja },
      { tahun: item.tahun, kategori: 'Pendapatan', nilai: item.belanja_pendapatan.pendapatan },
      { tahun: item.tahun, kategori: 'Pembiayaan', nilai: item.pembiayaan.pembiayaan },
      { tahun: item.tahun, kategori: 'Pengeluaran', nilai: item.pembiayaan.pengeluaran }
    ]);

    const residentData = Object.entries(residentStatistic.penduduk ?? {}).map(([key, value]) => ({
      category: key.replace(/_/g, ' '),
      value
    }));

    const colorMapping = {
      Belanja: '#FF4D4F',
      Pendapatan: '#1890FF',
      Pembiayaan: '#52C41A',
      Pengeluaran: '#FAAD14'
    };

    return {
      resident: {
        data: residentData,
        angleField: 'value',
        colorField: 'category',
        radius: 1,
        innerRadius: 0.6,
        label: {
          type: 'inner',
          offset: '-30%',
          content: ({ percent }) => `${(percent * 100).toFixed(1)}%`,
          style: { fontSize: 14, textAlign: 'center' }
        },
        interactions: [{ type: 'element-active' }]
      },
      apbd: {
        data: apbdData,
        isGroup: true,
        xField: 'tahun',
        yField: 'nilai',
        seriesField: 'kategori',
        label: {
          position: 'middle',
          layout: [{ type: 'interval-adjust-position' }, { type: 'interval-hide-overlap' }, { type: 'adjust-color' }]
        },
        legend: { position: 'top' },
        color: ({ kategori }) => colorMapping[kategori],
        colorField: 'kategori'
      },
      publicAssistance: {
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
      }
    };
  }, [apbdStatistic, residentStatistic]);

  return (
    <div className="grid w-full grid-cols-12 gap-4">
      {getAllOverview.isLoading ? (
        Array.from({ length: 4 }, (_, i) => i).map((index) => (
          <Card key={index} className="col-span-12 h-fit md:col-span-6 lg:col-span-3">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-y-1">
                <Skeleton.Input active />
                <Skeleton.Button active />
              </div>
              <Skeleton.Node active style={{ width: 24, height: 24 }} />
            </div>
          </Card>
        ))
      ) : (
        <>
          <Card className="col-span-12 h-fit md:col-span-6 lg:col-span-3">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-y-1">
                <p className="font-semibold capitalize">Total Bantuan</p>
                <span className="text-xl font-semibold">{overview?.bantuan?.total_bantuan}</span>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500 p-2 text-2xl text-white">
                <GiftOutlined />
              </div>
            </div>
          </Card>
          <Card className="col-span-12 h-fit md:col-span-6 lg:col-span-3">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-y-1">
                <p className="font-semibold capitalize">Total Dusun</p>
                <span className="text-xl font-semibold">{overview?.dusun?.total_dusun}</span>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500 p-2 text-2xl text-white">
                <HomeOutlined />
              </div>
            </div>
          </Card>
          <Card className="col-span-12 h-fit md:col-span-6 lg:col-span-3">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-y-1">
                <p className="font-semibold capitalize">Total Artikel</p>
                <span className="text-xl font-semibold">{overview?.artikel?.total_artikel}</span>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500 p-2 text-2xl text-white">
                <PaperClipOutlined />
              </div>
            </div>
          </Card>
          <Card className="col-span-12 h-fit md:col-span-6 lg:col-span-3">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-y-1">
                <p className="font-semibold capitalize">Total Pemohonan Surat</p>
                <span className="text-xl font-semibold">{overview?.surat?.total_permohonan}</span>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500 p-2 text-2xl text-white">
                <MailOutlined />
              </div>
            </div>
          </Card>
        </>
      )}
      <Card className="col-span-12 w-auto lg:col-span-6">
        <Typography.Title level={5} className="w-full text-center">
          Statistik Penduduk
        </Typography.Title>
        {chartConfigs.resident ? <Pie {...chartConfigs.resident} className="mt-6 h-auto w-full" /> : <Skeleton active className="mt-6" />}
      </Card>
      <Card className="col-span-12 w-auto lg:col-span-6">
        <Typography.Title level={5} className="w-full text-center">
          Statistik APBD
        </Typography.Title>
        {chartConfigs.apbd ? <Column {...chartConfigs.apbd} className="mt-6 h-auto w-full" /> : <Skeleton active className="mt-6" />}
      </Card>
      <Card className="col-span-12 w-auto lg:col-span-6">
        <Typography.Title level={5} className="w-full text-center">
          Penyaluran Bantuan
        </Typography.Title>
        {chartConfigs.publicAssistance ? <Column {...chartConfigs.publicAssistance} className="mt-6 h-auto w-full" /> : <Skeleton active className="mt-6" />}
      </Card>
    </div>
  );
};

export default Dashboard;
