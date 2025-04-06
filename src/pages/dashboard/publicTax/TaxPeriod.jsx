import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import { TaxPeriodService } from '@/services';
import dateFormatter from '@/utils/dateFormatter';
import { Button, Card, Space, Tag } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import Modul from '@/constants/Modul';
import { DataTable, DataTableHeader } from '@/components';
import dayjs from 'dayjs';
import { taxPeriodFilterFields, taxPeriodFormFields } from './FormFields';
import { TaxPeriod as TaxPeriodModel } from '@/models';
import { Action } from '@/constants';
import { Delete, Detail, Edit } from '@/components/dashboard/button';
import { DatabaseOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { DELETE, UPDATE, READ } = Action;

const TaxPeriod = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const { success, error } = useNotification();
  const { execute, ...getAllTaxPeriods } = useService(TaxPeriodService.getAll);
  const storeTaxPeriods = useService(TaxPeriodService.store);
  const updateTaxPeriods = useService(TaxPeriodService.update);
  const deleteTaxPeriods = useService(TaxPeriodService.delete);
  const deleteBatchTaxPeriods = useService(TaxPeriodService.deleteBatch);
  const [selectedData, setSelectedData] = useState([]);
  const pagination = usePagination({ totalData: getAllTaxPeriods.totalData });
  const modal = useCrudModal();
  const [filterValues, setFilterValues] = useState({ search: '', tahun: null, status: null });

  const fetchTaxPeriod = useCallback(() => {
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
    fetchTaxPeriod();
  }, [fetchTaxPeriod]);

  const taxPeriods = getAllTaxPeriods.data ?? [];

  const Column = [
    {
      title: 'Nama Pajak',
      dataIndex: 'tax_name',
      sorter: (a, b) => a.tax_name.length - b.tax_name.length,
      searchable: true
    },
    {
      title: 'Tahun Periode Pajak',
      dataIndex: 'year',
      sorter: (a, b) => a.year.length - b.year.length,
      searchable: true
    },
    {
      title: 'Tanggal Mulai',
      dataIndex: 'date_start',
      sorter: (a, b) => a.date_start.length - b.date_start.length,
      searchable: true
    },
    {
      title: 'Tanggal Berakhir',
      dataIndex: 'date_end',
      sorter: (a, b) => a.date_end.length - b.date_end.length,
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
    }
  ];

  if (user && user.eitherCan([UPDATE, TaxPeriodModel], [DELETE, TaxPeriodModel], [READ, TaxPeriodModel])) {
    Column.push({
      title: 'Aksi',
      render: (_, record) => (
        <Space size="small">
          <Edit
            title={`Edit ${Modul.TAX}`}
            model={TaxPeriodModel}
            onClick={() => {
              modal.edit({
                title: `Edit ${Modul.TAX}`,
                data: { ...record, date_start: dayjs(record.date_start), date_end: dayjs(record.date_end), year: dayjs(record.year) },
                formFields: taxPeriodFormFields,
                onSubmit: async (values) => {
                  const { message, isSuccess } = await updateTaxPeriods.execute(
                    record.id,
                    {
                      ...values,
                      date_start: dateFormatter(values.date_start),
                      date_end: dateFormatter(values.date_end),
                      year: dateFormatter(values.year, 'year')
                    },
                    token
                  );
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchTaxPeriod({ token: token, page: pagination.page, per_page: pagination.per_page });
                  } else {
                    error('Gagal', message);
                  }
                  return isSuccess;
                }
              });
            }}
          />
          <Detail
            title={`Detail ${Modul.TAX}`}
            model={TaxPeriodModel}
            onClick={() => {
              modal.show.description({
                title: record.tax_name,
                data: [
                  {
                    key: 'taxt_name',
                    label: `Nama ${Modul.TAX}`,
                    children: record.tax_name
                  },
                  {
                    key: 'year',
                    label: `Tahun Periode Pajak`,
                    children: record.year
                  },
                  {
                    key: 'date_start',
                    label: `Tanggal Mulai Periode Pajak`,
                    children: record.date_start
                  },
                  {
                    key: 'date_end',
                    label: `Tanggal Berakhir Periode Pajak`,
                    children: record.date_end
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
          <Delete
            title={`Delete ${Modul.TAX}`}
            model={TaxPeriodModel}
            onClick={() => {
              modal.delete.default({
                title: `Delete ${Modul.TAX}`,
                onSubmit: async () => {
                  const { isSuccess, message } = await deleteTaxPeriods.execute(record.id, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchTaxPeriod({ token: token, page: pagination.page, per_page: pagination.per_page });
                  } else {
                    error('Gagal', message);
                  }
                  return isSuccess;
                }
              });
            }}
          />
          <Button icon={<DatabaseOutlined />} variant="solid" color="geekblue" onClick={() => navigate(window.location.pathname + `/public_tax/${record.id}`)} />
        </Space>
      )
    });
  }

  const onDeleteBatch = () => {
    modal.delete.batch({
      title: `Hapus ${selectedData.length} ${Modul.TAX} Yang Dipilih ? `,
      onSubmit: async () => {
        const ids = selectedData.map((item) => item.id);
        const { message, isSuccess } = await deleteBatchTaxPeriods.execute(ids, token);
        if (isSuccess) {
          success('Berhasil', message);
          fetchTaxPeriod({ token: token, page: pagination.page, per_page: pagination.per_page });
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  const onCreate = () => {
    modal.create({
      title: `Tambah ${Modul.TAX}`,
      formFields: taxPeriodFormFields,
      onSubmit: async (values) => {
        const { message, isSuccess } = await storeTaxPeriods.execute(
          {
            ...values,
            date_start: dateFormatter(values.date_start),
            date_end: dateFormatter(values.date_end),
            year: dateFormatter(values.year, 'year')
          },
          token
        );
        if (isSuccess) {
          success('Berhasil', message);
          fetchTaxPeriod({ token: token, page: pagination.page, per_page: pagination.per_page });
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  const filter = {
    formFields: taxPeriodFilterFields(),
    initialData: {
      tahun: filterValues.tahun,
      status: filterValues.status
    },
    isLoading: getAllTaxPeriods.isLoading,
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
        <DataTableHeader filter={filter} onSearch={(values) => setFilterValues({ ...filterValues, search: values })} model={TaxPeriodModel} modul={Modul.TAX} onStore={onCreate} onDeleteBatch={onDeleteBatch} selectedData={selectedData} />
        <div className="w-full max-w-full overflow-x-auto">
          <DataTable
            data={taxPeriods}
            columns={Column}
            pagination={pagination}
            loading={getAllTaxPeriods.isLoading}
            map={(legalProducts) => ({ key: legalProducts.id, ...legalProducts })}
            handleSelectedData={(_, selectedRows) => setSelectedData(selectedRows)}
          />
        </div>
      </Card>
    </div>
  );
};

export default TaxPeriod;
