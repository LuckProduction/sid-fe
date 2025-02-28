import { useService } from '@/hooks';
import { LandingService } from '@/services';
import { Skeleton, Tag, Typography } from 'antd';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import parse from 'html-react-parser';
import { EyeOutlined } from '@ant-design/icons';

const DetailNews = () => {
  const { slug } = useParams();
  const { execute: fetchArticle, ...getAllArticle } = useService(LandingService.getDetailArticle);

  useEffect(() => {
    fetchArticle(slug);
  }, [fetchArticle, slug]);

  const article = getAllArticle.data ?? {};

  return (
    <>
      {getAllArticle.isLoading ? (
        <Skeleton active />
      ) : (
        <>
          <section className="mx-auto w-full max-w-screen-md px-4 pt-24">
            <img src={article.image} className="aspect-video w-full rounded-lg object-cover" />
          </section>
          <section className="mx-auto w-full max-w-screen-md px-4 pb-16 pt-12">
            {Object.keys(article).length === 0 ? (
              <Skeleton active />
            ) : (
              <>
                <Typography.Title level={1}>
                  {article.title}
                  <Tag>{article.tag}</Tag>
                </Typography.Title>
                <div className="mb-4 flex w-full flex-wrap gap-4">
                  {article.category.map((item, index) => (
                    <b key={index}>{item.category_name}</b>
                  ))}
                </div>
                <div className="w-full"></div>
                <div className="mb-12 flex w-full items-center gap-x-4">
                  <div className="inline-flex items-center gap-x-2 text-xs text-gray-400">
                    <EyeOutlined className="text-xs" />
                    {article.seen}
                  </div>
                  <div className="inline-flex items-center text-xs text-gray-400">{article.created_at}</div>
                </div>
                <div>{article.content ? parse(article.content) : <Skeleton active />}</div>
              </>
            )}
          </section>
        </>
      )}
    </>
  );
};

export default DetailNews;
