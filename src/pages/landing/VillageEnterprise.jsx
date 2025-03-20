import { Reveal } from '@/components';
import { usePagination, useService } from '@/hooks';
import { LandingService } from '@/services';
import { Card, Empty, Input, Pagination, Skeleton } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const VillageEnterprise = () => {
  const navigate = useNavigate();
  const { execute: fetchEnterprise, ...getAllEnterprise } = useService(LandingService.getAllEnterprise);
  const [searchValue, setSearchValue] = useState('');
  const pagination = usePagination({ totalData: getAllEnterprise.totalData });
  const fetchData = useCallback(() => {
    fetchEnterprise({
      page: pagination.page,
      per_page: pagination.per_page,
      search: searchValue
    });
  }, [fetchEnterprise, pagination.page, pagination.per_page, searchValue]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const enterprise = getAllEnterprise.data ?? [];

  const onSearch = (value) => {
    setSearchValue(value);
  };

  return (
    <section className="mx-auto flex w-full max-w-screen-xl flex-col gap-y-6 px-4 py-20">
      <div className="flex flex-col items-end justify-between gap-y-6 md:flex-row">
        <div className="flex w-full flex-col gap-y-2">
          <Reveal>
            <p className="text-xl font-semibold">Semua Lapak BUMDes:</p>
          </Reveal>
        </div>
        <div className="inline-flex w-full gap-x-2">
          <Input.Search placeholder="Cari Berita" size="large" className="w-full" onSearch={onSearch} />
        </div>
      </div>
      {getAllEnterprise.isLoading ? (
        <div className="grid grid-cols-10 gap-4">
          {Array.from({ length: 5 }, (_, i) => i).map((index) => (
            <Card className="col-span-10 md:col-span-5 lg:col-span-2" key={index}>
              <Skeleton active />
            </Card>
          ))}
        </div>
      ) : enterprise.length === 0 ? (
        <div className="flex w-full justify-center py-12">
          <Empty />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-10 gap-4">
            {enterprise.map((item, index) => (
              <Card
                onClick={() => navigate(window.location.pathname + `/detail/${item.slug}`)}
                key={index}
                className="col-span-10 w-full md:col-span-5 lg:col-span-2"
                hoverable
                cover={<img alt="example" style={{ height: '180px', objectFit: 'cover' }} src={item.foto} />}
              >
                <div className="flex flex-col gap-y-2">
                  <Reveal>
                    <b className="news-text">
                      {item.enterprise_name} {`(${item.resident.full_name})`}
                    </b>
                  </Reveal>
                  <Reveal>
                    <small>{item.operational_time}</small>
                  </Reveal>
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

export default VillageEnterprise;
