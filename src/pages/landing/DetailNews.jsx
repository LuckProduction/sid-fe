import { useService } from '@/hooks';
import { LandingService } from '@/services';
import { Skeleton, Typography } from 'antd';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import parse from 'html-react-parser';

const DetailNews = () => {
  const { id } = useParams();
  const { execute: fetchArticle, ...getAllArticle } = useService(LandingService.getDetailArticle);

  useEffect(() => {
    fetchArticle(id);
  }, [fetchArticle, id]);

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
            <Typography.Title level={1}>{article.title}</Typography.Title>
            <div>{article.content ? parse(article.content) : <Skeleton active />}</div>
          </section>
        </>
      )}
    </>
  );
};

export default DetailNews;
