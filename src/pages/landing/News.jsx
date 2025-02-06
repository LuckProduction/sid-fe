import { usePagination, useService } from '@/hooks';
import { LandingService } from '@/services';
import { Card, Input, Menu, Pagination, Skeleton } from 'antd';
import { useEffect, useState } from 'react';
import parse from 'html-react-parser';
import { Reveal } from '@/components';
import { useNavigate } from 'react-router-dom';

const News = () => {
  const navigate = useNavigate();
  const { execute: fetchArticle, ...getAllArticle } = useService(LandingService.getAllArticle);
  const [filteredArticle, setFilteredArticle] = useState([]);

  const pagination = usePagination({ totalData: getAllArticle.totalData });

  useEffect(() => {
    fetchArticle(pagination.page, pagination.perPage);
  }, [fetchArticle, pagination.page, pagination.perPage]);

  useEffect(() => {
    if (getAllArticle.data) {
      setFilteredArticle(getAllArticle.data); // Set initial articles
    }
  }, [getAllArticle.data]);

  const article = getAllArticle.data ?? [];
  const tags = article.map((item) => ({
    label: item.tag,
    key: item.tag
  }));

  const onClick = (e) => {
    setFilteredArticle(getAllArticle.data.filter((item) => String(item.tag) === e.key));
  };

  return (
    <section className="mx-auto flex w-full max-w-screen-xl flex-col gap-y-6 px-4 py-20">
      <div className="flex flex-col gap-y-2">
        <Reveal>
          <p className="text-xl font-semibold">Berita khas desa mukti terbaru :</p>
        </Reveal>
      </div>
      <div className="mb-4 grid w-full grid-cols-12 gap-4">
        {getAllArticle.isLoading ? (
          <>
            <Card className="col-span-6">
              <Skeleton active />
            </Card>
            <Card className="col-span-6">
              <Skeleton active />
            </Card>
          </>
        ) : (
          article.slice(0, 2).map((item, index) => (
            <Card key={index} className="col-span-6" hoverable cover={<img alt="example" style={{ height: '180px', objectFit: 'cover' }} src={item.image} />} onClick={() => navigate(`/article/detail/${item.slug}`)}>
              <Reveal>
                <b className="news-text">{item.title}</b>
              </Reveal>
              <Reveal>
                <p className="news-text mt-2">{parse(item.content)}</p>
              </Reveal>
            </Card>
          ))
        )}
      </div>
      <div className="flex items-end justify-between">
        <div className="flex w-full flex-col gap-y-2">
          <Reveal>
            <p className="text-xl font-semibold">Semua Berita:</p>
          </Reveal>
        </div>
        <Input.Search size="large" className="w-full" />
      </div>
      <Menu className="mb-4" mode="horizontal" items={tags} onClick={onClick} />
      <div className="grid grid-cols-10 gap-4">
        {getAllArticle.isLoading
          ? Array.from({ length: 5 }, (_, i) => i).map((index) => (
              <Card className="col-span-2" key={index}>
                <Skeleton active />
              </Card>
            ))
          : filteredArticle.map((item, index) => (
              <Card onClick={() => navigate(`/article/detail/${item.slug}`)} key={index} className="col-span-2" hoverable style={{ width: 240 }} cover={<img alt="example" style={{ height: '180px', objectFit: 'cover' }} src={item.image} />}>
                <Reveal>
                  <b className="news-text">{item.title}</b>
                </Reveal>
                <Reveal>
                  <p className="news-text mt-2">{parse(item.content)}</p>
                </Reveal>
              </Card>
            ))}
      </div>
      <Pagination />
    </section>
  );
};

export default News;
