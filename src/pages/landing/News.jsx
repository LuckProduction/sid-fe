import { Card, Input, Menu, Pagination } from 'antd';

const News = () => {
  const sampleTag = Array.from({ length: 30 }, (_, index) => ({
    label: index + 1 + 'label',
    key: 'label' + index + 1
  }));
  return (
    <section className="mx-auto flex w-full max-w-screen-xl flex-col gap-y-6 px-4 py-20">
      <div className="flex flex-col gap-y-2">
        <p className="text-xl font-semibold">Berita khas desa mukti terbaru :</p>
      </div>
      <div className="mb-4 grid w-full grid-cols-12 gap-4">
        <Card className="col-span-6" hoverable cover={<img alt="example" style={{ maxHeight: '180px', objectFit: 'cover' }} src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}>
          <b className="news-text">Jambore Perangkat Desa Kabupaten Bandung 2024: Ribuan Peserta Ramaikan Gebyar di Dome Bale Rame Soreang</b>
          <p className="news-text mt-2">Kegiatan Jambore Perangkat Desa Kabupaten Bandung 2024 sukses diramaikan oleh lebih dari 4.000 perangkat desa dari seluruh wilayah Kabupaten Bandung. Acara</p>
        </Card>
        <Card className="col-span-6" hoverable cover={<img alt="example" style={{ maxHeight: '180px', objectFit: 'cover' }} src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}>
          <b className="news-text">Jambore Perangkat Desa Kabupaten Bandung 2024: Ribuan Peserta Ramaikan Gebyar di Dome Bale Rame Soreang</b>
          <p className="news-text mt-2">Kegiatan Jambore Perangkat Desa Kabupaten Bandung 2024 sukses diramaikan oleh lebih dari 4.000 perangkat desa dari seluruh wilayah Kabupaten Bandung. Acara</p>
        </Card>
      </div>
      <div className="flex items-end justify-between">
        <div className="flex w-full flex-col gap-y-2">
          <p className="text-xl font-semibold">Semua Berita:</p>
        </div>
        <Input.Search size="large" className="w-full" />
      </div>
      <Menu className="mb-4" mode="horizontal" items={sampleTag} />
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
    </section>
  );
};

export default News;
