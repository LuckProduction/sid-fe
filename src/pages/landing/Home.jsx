import { useService } from '@/hooks';
import { LandingService } from '@/services';
import { CheckCircleFilled, DatabaseOutlined, EnvironmentOutlined, FieldTimeOutlined, PlayCircleOutlined, RightOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Image, Pagination, Space, Typography } from 'antd';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import parse from 'html-react-parser';

const Home = () => {
  const navigate = useNavigate();
  const { execute: fetchVisiMisi, ...getAllVisiMisi } = useService(LandingService.getAllVisiMisi);
  const { execute: fetchArticle, ...getAllArticle } = useService(LandingService.getAllArticle);
  const { execute: fetchSpeech, ...getAllSpeech } = useService(LandingService.getSpeech);

  useEffect(() => {
    fetchVisiMisi();
    fetchArticle();
    fetchSpeech();
  }, [fetchArticle, fetchSpeech, fetchVisiMisi]);

  const visiMisi = getAllVisiMisi.data ?? [];
  const article = getAllArticle.data ?? [];
  const speech = getAllSpeech.data ?? [];

  return (
    <>
      <section className="mx-auto grid max-w-screen-xl grid-cols-12 items-center gap-x-10 px-4 py-28">
        <div className="col-span-6 flex flex-col gap-y-4">
          <Image src="/logo/bonebolango.jpg" preview={false} width={100} />
          <div>
            <Typography.Title style={{ margin: 0, marginBottom: 6 }}>
              Sistem Informasi Desa <span className="text-blue-500">Sukma</span>
            </Typography.Title>
            <Typography.Title level={4} style={{ margin: 0 }}>
              Kec. Botupingge, Kabupaten Bonebolango
            </Typography.Title>
          </div>

          <Typography.Paragraph className="text-gray-500">
            Selamat datang di Sistem Informasi Desa Sukma, sebuah platform digital yang dirancang untuk mendukung transparansi, efisiensi, dan kemudahan akses informasi di Desa Sukma.
          </Typography.Paragraph>
          <Space size="small">
            <Button variant="solid" size="large" color="primary">
              Lihat Berita
            </Button>
            <Button size="large" icon={<PlayCircleOutlined />} variant="outlined" color="primary">
              Profil Desa
            </Button>
          </Space>
        </div>
        <div className="order-last col-span-5 grid grid-cols-12 gap-x-4">
          <div className="col-span-6 flex flex-col gap-y-4">
            <div className="inline-flex gap-x-4 rounded-xl bg-gray-100 p-5">
              <DatabaseOutlined style={{ fontSize: '26px' }} className="text-blue-500" />
              <p className="text-xs font-semibold">Akses cepat dan update mudah data desa Sukma</p>
            </div>
            <div className="landing-village-card-container flex min-h-80 flex-col gap-y-4 rounded-xl p-6 shadow-2xl shadow-blue-400">
              <p className="text-xs font-semibold text-white">
                Akses Cepat <FieldTimeOutlined />
              </p>
              <p className="text-5xl font-bold text-white">Desa Sukma</p>
            </div>
          </div>
          <div className="col-span-6 flex flex-col gap-y-4">
            <div className="flex min-h-80 flex-col gap-y-4 rounded-xl bg-gradient-to-b from-blue-500 to-blue-300 p-6">
              <p className="text-xs font-semibold text-white">
                Praktis <FieldTimeOutlined />
              </p>
              <p className="text-5xl font-bold text-white">Mudah & Cepat</p>
            </div>
            <div className="inline-flex items-center gap-x-2">
              <Avatar.Group shape="circle" size="large">
                <Avatar style={{ backgroundColor: '#fde3cf' }}>A</Avatar>
                <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
              </Avatar.Group>
              <span className="rounded-full bg-blue-500 p-3 px-5 text-xs text-white">50+ Perangkat Desa</span>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full bg-white py-24">
        <div className="mx-auto grid w-full max-w-screen-xl grid-cols-12 gap-x-24 rounded-3xl bg-gradient-to-br from-blue-500 to-blue-700 px-20 py-16">
          <div className="col-span-4 flex flex-col gap-y-6">
            <div className="flex flex-col gap-y-3">
              <h2 className="w-fit rounded-full border border-white px-4 py-2 text-sm font-semibold text-white">Visi dan Misi</h2>
              <p className="max-w-44 text-xl font-semibold text-white">Visi dan Misi Desa Sukma :</p>
            </div>
            <p className="text-sm text-white">{visiMisi?.find((item) => item.type === 'visi')?.content}</p>
          </div>
          <div className="col-span-8 grid grid-cols-12 gap-6 p-2">
            {visiMisi &&
              visiMisi
                .filter((item) => item.type !== 'visi') // Hanya ambil item yang bukan "visi"
                .map((item, index) => (
                  <Card key={item.id} className="col-span-6 border-none bg-blue-400 transition-all duration-300 hover:-translate-y-2">
                    <div className="flex flex-col gap-y-2 p-4">
                      <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-center text-lg font-bold text-blue-500">0{index + 1}</span>
                      <h3 className="text-lg font-semibold text-white">Misi No {index + 1}</h3>
                      <p className="text-xs text-white">{item.content}</p>
                    </div>
                  </Card>
                ))}
          </div>
        </div>
      </section>
      <section className="w-full bg-gray-100">
        <div className="mx-auto grid w-full max-w-screen-xl grid-cols-10 gap-x-10 px-6 py-32">
          <div className="col-span-5 flex flex-col gap-y-6">
            <div className="flex flex-col gap-y-2">
              <h2 className="font-semibold text-blue-500">Batas Desa</h2>
              <p className="text-2xl font-semibold">Batas Desa Sukma</p>
            </div>
            <p className="max-w-lg">Batas Desa bukan sekadar garis di peta—ini adalah fondasi untuk membangun desa yang lebih tertata, aman, dan berkembang! Dengan fitur Batas Desa, Anda bisa:</p>
            <ul className="flex flex-col gap-y-3">
              <li className="inline-flex items-center gap-x-2 font-semibold">
                <CheckCircleFilled className="text-blue-500" style={{ fontSize: '24px' }} />
                Menentukan Wilayah dengan Jelas
              </li>
              <li className="inline-flex items-center gap-x-2 font-semibold">
                <CheckCircleFilled className="text-blue-500" style={{ fontSize: '24px' }} />
                Mendukung Perencanaan Pembangunan
              </li>
              <li className="inline-flex items-center gap-x-2 font-semibold">
                <CheckCircleFilled className="text-blue-500" style={{ fontSize: '24px' }} />
                Mempermudah Pelayanan Publik
              </li>
            </ul>
            <Button className="mt-2 w-fit" variant="solid" color="primary" size="large" icon={<EnvironmentOutlined />}>
              Lihat Batas Desa
            </Button>
          </div>
          <div className="col-span-5 flex items-center justify-center">
            <img src="/illustration/map.png" />
          </div>
        </div>
      </section>
      <section className="mx-auto flex w-full max-w-screen-xl flex-col items-center justify-center gap-y-12 px-4 py-24">
        <div className="flex flex-col items-center justify-center gap-y-2">
          <h2 className="text-sm font-semibold text-blue-500">Sambutan</h2>
          <p className="text-xl font-semibold">Sambutan Kepala Desa</p>
        </div>
        <div className="flex w-full max-w-4xl gap-x-4 rounded-lg border bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-md">
          <img src={speech.village_officials?.foto} className="w-full flex-1 rounded-l-lg object-cover grayscale transition-all duration-300 hover:grayscale-0" />
          <div className="flex-2 flex w-full flex-col p-12">
            <svg className="h-16 w-16" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path
                fillRule="evenodd"
                d="M6 6a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h3a3 3 0 0 1-3 3H5a1 1 0 1 0 0 2h1a5 5 0 0 0 5-5V8a2 2 0 0 0-2-2H6Zm9 0a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h3a3 3 0 0 1-3 3h-1a1 1 0 1 0 0 2h1a5 5 0 0 0 5-5V8a2 2 0 0 0-2-2h-3Z"
                clipRule="evenodd"
              />
            </svg>
            <p className="mb-12 w-full">{speech.content}</p>
            <b className="w-full">{speech.village_officials?.name}</b>
            <small className="mb-2 w-full">{speech.village_officials?.employment?.employment_name}</small>
          </div>
        </div>
      </section>
      <section className="w-full bg-gray-100">
        <div className="mx-auto flex w-full max-w-screen-xl flex-col gap-y-8 px-4 py-20">
          <div className="flex items-end justify-between">
            <div className="flex flex-col gap-y-2">
              <h2 className="text-sm font-semibold text-blue-500">Berita</h2>
              <p className="max-w-44 text-xl font-semibold">Berita khas desa Sukma terbaru :</p>
            </div>
            <Button icon={<RightOutlined />} onClick={() => navigate('/news')} iconPosition="end" variant="solid" color="primary">
              Lihat Selengkapnya
            </Button>
          </div>
          <div className="grid grid-cols-10 gap-4">
            {article.slice(0, 5).map((item, index) => (
              <Card onClick={() => navigate(`/article/detail/${item.slug}`)} key={index} className="col-span-2" hoverable style={{ width: 240 }} cover={<img alt="example" style={{ maxHeight: '180px', objectFit: 'cover' }} src={item.image} />}>
                <b className="news-text">{item.title}</b>
                <p className="news-text mt-2">{parse(item.content)}</p>
              </Card>
            ))}
          </div>
          <Pagination />
        </div>
      </section>
    </>
  );
};

export default Home;
