import { useService } from '@/hooks';
import { LandingService } from '@/services';
import { Card, Input, Menu, Pagination } from 'antd';
import { useEffect, useState } from 'react';
import parse from 'html-react-parser';

const News = () => {
  const { execute: fetchArticle, ...getAllArticle } = useService(LandingService.getAllArticle);
  const [filteredArticle, setFilteredArticle] = useState([]);

  useEffect(() => {
    fetchArticle();
  }, [fetchArticle]);

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
        <p className="text-xl font-semibold">Berita khas desa mukti terbaru :</p>
      </div>
      <div className="mb-4 grid w-full grid-cols-12 gap-4">
        {article.slice(0, 2).map((item, index) => (
          <Card key={index} className="col-span-6" hoverable cover={<img alt="example" style={{ maxHeight: '180px', objectFit: 'cover' }} src={item.image} />}>
            <b className="news-text">{item.title}</b>
            <p className="news-text mt-2">{parse(item.content)}</p>
          </Card>
        ))}
      </div>
      <div className="flex items-end justify-between">
        <div className="flex w-full flex-col gap-y-2">
          <p className="text-xl font-semibold">Semua Berita:</p>
        </div>
        <Input.Search size="large" className="w-full" />
      </div>
      <Menu className="mb-4" mode="horizontal" items={tags} onClick={onClick} />
      <div className="grid grid-cols-10 gap-4">
        {filteredArticle.map((item, index) => (
          <Card key={index} className="col-span-2" hoverable style={{ width: 240 }} cover={<img alt="example" style={{ maxHeight: '180px', objectFit: 'cover' }} src={item.image} />}>
            <b className="news-text">{item.title}</b>
            <p className="news-text mt-2">{item.content}</p>
          </Card>
        ))}
      </div>
      <Pagination />
    </section>
  );
};

export default News;
