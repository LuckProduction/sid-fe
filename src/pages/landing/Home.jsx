/* eslint-disable react-hooks/exhaustive-deps */
import { CheckCircleFilled, DatabaseOutlined, EyeOutlined, FieldTimeOutlined, PlayCircleOutlined, RightOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Image, List, Skeleton, Space, Tag, Typography } from 'antd';
import { useCallback, useEffect } from 'react';
import { NavLink, useNavigate, useOutletContext } from 'react-router-dom';
import { Reveal } from '@/components';
import { useCrudModal, usePagination, useService } from '@/hooks';
import parse from 'html-react-parser';
import { LandingService } from '@/services';

const Home = () => {
  const { villageProfile, speech, visiMisi, institution } = useOutletContext();

  const navigate = useNavigate();
  const modal = useCrudModal();

  const executeVillageProfile = useCallback(() => villageProfile.execute(), [villageProfile]);
  const executeVisiMisi = useCallback(() => visiMisi.execute(), [visiMisi]);
  const executeSpeech = useCallback(() => speech.execute(), [speech]);
  const executeInstitution = useCallback(() => institution.execute(), [institution]);

  useEffect(() => {
    executeVillageProfile();
    executeVisiMisi();
    executeSpeech();
    executeInstitution();
  }, []);

  const { execute: executeFetchArticle, ...getAllArticle } = useService(LandingService.getAllArticle);
  const { execute: executeFetchVillageEnterprise, ...getAllEnterprise } = useService(LandingService.getAllEnterprise);

  const articlePagination = usePagination({ totalData: getAllArticle.totalData });
  const enterprisePagination = usePagination({ totalData: getAllEnterprise.totalData });

  const fetchArticle = useCallback(() => {
    executeFetchArticle({
      page: articlePagination.page,
      per_page: articlePagination.per_page,
      search: ''
    });
  }, [executeFetchArticle, articlePagination.page, articlePagination.per_page]);

  const fetchVillageEnterprise = useCallback(() => {
    executeFetchVillageEnterprise({
      page: enterprisePagination.page,
      per_page: enterprisePagination.per_page,
      search: ''
    });
  }, [executeFetchVillageEnterprise, enterprisePagination.page, enterprisePagination.per_page]);

  useEffect(() => {
    fetchArticle();
    fetchVillageEnterprise();
  }, [fetchArticle, fetchVillageEnterprise]);

  const article = getAllArticle.data ?? [];
  const enterpise = getAllEnterprise.data ?? [];

  return (
    <>
      <section className="mx-auto grid w-full max-w-screen-xl grid-cols-6 items-center gap-x-10 px-6 py-28">
        {villageProfile.isLoading ? (
          <>
            <div className="col-span-6 lg:col-span-3">
              <Skeleton.Image active size={100} shape="circle" className="mb-6" />
              <Skeleton active className="mb-6" />
              <Skeleton.Button active />
            </div>
            <div className="col-span-3 hidden w-full items-center justify-center lg:flex">
              <Skeleton.Node active style={{ width: '500px', height: '360px' }} />
            </div>
          </>
        ) : (
          <>
            <div className="col-span-6 flex w-full flex-col gap-y-4 lg:col-span-3">
              <Image src={villageProfile?.data?.village_logo} preview={false} width={100} />
              <div>
                <Typography.Title>
                  <Reveal>
                    Sistem Informasi Desa <span className="text-blue-500">GoVillage</span>
                  </Reveal>
                </Typography.Title>
                <Typography.Title level={4} style={{ margin: 0 }}>
                  <Reveal>
                    Kecamatan {villageProfile?.data?.district_profile?.district_name}, {villageProfile?.data?.district_profile?.regency_profile?.regency_name}
                  </Reveal>
                </Typography.Title>
              </div>
              <Typography.Paragraph className="text-gray-500">
                <Reveal>
                  Selamat datang di Sistem Informasi Desa {villageProfile?.data?.village_name}, sebuah platform digital yang dirancang untuk mendukung transparansi, efisiensi, dan kemudahan akses informasi di Desa {villageProfile?.data?.village_name}
                  .
                </Reveal>
              </Typography.Paragraph>
              <Space size="small">
                <Button variant="solid" size="large" color="primary" onClick={() => navigate('/news')}>
                  Lihat Berita
                </Button>
                <Button
                  size="large"
                  icon={<PlayCircleOutlined />}
                  variant="outlined"
                  color="primary"
                  onClick={() =>
                    modal.show.video({
                      title: 'Profil Desa',
                      data: villageProfile?.data?.profile_video_link
                    })
                  }
                >
                  Profil Desa
                </Button>
              </Space>
            </div>
            <div className="order-last col-span-3 hidden grid-cols-12 gap-x-4 lg:grid">
              <div className="col-span-6 flex flex-col gap-y-4">
                <Reveal>
                  <div className="inline-flex gap-x-4 rounded-xl bg-gray-100 p-5">
                    <DatabaseOutlined style={{ fontSize: '26px' }} className="text-blue-500" />
                    <p className="text-xs font-semibold">Akses cepat dan update mudah data desa {villageProfile?.data?.village_name}</p>
                  </div>
                </Reveal>
                <div className="landing-village-card-container flex min-h-80 flex-col gap-y-4 rounded-xl p-6 shadow-2xl shadow-blue-400">
                  <p className="text-xs font-semibold text-white">
                    Akses Cepat <FieldTimeOutlined />
                  </p>
                  <p className="text-4xl font-bold text-white">Desa {villageProfile?.data?.village_name}</p>
                </div>
              </div>
              <div className="col-span-6 flex flex-col gap-y-4">
                <div className="flex min-h-80 flex-col gap-y-4 rounded-xl bg-gradient-to-b from-blue-500 to-blue-300 p-6">
                  <p className="text-xs font-semibold text-white">
                    Praktis <FieldTimeOutlined />
                  </p>
                  <p className="text-4xl font-bold text-white">Mudah & Cepat</p>
                </div>
                <div className="inline-flex items-center gap-x-2">
                  <Button className="w-full" onClick={() => navigate('/mobile_landing')} variant="solid" color="primary" size="large">
                    Akses Dalam Genggaman
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </section>
      <section className="mx-auto flex w-full max-w-screen-xl flex-col items-center justify-center gap-y-12 px-4 py-24">
        <div className="flex flex-col items-center justify-center gap-y-2">
          <Reveal>
            <h2 className="text-sm font-semibold text-blue-500">Sambutan</h2>
          </Reveal>
          <Reveal>
            <p className="text-xl font-semibold">Sambutan Kepala Desa</p>
          </Reveal>
        </div>
        <div className="flex w-full flex-col gap-x-4 rounded-lg border bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-md lg:flex-row">
          {speech.isLoading ? (
            <Skeleton active className="p-16" />
          ) : (
            <>
              <img src={speech?.data?.village_officials?.foto} className="w-full flex-1 rounded-t-lg object-cover transition-all duration-300 lg:h-auto lg:w-60 lg:rounded-l-lg lg:rounded-t-none lg:rounded-tl-lg lg:grayscale lg:hover:grayscale-0" />
              <div className="flex-2 flex w-full flex-col p-10">
                <svg className="h-16 w-16" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    d="M6 6a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h3a3 3 0 0 1-3 3H5a1 1 0 1 0 0 2h1a5 5 0 0 0 5-5V8a2 2 0 0 0-2-2H6Zm9 0a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h3a3 3 0 0 1-3 3h-1a1 1 0 1 0 0 2h1a5 5 0 0 0 5-5V8a2 2 0 0 0-2-2h-3Z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="mb-12 w-full">{speech?.data?.content}</p>
                <b className="w-full">{speech?.data?.village_officials?.name}</b>
                <small className="mb-2 w-full">{speech?.data?.village_officials?.employment?.employment_name}</small>
              </div>
            </>
          )}
        </div>
      </section>
      <section className="w-full bg-white px-4 py-24">
        <div className="mx-auto grid w-full max-w-screen-xl grid-cols-4 gap-x-24 gap-y-12 rounded-3xl bg-gradient-to-br from-blue-500 to-blue-700 px-6 py-12 lg:grid-cols-8 lg:px-20 lg:py-16">
          {visiMisi.isLoading ? (
            <Skeleton active className="col-span-4 lg:col-span-8" />
          ) : (
            <>
              <div className="col-span-4 flex flex-col gap-y-6 lg:col-span-3">
                <div className="flex flex-col gap-y-3">
                  <p className="max-w-44 text-xl font-semibold text-white">Visi dan Misi Desa {villageProfile?.data?.village_name} :</p>
                </div>
                <p className="text-sm text-white">{visiMisi.data?.find((item) => item.type === 'visi')?.content}</p>
              </div>
              <div className="col-span-4 grid grid-cols-4 gap-6 lg:col-span-5">
                {visiMisi?.data &&
                  visiMisi?.data
                    .filter((item) => item.type !== 'visi')
                    .map((item, index) => (
                      <Card key={item.id} className="col-span-4 border-none bg-blue-400 transition-all duration-300 hover:-translate-y-2 lg:col-span-2">
                        <div className="flex flex-col gap-y-2 p-4">
                          <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-center text-lg font-bold text-blue-500">0{index + 1}</span>
                          <h3 className="text-lg font-semibold text-white">Misi No {index + 1}</h3>
                          <p className="text-xs text-white">{item.content}</p>
                        </div>
                      </Card>
                    ))}
              </div>
            </>
          )}
        </div>
      </section>
      <section className="w-full bg-gray-100">
        <div className="mx-auto grid w-full max-w-screen-xl grid-cols-8 items-center gap-x-10 gap-y-12 px-6 py-16 lg:py-32">
          {villageProfile.isLoading ? (
            <div className="col-span-8 flex flex-col gap-y-6 lg:col-span-4">
              <div className="flex flex-col gap-y-2">
                <h2 className="font-semibold text-blue-500">Batas Desa</h2>
                <p className="text-2xl font-semibold">Batas Desa Sukma</p>
              </div>
              <Skeleton active />
              <ul className="flex flex-col gap-y-3">
                <li className="inline-flex items-center gap-x-2 font-semibold">
                  <Skeleton.Input active size="small" />
                </li>
                <li className="inline-flex items-center gap-x-2 font-semibold">
                  <Skeleton.Input active size="small" />
                </li>
              </ul>
              <Skeleton.Button active />
            </div>
          ) : (
            <div className="col-span-8 flex flex-col gap-y-6 lg:col-span-4">
              <div className="flex flex-col gap-y-2">
                <Reveal>
                  <h2 className="font-semibold text-blue-500">Fitur dan Layanan</h2>
                </Reveal>
                <Reveal>
                  <p className="text-2xl font-semibold">Fitur Sistem Informasi Desa</p>
                </Reveal>
              </div>
              <Reveal>
                <p className="max-w-lg">
                  Sistem Informasi Desa Digital hadir dengan berbagai fitur yang dirancang khusus untuk mendukung visi desa modern. Dari pemetaan wilayah hingga layanan administrasi berbasis digital, semua disesuaikan untuk meningkatkan efisiensi,
                  transparansi, dan pembangunan desa yang berkelanjutan!
                </p>
              </Reveal>
              <ul className="flex flex-col gap-y-3">
                <Reveal>
                  <li>
                    <NavLink to="/news" className="inline-flex items-center gap-x-2 font-semibold underline transition-colors hover:text-blue-500">
                      <CheckCircleFilled className="text-blue-500" style={{ fontSize: '24px' }} />
                      Update Terkait Berita, Potensi, Dan Lapak BUMDes
                      <RightOutlined />
                    </NavLink>
                  </li>
                </Reveal>
                <Reveal>
                  <li>
                    <NavLink to="/letterings" className="inline-flex items-center gap-x-2 font-semibold underline transition-colors hover:text-blue-500">
                      <CheckCircleFilled className="text-blue-500" style={{ fontSize: '24px' }} />
                      Layanan Surat Menyurat
                      <RightOutlined />
                    </NavLink>
                  </li>
                </Reveal>
                <Reveal>
                  <li>
                    <NavLink to="/apbd_statistics" className="inline-flex items-center gap-x-2 font-semibold underline transition-colors hover:text-blue-500">
                      <CheckCircleFilled className="text-blue-500" style={{ fontSize: '24px' }} />
                      Transparansi Statistik Desa
                      <RightOutlined />
                    </NavLink>
                  </li>
                </Reveal>
              </ul>
            </div>
          )}

          <div className="col-span-8 flex items-center justify-center lg:col-span-4">
            <img src="/illustration/feature.png" />
          </div>
        </div>
      </section>
      <section className="w-full bg-blue-500">
        <div className="mx-auto flex w-full max-w-screen-xl flex-col items-center justify-center gap-y-12 px-6 py-24">
          <div className="flex w-full flex-col gap-y-2">
            <Reveal>
              <h2 className="text-sm font-semibold text-white">Lembaga</h2>
            </Reveal>
            <Reveal>
              <p className="text-xl font-semibold text-white">Lembaga Desa</p>
            </Reveal>
          </div>
          <div className="grid w-full grid-cols-12 items-center justify-center gap-4">
            {institution.isLoading
              ? Array.from({ length: 6 }, (_, i) => i).map((index) => (
                  <Card className="col-span-12 md:col-span-4 lg:col-span-2" key={index}>
                    <Skeleton active />
                  </Card>
                ))
              : institution?.data?.map((item) => (
                  <Card
                    hoverable
                    className="col-span-12 h-full md:col-span-4 lg:col-span-2"
                    key={item.id}
                    onClick={() =>
                      modal.show.paragraph({
                        title: item.institution_name,
                        data: {
                          content: (
                            <>
                              <Card className="mb-6">
                                <div className="flex flex-col gap-y-2">
                                  <p>Deskripsi Lembaga: {item.desc}</p>
                                  <p>
                                    Kode Lembaga: <Tag color="blue">{item.institution_code}</Tag>
                                  </p>
                                  <p>
                                    Status:{' '}
                                    {(() => {
                                      switch (item.status) {
                                        case 'aktif':
                                          return <Tag color="blue">Aktif</Tag>;
                                        case 'nonaktif':
                                          return <Tag color="orange">Non-Aktif</Tag>;
                                        default:
                                          return <Tag color="red">Undefined</Tag>;
                                      }
                                    })()}
                                  </p>
                                </div>
                              </Card>

                              <div className="mb-6 max-h-64 w-full overflow-y-auto p-4">
                                <List
                                  itemLayout="horizontal"
                                  dataSource={item.member}
                                  renderItem={(anggota) => (
                                    <List.Item>
                                      <List.Item.Meta avatar={<Avatar src={anggota.foto} />} title={anggota.full_name} description={anggota.employment} />
                                    </List.Item>
                                  )}
                                />
                              </div>
                            </>
                          )
                        }
                      })
                    }
                  >
                    <div className="flex flex-col items-center gap-y-4">
                      <Image preview={false} width={64} src={item.image} className="mb-4" />
                      <b className="text-center">{item.institution_name}</b>
                      <small className="news-text text-center">{item.desc}</small>
                    </div>
                  </Card>
                ))}
          </div>
        </div>
      </section>
      <section className="w-full bg-gray-100">
        <div className="mx-auto flex w-full max-w-screen-xl flex-col gap-y-8 px-4 py-28">
          <div className="flex items-end justify-between">
            <div className="flex flex-col gap-y-2">
              <Reveal>
                <h2 className="text-sm font-semibold text-blue-500">Berita</h2>
              </Reveal>
              <Reveal>
                <p className="text-xl font-semibold">Berita desa terbaru :</p>
              </Reveal>
            </div>
            <Button icon={<RightOutlined />} onClick={() => navigate('/news')} iconPosition="end" variant="solid" color="primary">
              Selengkapnya
            </Button>
          </div>
          <div className="grid grid-cols-10 gap-4">
            {article.isLoading
              ? Array.from({ length: 5 }, (_, i) => i).map((index) => (
                  <Card className="col-span-10 md:col-span-5 lg:col-span-2" key={index}>
                    <Skeleton active />
                  </Card>
                ))
              : article?.slice(0, 5).map((item, index) => (
                  <Card onClick={() => navigate(`/news/detail/${item.slug}`)} key={index} className="col-span-10 md:col-span-5 lg:col-span-2" hoverable cover={<img alt="example" style={{ height: '180px', objectFit: 'cover' }} src={item.image} />}>
                    <Reveal>
                      <b className="news-text">{item.title}</b>
                    </Reveal>
                    <Reveal>
                      <div className="news-text mt-2">{parse(item.content)}</div>
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
        </div>
      </section>
      <section className="w-full bg-blue-500">
        <div className="mx-auto flex w-full max-w-screen-xl flex-col gap-y-8 px-4 py-28">
          <div className="flex items-end justify-between">
            <div className="flex flex-col gap-y-2">
              <Reveal>
                <h2 className="text-sm font-semibold text-white">Lapak BUMDes</h2>
              </Reveal>
              <Reveal>
                <p className="text-xl font-semibold text-white">Lapak Badan Usaha Desa :</p>
              </Reveal>
            </div>
            <Button icon={<RightOutlined />} onClick={() => navigate('/village_enterprises')} iconPosition="end" variant="solid">
              Selengkapnya
            </Button>
          </div>
          <div className="grid grid-cols-10 gap-4">
            {enterpise.isLoading
              ? Array.from({ length: 5 }, (_, i) => i).map((index) => (
                  <Card className="col-span-10 md:col-span-5 lg:col-span-2" key={index}>
                    <Skeleton active />
                  </Card>
                ))
              : enterpise?.slice(0, 5).map((item, index) => (
                  <Card
                    onClick={() => navigate(`/village_enterprises/detail/${item.slug}`)}
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
        </div>
      </section>
    </>
  );
};

export default Home;
