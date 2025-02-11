/* eslint-disable react-hooks/exhaustive-deps */
import { Bar, Line } from '@ant-design/charts';
import { UserOutlined } from '@ant-design/icons';
import { Card, Skeleton, Typography } from 'antd';
import { useEffect, useState } from 'react';
const Dashboard = () => {
  const [chartConfigs, setChartConfigs] = useState({ line: null, bar: null });

  const dataApi = [
    { year: '1991', value: 3 },
    { year: '1992', value: 4 },
    { year: '1993', value: 3.5 },
    { year: '1994', value: 5 },
    { year: '1995', value: 4.9 },
    { year: '1996', value: 6 },
    { year: '1997', value: 7 },
    { year: '1998', value: 9 },
    { year: '1999', value: 13 }
  ];

  useEffect(() => {
    const data = dataApi;

    setChartConfigs({
      line: {
        data,
        xField: 'year',
        yField: 'value',
        autoFit: true,
        padding: 'auto',
        smooth: true,
        lineStyle: { stroke: '#1890ff', lineWidth: 2 },
        label: { style: { fill: '#aaa' } }
      },
      bar: {
        data,
        xField: 'year',
        yField: 'value',
        autoFit: true,
        padding: 'auto'
      }
    });
  }, []);

  return (
    <div className="grid w-full grid-cols-12 gap-4">
      <Card className="col-span-3 h-fit">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-1">
            <p className="font-semibold capitalize">total responden</p>
            <span className="text-xl font-semibold">10</span>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500 p-2 text-2xl text-white">
            <UserOutlined />
          </div>
        </div>
      </Card>
      <Card className="col-span-3 h-fit">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-1">
            <p className="font-semibold capitalize">total responden</p>
            <span className="text-xl font-semibold">10</span>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500 p-2 text-2xl text-white">
            <UserOutlined />
          </div>
        </div>
      </Card>
      <Card className="col-span-3 h-fit">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-1">
            <p className="font-semibold capitalize">total responden</p>
            <span className="text-xl font-semibold">10</span>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500 p-2 text-2xl text-white">
            <UserOutlined />
          </div>
        </div>
      </Card>
      <Card className="col-span-3 h-fit">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-1">
            <p className="font-semibold capitalize">total responden</p>
            <span className="text-xl font-semibold">10</span>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500 p-2 text-2xl text-white">
            <UserOutlined />
          </div>
        </div>
      </Card>

      <Card className="col-span-4 w-auto">
        <Typography.Title level={5} className="w-full text-center">
          Angka Penyebaran Dana Bantuan
        </Typography.Title>
        {chartConfigs.line ? <Line {...chartConfigs.line} className="mt-6 h-auto w-full" /> : <Skeleton active />}
      </Card>
      <Card className="col-span-8 w-auto">
        <Typography.Title level={5} className="w-full text-center">
          Angka Penyebaran Dana Bantuan
        </Typography.Title>
        {chartConfigs.bar ? <Bar {...chartConfigs.bar} className="mt-6 h-auto w-full" /> : <Skeleton active />}
      </Card>
    </div>
  );
};

export default Dashboard;
