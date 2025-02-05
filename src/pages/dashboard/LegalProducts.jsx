import { DataLoader, DataTable } from '@/components';
import { InputType } from '@/constants';
import Modul from '@/constants/Modul';
import { useAuth, useCrudModal, useNotification, useService } from '@/hooks';
import { LegalProductsService } from '@/services';
import dateFormatter from '@/utils/dateFormatter';
import { DeleteOutlined, DownloadOutlined, EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Space, Tag, Typography } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

const LegalProducts = () => {
  const { token } = useAuth();
  const { success, error } = useNotification();
  const { execute: fetchLegalProducts, ...getAllLegalProducts } = useService(LegalProductsService.getAll);
  const storeLegalProducts = useService(LegalProductsService.store);
  const updateLegalProducts = useService(LegalProductsService.update);
  const deleteLegalProducts = useService(LegalProductsService.delete);
  const deleteBatchLegalProducts = useService(LegalProductsService.deleteBatch);
  const [selectedData, setSelectedData] = useState([]);

  const modal = useCrudModal();

  useEffect(() => {
    fetchLegalProducts(token);
  }, [fetchLegalProducts, token]);

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
      width: '40%',
      render: (_, record) => (
        <Space size="small">
          <Button
            icon={<EditOutlined />}
            variant="outlined"
            color="primary"
            onClick={() => {
              modal.edit({
                title: `Edit ${Modul.LEGAL_PRODUCTS}`,
                data: { ...record, assignment_date: dayjs(record.assignment_date), year: dayjs(record.year) },
                formFields: formFields,
                onSubmit: async (values) => {
                  const { message, isSuccess } = await updateLegalProducts.execute(
                    record.id,
                    { ...values, assignment_date: dateFormatter(values.assignment_date), year: dateFormatter(values.year, 'year'), _method: 'PUT' },
                    token,
                    values.document.file
                  );
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchLegalProducts(token);
                  } else {
                    error('Gagal', message);
                  }
                  return isSuccess;
                }
              });
            }}
          />
          <Button
            icon={<EyeOutlined />}
            variant="outlined"
            color="green"
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
                  // TODO: PROVIDE SOME DOWNLOAD BUTTON FOR DOWNLOAD THE DOCUMENT
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
                  },
                  {
                    key: 'downloads',
                    label: `Jumlah Download`,
                    children: record.downloads
                  },
                  {
                    key: 'seen',
                    label: `Jumlah Dilihat`,
                    children: record.seen
                  }
                ]
              });
            }}
          />
          <Button
            icon={<DeleteOutlined />}
            variant="outlined"
            color="danger"
            onClick={() => {
              modal.delete.default({
                title: `Delete ${Modul.LEGAL_PRODUCTS}`,
                data: { ...record, assignment_date: dayjs(record.assignment_date), year: dayjs(record.year) },
                formFields: formFields,
                onSubmit: async () => {
                  const { isSuccess, message } = await deleteLegalProducts.execute(record.id, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchLegalProducts(token);
                  } else {
                    error('Gagal', message);
                  }
                  return isSuccess;
                }
              });
            }}
          />
        </Space>
      )
    }
  ];

  const formFields = [
    {
      label: `Judul ${Modul.LEGAL_PRODUCTS}`,
      name: 'title',
      type: InputType.TEXT,
      rules: [
        {
          required: true,
          message: `Judul ${Modul.LEGAL_PRODUCTS} harus diisi`
        }
      ]
    },
    {
      label: `Nomor Penetapan `,
      name: 'assignment_number',
      type: InputType.TEXT,
      rules: [
        {
          required: true,
          message: `Nomor Penetapan ${Modul.LEGAL_PRODUCTS} harus diisi`
        }
      ]
    },
    {
      label: `Tanggal Penetapan `,
      name: 'assignment_date',
      type: InputType.DATE,
      rules: [
        {
          required: true,
          message: `Tanggal Penetapan ${Modul.LEGAL_PRODUCTS} harus diisi`
        }
      ]
    },
    {
      label: `Jenis ${Modul.LEGAL_PRODUCTS}`,
      name: 'type',
      type: InputType.TEXT,
      rules: [
        {
          required: true,
          message: `Jenis ${Modul.LEGAL_PRODUCTS} harus diisi`
        }
      ]
    },
    {
      label: `Tahun ${Modul.LEGAL_PRODUCTS}`,
      name: 'year',
      type: InputType.DATE,
      extra: {
        picker: 'year'
      },
      rules: [
        {
          required: true,
          message: `Tahun ${Modul.LEGAL_PRODUCTS} harus diisi`
        }
      ]
    },
    {
      label: `Dokumen ${Modul.LEGAL_PRODUCTS}`,
      name: 'document',
      type: InputType.UPLOAD,
      max: 1,
      beforeUpload: () => {
        return false;
      },
      getFileList: (data) => {
        return [
          {
            url: data?.document,
            name: data?.name
          }
        ];
      },
      accept: ['.pdf'],
      rules: [{ required: true, message: 'Dokumen harus diisi' }]
    },
    {
      label: `Status ${Modul.LEGAL_PRODUCTS}`,
      name: 'status',
      type: InputType.SELECT,
      picker: 'select',
      rules: [
        {
          required: true,
          message: `Status ${Modul.LEGAL_PRODUCTS} harus diisi`
        }
      ],
      options: [
        {
          label: 'Aktif',
          value: 'aktif'
        },
        {
          label: 'Non-Aktif',
          value: 'nonaktif'
        }
      ]
    }
  ];

  return (
    <div>
      {getAllLegalProducts.isLoading ? (
        <DataLoader type="datatable" />
      ) : (
        <Card>
          <div className="mb-6 flex items-center justify-between">
            <Typography.Title level={5}>Data {Modul.LEGAL_PRODUCTS}</Typography.Title>
            <div className="inline-flex items-center gap-2">
              <Button
                variant="outlined"
                color="danger"
                disabled={selectedData.length <= 0}
                icon={<DeleteOutlined />}
                onClick={() => {
                  modal.delete.batch({
                    title: `Hapus ${selectedData.length} ${Modul.LEGAL_PRODUCTS} Yang Dipilih ? `,
                    formFields: formFields,
                    onSubmit: async () => {
                      const ids = selectedData.map((item) => item.id);
                      const { message, isSuccess } = await deleteBatchLegalProducts.execute(ids, token);
                      if (isSuccess) {
                        success('Berhasil', message);
                        fetchLegalProducts(token);
                      } else {
                        error('Gagal', message);
                      }
                      return isSuccess;
                    }
                  });
                }}
              >
                {Modul.LEGAL_PRODUCTS}
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  modal.create({
                    title: `Tambah ${Modul.LEGAL_PRODUCTS}`,
                    formFields: formFields,
                    onSubmit: async (values) => {
                      const { message, isSuccess } = await storeLegalProducts.execute({ ...values, assignment_date: dateFormatter(values.assignment_date), year: dateFormatter(values.year, 'year') }, token, values.document.file);
                      if (isSuccess) {
                        success('Berhasil', message);
                        fetchLegalProducts(token);
                      } else {
                        error('Gagal', message);
                      }
                      return isSuccess;
                    }
                  });
                }}
              >
                {Modul.LEGAL_PRODUCTS}
              </Button>
            </div>
          </div>
          <div className="w-full max-w-full overflow-x-auto">
            <DataTable data={legalProducts} columns={Column} loading={getAllLegalProducts.isLoading} map={(legalProducts) => ({ key: legalProducts.id, ...legalProducts })} handleSelectedData={(_, selectedRows) => setSelectedData(selectedRows)} />
          </div>
        </Card>
      )}
    </div>
  );
};

export default LegalProducts;
