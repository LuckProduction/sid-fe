import { usePagination, useService } from '@/hooks';
import { LandingService } from '@/services';
import { Card, Empty, Input, Pagination, Skeleton } from 'antd';
import { useEffect, useState } from 'react';
import parse from 'html-react-parser';
import { Reveal } from '@/components';
import { useNavigate } from 'react-router-dom';
import { EyeOutlined } from '@ant-design/icons';

const VillagePotential = () => {
  const navigate = useNavigate();
  const { execute: fetchVillagePotential, ...getAllVillagePotential } = useService(LandingService.getAllVillagePotential);

  const [searchValue, setSearchValue] = useState('');

  const pagination = usePagination({ totalData: getAllVillagePotential.totalData });

  useEffect(() => {
    fetchVillagePotential({ page: pagination.page, pagination: pagination.per_page, search: searchValue });
  }, [fetchVillagePotential, pagination.page, pagination.per_page, searchValue]);

  const villagePotential = getAllVillagePotential.data ?? [];

  const onSearch = (value) => {
    setSearchValue(value);
  };

  return (
    <section className="mx-auto flex w-full max-w-screen-xl flex-col gap-y-6 px-4 py-20">
      <div className="flex flex-col items-end justify-between gap-y-6 md:flex-row">
        <div className="flex w-full flex-col gap-y-2">
          <Reveal>
            <p className="text-xl font-semibold">Semua Potensi Desa:</p>
          </Reveal>
        </div>
        <div className="inline-flex w-full gap-x-2">
          <Input.Search placeholder="Cari Potensi Desa" size="large" className="w-full" onSearch={onSearch} />
        </div>
      </div>
      {getAllVillagePotential.isLoading ? (
        <div className="grid grid-cols-10 gap-4">
          {Array.from({ length: 5 }, (_, i) => i).map((index) => (
            <Card className="col-span-10 md:col-span-5 lg:col-span-2" key={index}>
              <Skeleton active />
            </Card>
          ))}
        </div>
      ) : villagePotential.length === 0 ? (
        <div className="flex w-full justify-center py-12">
          <Empty />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-10 gap-4">
            {villagePotential.map((item, index) => (
              <Card
                onClick={() => navigate(`/village_potential/detail/${item.slug}`)}
                key={index}
                className="col-span-10 w-full md:col-span-5 lg:col-span-2"
                hoverable
                cover={<img alt="example" style={{ height: '180px', objectFit: 'cover' }} src={item.foto} />}
              >
                <Reveal>
                  <b className="news-text">{item.potential_name}</b>
                </Reveal>
                <Reveal>
                  <p className="news-text mt-2">{parse(item.description)}</p>
                </Reveal>
                <div className="mt-6 flex flex-col gap-y-1">
                  <div className="inline-flex items-center text-xs text-gray-400">{item.created_at}</div>
                  <div className="inline-flex items-center gap-x-2 text-xs text-gray-400">
                    <EyeOutlined className="text-xs" />
                    {item.seen}
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <Pagination current={pagination.page} total={pagination.totalData} onChange={pagination.onChange} pageSize={pagination.per_page} />
        </>
      )}
    </section>
  );
};

export default VillagePotential;
