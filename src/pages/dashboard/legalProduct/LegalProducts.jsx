import { DataTable, DataTableHeader } from '@/components';
import Modul from '@/constants/Modul';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import { LegalProductsService } from '@/services';
import dateFormatter from '@/utils/dateFormatter';
import { DownloadOutlined } from '@ant-design/icons';
import { Button, Card, Space, Tag } from 'antd';
import dayjs from 'dayjs';
import { useCallback, useEffect, useState } from 'react';
import { formFields, legalProductsFilterFields } from './FormFields';
import { Delete, Detail, Edit } from '@/components/dashboard/button';
import { Action } from '@/constants';
import { LegalProducts as legalProductsModel } from '@/models';

const { DELETE, UPDATE, READ } = Action;

const LegalProducts = () => {
  const { token, user } = useAuth();
  const { success, error } = useNotification();
  const { execute, ...getAllLegalProducts } = useService(LegalProductsService.getAll);
  const storeLegalProducts = useService(LegalProductsService.store);
  const updateLegalProducts = useService(LegalProductsService.update);
  const deleteLegalProducts = useService(LegalProductsService.delete);
  const deleteBatchLegalProducts = useService(LegalProductsService.deleteBatch);
  const [selectedData, setSelectedData] = useState([]);
  const pagination = usePagination({ totalData: getAllLegalProducts.totalData });
  const modal = useCrudModal();
  const [filterValues, setFilterValues] = useState({ search: '', tahun: null, status: null });

  const fetchLegalProducts = useCallback(() => {
    execute({
      token: token,
      page: pagination.page,
      per_page: pagination.per_page,
      search: filterValues.search,
      tahun: filterValues.tahun ? dateFormatter(filterValues.tahun, 'year') : '',
      status: filterValues.status
    });
  }, [execute, filterValues.search, filterValues.status, filterValues.tahun, pagination.page, pagination.per_page, token]);

  useEffect(() => {
    fetchLegalProducts();
  }, [fetchLegalProducts]);

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
            return <Tag color="error">{record.status}</Tag>;
        }
      }
    }
  ];

  if (user && user.eitherCan([UPDATE, legalProductsModel], [DELETE, legalProductsModel], [READ, legalProductsModel])) {
    Column.push({
      title: 'Aksi',
      render: (_, record) => (
        <Space size="small">
          <Edit
            title={`Edit ${Modul.LEGAL_PRODUCTS}`}
            model={legalProductsModel}
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
                    fetchLegalProducts({ token: token, page: pagination.page, per_page: pagination.per_page });
                  } else {
                    error('Gagal', message);
                  }
                  return isSuccess;
                }
              });
            }}
          />
          <Detail
            title={`Detail ${Modul.LEGAL_PRODUCTS}`}
            model={legalProductsModel}
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
          <Delete
            title={`Delete ${Modul.LEGAL_PRODUCTS}`}
            model={legalProductsModel}
            onClick={() => {
              modal.delete.default({
                title: `Delete ${Modul.LEGAL_PRODUCTS}`,
                data: { ...record, assignment_date: dayjs(record.assignment_date), year: dayjs(record.year) },
                formFields: formFields,
                onSubmit: async () => {
                  const { isSuccess, message } = await deleteLegalProducts.execute(record.id, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchLegalProducts({ token: token, page: pagination.page, per_page: pagination.per_page });
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
    });
  }

  const onDeleteBatch = () => {
    modal.delete.batch({
      title: `Hapus ${selectedData.length} ${Modul.LEGAL_PRODUCTS} Yang Dipilih ? `,
      formFields: formFields,
      onSubmit: async () => {
        const ids = selectedData.map((item) => item.id);
        const { message, isSuccess } = await deleteBatchLegalProducts.execute(ids, token);
        if (isSuccess) {
          success('Berhasil', message);
          fetchLegalProducts({ token: token, page: pagination.page, per_page: pagination.per_page });
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  const onCreate = () => {
    modal.create({
      title: `Tambah ${Modul.LEGAL_PRODUCTS}`,
      formFields: formFields,
      onSubmit: async (values) => {
        const { message, isSuccess } = await storeLegalProducts.execute({ ...values, assignment_date: dateFormatter(values.assignment_date), year: dateFormatter(values.year, 'year') }, token, values.document.file);
        if (isSuccess) {
          success('Berhasil', message);
          fetchLegalProducts({ token: token, page: pagination.page, per_page: pagination.per_page });
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  const filter = {
    formFields: legalProductsFilterFields(),
    initialData: {
      tahun: filterValues.tahun,
      status: filterValues.status
    },
    isLoading: getAllLegalProducts.isLoading,
    onSubmit: (values) => {
      setFilterValues({
        tahun: values.tahun ? dayjs(values.tahun) : null,
        status: values.status
      });
    }
  };

  return (
    <div>
      <Card>
        <DataTableHeader
          filter={filter}
          onSearch={(values) => setFilterValues({ ...filterValues, search: values })}
          model={legalProductsModel}
          modul={Modul.LEGAL_PRODUCTS}
          onStore={onCreate}
          onDeleteBatch={onDeleteBatch}
          selectedData={selectedData}
        />
        <div className="w-full max-w-full overflow-x-auto">
          <DataTable
            data={legalProducts}
            columns={Column}
            pagination={pagination}
            loading={getAllLegalProducts.isLoading}
            map={(legalProducts) => ({ key: legalProducts.id, ...legalProducts })}
            handleSelectedData={(_, selectedRows) => setSelectedData(selectedRows)}
          />
        </div>
      </Card>
    </div>
  );
};

export default LegalProducts;
