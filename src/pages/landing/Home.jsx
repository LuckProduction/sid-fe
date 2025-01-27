import { DatabaseOutlined, FieldTimeOutlined, PlayCircleOutlined, RightOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Image, Pagination, Space, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

const Boom = () => {
  const navigate = useNavigate();
  return (
    <>
      <section className="mx-auto grid max-w-screen-xl grid-cols-12 items-center gap-x-10 px-4 py-28">
        <div className="col-span-6 flex flex-col gap-y-4">
          <Image src="/logo/logo_desa.png" preview={false} width={100} />
          <div>
            <Typography.Title style={{ margin: 0, marginBottom: 6 }}>
              Sistem Informasi Desa <span className="text-blue-500">Mukti</span>
            </Typography.Title>
            <Typography.Title level={4} style={{ margin: 0 }}>
              Kec. Cimenyan Kab. Bandung Prov. Jawa Barat
            </Typography.Title>
          </div>

          <Typography.Paragraph className="text-gray-500">
            Selamat datang di Sistem Informasi Desa Mukti, sebuah platform digital yang dirancang untuk mendukung transparansi, efisiensi, dan kemudahan akses informasi di Desa Mukti.
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
              <p className="text-xs font-semibold">Akses cepat dan update mudah data desa mukti</p>
            </div>
            <div className="landing-village-card-container flex min-h-80 flex-col gap-y-4 rounded-xl p-6 shadow-2xl shadow-blue-400">
              <p className="text-xs font-semibold text-white">
                Akses Cepat <FieldTimeOutlined />
              </p>
              <p className="text-5xl font-bold text-white">Desa Mukti</p>
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
      <section className="w-full bg-gray-100">
        <div className="mx-auto flex w-full max-w-screen-xl flex-col gap-y-8 px-4 py-20">
          <div className="flex items-end justify-between">
            <div className="flex flex-col gap-y-2">
              <h2 className="text-sm font-semibold text-blue-500">Berita</h2>
              <p className="max-w-44 text-xl font-semibold">Berita khas desa mukti terbaru :</p>
            </div>
            <Button icon={<RightOutlined />} onClick={() => navigate('/news')} iconPosition="end" variant="solid" color="primary">
              Lihat Selengkapnya
            </Button>
          </div>
          <div className="grid grid-cols-10 gap-4">
            <Card className="col-span-2" hoverable style={{ width: 240 }} cover={<img alt="example" style={{ maxHeight: '180px', objectFit: 'cover' }} src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}>
              <b className="news-text">Jambore Perangkat Desa Kabupaten Bandung 2024: Ribuan Peserta Ramaikan Gebyar di Dome Bale Rame Soreang</b>
              <p className="news-text mt-2">Kegiatan Jambore Perangkat Desa Kabupaten Bandung 2024 sukses diramaikan oleh lebih dari 4.000 perangkat desa dari seluruh wilayah Kabupaten Bandung. Acara</p>
            </Card>
            <Card className="col-span-2" hoverable style={{ width: 240 }} cover={<img alt="example" style={{ maxHeight: '180px', objectFit: 'cover' }} src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}>
              <b className="news-text">Jambore Perangkat Desa Kabupaten Bandung 2024: Ribuan Peserta Ramaikan Gebyar di Dome Bale Rame Soreang</b>
              <p className="news-text mt-2">Kegiatan Jambore Perangkat Desa Kabupaten Bandung 2024 sukses diramaikan oleh lebih dari 4.000 perangkat desa dari seluruh wilayah Kabupaten Bandung. Acara</p>
            </Card>
            <Card className="col-span-2" hoverable style={{ width: 240 }} cover={<img alt="example" style={{ maxHeight: '180px', objectFit: 'cover' }} src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}>
              <b className="news-text">Jambore Perangkat Desa Kabupaten Bandung 2024: Ribuan Peserta Ramaikan Gebyar di Dome Bale Rame Soreang</b>
              <p className="news-text mt-2">Kegiatan Jambore Perangkat Desa Kabupaten Bandung 2024 sukses diramaikan oleh lebih dari 4.000 perangkat desa dari seluruh wilayah Kabupaten Bandung. Acara</p>
            </Card>
            <Card className="col-span-2" hoverable style={{ width: 240 }} cover={<img alt="example" style={{ maxHeight: '180px', objectFit: 'cover' }} src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}>
              <b className="news-text">Jambore Perangkat Desa Kabupaten Bandung 2024: Ribuan Peserta Ramaikan Gebyar di Dome Bale Rame Soreang</b>
              <p className="news-text mt-2">Kegiatan Jambore Perangkat Desa Kabupaten Bandung 2024 sukses diramaikan oleh lebih dari 4.000 perangkat desa dari seluruh wilayah Kabupaten Bandung. Acara</p>
            </Card>
            <Card className="col-span-2" hoverable style={{ width: 240 }} cover={<img alt="example" style={{ maxHeight: '180px', objectFit: 'cover' }} src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}>
              <b className="news-text">Jambore Perangkat Desa Kabupaten Bandung 2024: Ribuan Peserta Ramaikan Gebyar di Dome Bale Rame Soreang</b>
              <p className="news-text mt-2">Kegiatan Jambore Perangkat Desa Kabupaten Bandung 2024 sukses diramaikan oleh lebih dari 4.000 perangkat desa dari seluruh wilayah Kabupaten Bandung. Acara</p>
            </Card>
          </div>
          <Pagination />
        </div>
      </section>
    </>
  );
};

export default Boom;
