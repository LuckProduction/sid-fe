import { DataLoader, DataTable, Reveal } from '@/components';
import Modul from '@/constants/Modul';
import { useCrudModal, usePagination, useService } from '@/hooks';
import { LandingService } from '@/services';
import { DownloadOutlined, ExclamationOutlined, LeftOutlined } from '@ant-design/icons';
import { Button, Card, Tag, Typography } from 'antd';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LegalProducts = () => {
  const navigate = useNavigate();
  const modal = useCrudModal();
  const { execute: fetchLegalProducts, ...getAllLegalProducts } = useService(LandingService.getAllLegalProducts);
  const pagination = usePagination({ totalData: getAllLegalProducts.totalData });

  useEffect(() => {
    fetchLegalProducts(pagination.page, pagination.perPage);
  }, [fetchLegalProducts, pagination.page, pagination.perPage]);

  const legalProducts = getAllLegalProducts.data ?? [];

  const Column = [
    {
      title: 'Judul',
      dataIndex: 'title',
      sorter: (a, b) => a.title.length - b.title.length,
      searchable: true
    },
    {
      title: 'Jenis',
      dataIndex: 'type',
      sorter: (a, b) => a.type.length - b.type.length,
      searchable: true
    },
    {
      title: 'Status',
      dataIndex: 'status',
      sorter: (a, b) => a.status.length - b.status.length,
      searchable: true,
      render: (_, record) => {
        switch (record.status) {
          case 'aktif':
            return <Tag color="blue">Aktif</Tag>;
          case 'nonaktif':
            return <Tag color="warning">Non-Aktif</Tag>;
          default:
            return <Tag color="error">Undifined</Tag>;
        }
      }
    },
    {
      title: 'Aksi',
      render: (_, record) => (
        <Button
          variant="outlined"
          color="green"
          icon={<ExclamationOutlined />}
          onClick={() => {
            modal.show.description({
              title: record.assignment_number,
              data: [
                {
                  key: 'title',
                  label: `Judul ${Modul.LEGAL_PRODUCTS}`,
                  children: record.title
                },
                {
                  key: 'assignment_number',
                  label: `Nomor Penetapan`,
                  children: record.assignment_number
                },
                {
                  key: 'assignment_date',
                  label: `Tanggal Penetapan`,
                  children: record.assignment_date
                },
                {
                  key: 'type',
                  label: `Jenis`,
                  children: record.type
                },
                {
                  key: 'year',
                  label: `Tahun`,
                  children: record.year
                },
                {
                  key: 'document',
                  label: `Dokumen`,
                  children: (
                    <Button icon={<DownloadOutlined />} onClick={() => window.open(record.document, '_blank')}>
                      Download Sumber
                    </Button>
                  )
                },
                {
                  key: 'status',
                  label: `Status `,
                  children: (() => {
                    let statusTag;
                    switch (record.status) {
                      case 'aktif':
                        statusTag = <Tag color="blue">Aktif</Tag>;
                        break;
                      case 'nonaktif':
                        statusTag = <Tag color="warning">Non-Aktif</Tag>;
                        break;
                      default:
                        statusTag = <Tag color="error">Undefined</Tag>;
                    }
                    return statusTag;
                  })()
                }
              ]
            });
          }}
        />
      )
    }
  ];
  return (
    <>
      <section className="relative w-full bg-blue-500 text-white">
        <div className="relative z-10 mx-auto max-w-screen-xl px-6 py-24">
          <button className="mb-12 inline-flex items-center gap-x-2 text-sm" onClick={() => navigate(-1)}>
            <LeftOutlined />
            kembali
          </button>
          <Reveal>
            <Typography.Title style={{ color: '#fff' }}>Produk Hukum</Typography.Title>
          </Reveal>
          <Reveal>
            <div className="max-w-lg">
              <small>Dapatkan akses cepat dan mudah ke berbagai peraturan, ketetapan, keputusan, serta produk hukum desa lainnya untuk mendukung transparansi dan kepatuhan.</small>
            </div>
          </Reveal>
        </div>
        <img src="/illustration/city_sillhoute_transparent.png" className="absolute bottom-0 left-0 z-0 w-full" />
      </section>
      <section className="min-h-screen w-full bg-white">
        <div className="mx-auto flex max-w-screen-lg flex-col gap-y-6 px-6 py-12">
          {getAllLegalProducts.isLoading ? (
            <DataLoader type="datatable" />
          ) : (
            <Card>
              <div className="w-full max-w-full overflow-x-auto">
                <DataTable data={legalProducts} columns={Column} pagination={pagination} loading={getAllLegalProducts.isLoading} />
              </div>
            </Card>
          )}
        </div>
      </section>
    </>
  );
};

export default LegalProducts;
