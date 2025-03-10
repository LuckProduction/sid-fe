import { usePagination, useService } from '@/hooks';
import { LandingService } from '@/services';
import { Card, Pagination, Skeleton, Tag, Typography } from 'antd';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import parse from 'html-react-parser';
import { EyeOutlined } from '@ant-design/icons';
import { Reveal } from '@/components';

const DetailNews = () => {
  const { slug } = useParams();
  const navigate = useNavigate()
  const { execute: fetchArticleDetail, ...getAllArticleDetail } = useService(LandingService.getDetailArticle);
  const { execute: fetchArticle, ...getAllArticle } = useService(LandingService.getAllArticle);

  const pagination = usePagination({ totalData: getAllArticleDetail.totalData });

  useEffect(() => {
    fetchArticleDetail(slug);
    fetchArticle({ page: pagination.page, pagination: pagination.perPage, search: '' });
  }, [fetchArticle, fetchArticleDetail, pagination.page, pagination.perPage, slug]);

  const detailArticle = getAllArticleDetail.data ?? {};
  const article = getAllArticle.data ?? [];

  return (
    <>
      {getAllArticleDetail.isLoading ? (
        <Skeleton active />
      ) : (
        <>
          <section className="mx-auto w-full max-w-screen-md px-4 pt-24">
            <img src={detailArticle.image} className="aspect-video w-full rounded-lg object-cover" />
          </section>
          <section className="mx-auto w-full max-w-screen-md px-4 pb-16 pt-12">
            {Object.keys(detailArticle).length === 0 ? (
              <Skeleton active />
            ) : (
              <>
                <Typography.Title level={1}>
                  {detailArticle.title}
                  <Tag>{detailArticle.tag}</Tag>
                </Typography.Title>
                <div className="mb-4 flex w-full flex-wrap gap-4">
                  {detailArticle.category.map((item, index) => (
                    <b key={index}>{item.category_name}</b>
                  ))}
                </div>
                <div>
                  
                </div>
                <div className="w-full"></div>
                <div className="mb-12 flex w-full items-center gap-x-4">
                  <div className="inline-flex items-center gap-x-2 text-xs text-gray-400">
                    <EyeOutlined className="text-xs" />
                    {detailArticle.seen}
                  </div>
                  <div className="inline-flex items-center text-xs text-gray-400">{detailArticle.created_at}</div>
                </div>
                <div>{detailArticle.content ? parse(detailArticle.content) : <Skeleton active />}</div>
              </>
            )}
          </section>
          <section className="mx-auto flex w-full max-w-screen-xl flex-col gap-y-6 px-4 py-20">
            <div className="flex flex-col items-end justify-between gap-y-6 md:flex-row">
              <div className="flex w-full flex-col gap-y-2">
                <Reveal>
                  <p className="text-xl font-semibold">Berita Lainnya:</p>
                </Reveal>
              </div>
            </div>
            <div className="grid grid-cols-10 gap-4">
              {getAllArticle.isLoading
                ? Array.from({ length: 5 }, (_, i) => i).map((index) => (
                  <Card className="col-span-10 md:col-span-5 lg:col-span-2" key={index}>
                    <Skeleton active />
                  </Card>
                ))
                : article.map((item, index) => (
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
            <Pagination current={pagination.page} total={pagination.totalData} onChange={pagination.onChange} pageSize={pagination.perPage} />
          </section>
        </>
      )}
    </>
  );
};

export default DetailNews;
