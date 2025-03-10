import { usePagination, useService } from '@/hooks';
import { LandingService } from '@/services';
import { Card, Empty, Input, Pagination, Skeleton } from 'antd';
import { useEffect, useState } from 'react';
import parse from 'html-react-parser';
import { Reveal } from '@/components';
import { useNavigate } from 'react-router-dom';
import { EyeOutlined } from '@ant-design/icons';

const News = () => {
  const navigate = useNavigate();
  const { execute: fetchArticle, ...getAllArticle } = useService(LandingService.getAllArticle);

  const [searchValue, setSearchValue] = useState('');

  const pagination = usePagination({ totalData: getAllArticle.totalData });

  useEffect(() => {
    fetchArticle({ page: pagination.page, pagination: pagination.perPage, search: searchValue });
  }, [fetchArticle, pagination.page, pagination.perPage, searchValue]);

  const article = getAllArticle.data ?? [];

  const onSearch = (value) => {
    setSearchValue(value);
  };

  return (
    <section className="mx-auto flex w-full max-w-screen-xl flex-col gap-y-6 px-4 py-20">
      <div className="flex flex-col items-end justify-between gap-y-6 md:flex-row">
        <div className="flex w-full flex-col gap-y-2">
          <Reveal>
            <p className="text-xl font-semibold">Semua Berita:</p>
          </Reveal>
        </div>
        <div className="inline-flex w-full gap-x-2">
          <Input.Search placeholder="Cari Berita" size="large" className="w-full" onSearch={onSearch} />
        </div>
      </div>
      {getAllArticle.isLoading ? (
        <div className="grid grid-cols-10 gap-4">
          {Array.from({ length: 5 }, (_, i) => i).map((index) => (
            <Card className="col-span-10 md:col-span-5 lg:col-span-2" key={index}>
              <Skeleton active />
            </Card>
          ))}
        </div>
      ) : article.length === 0 ? (
        <div className="flex justify-center w-full py-12">
          <Empty />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-10 gap-4">
            {article.map((item, index) => (
              <Card
                onClick={() => navigate(`/article/detail/${item.slug}`)}
                key={index}
                className="col-span-10 w-full md:col-span-5 lg:col-span-2"
                hoverable
                cover={<img alt="example" style={{ height: '180px', objectFit: 'cover' }} src={item.image} />}
              >
                <Reveal>
                  <b className="news-text">{item.title}</b>
                </Reveal>
                <Reveal>
                  <p className="news-text mt-2">{parse(item.content)}</p>
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
          <Pagination
            current={pagination.page}
            total={pagination.totalData}
            onChange={pagination.onChange}
            pageSize={pagination.perPage}
          />
        </>
      )}

    </section>
  );
};

export default News;
