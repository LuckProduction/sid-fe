import { DataTable, DataTableHeader } from '@/components';
import Modul from '@/constants/Modul';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import { EmploymentService } from '@/services';
import { Card, Space } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { formFields } from './FormFields';
import { Action } from '@/constants';
import { Delete, Detail, Edit } from '@/components/dashboard/button';
import { Employment as EmploymentModel } from '@/models';

const { DELETE, UPDATE, READ } = Action;

const Employment = () => {
  const { token, user } = useAuth();
  const { success, error } = useNotification();
  const { execute, ...getAllEmployments } = useService(EmploymentService.getAll);
  const storeEmployment = useService(EmploymentService.store);
  const updateEmployment = useService(EmploymentService.update);
  const deleteEmployment = useService(EmploymentService.delete);
  const deleteBatchEmnployment = useService(EmploymentService.deleteBatch);
  const [selectedData, setSelectedData] = useState([]);
  const modal = useCrudModal();
  const [filterValues, setFilterValues] = useState({ search: '' });

  const pagination = usePagination({ totalData: getAllEmployments.totalData });

  const fetchEmployments = useCallback(() => {
    execute({
      token: token,
      page: pagination.page,
      per_page: pagination.per_page,
      search: filterValues.search
    });
  }, [execute, filterValues.search, pagination.page, pagination.per_page, token]);

  useEffect(() => {
    fetchEmployments();
  }, [fetchEmployments]);

  const employments = getAllEmployments.data ?? [];

  const Column = [
    {
      title: 'Nama Jabatan',
      dataIndex: 'employment_name',
      sorter: (a, b) => a.employment_name.length - b.employment_name.length,
      searchable: true
    },
    {
      title: 'Kode Jabatan',
      dataIndex: 'employment_code',
      sorter: (a, b) => a.employment_code.length - b.employment_code.length,
      searchable: true
    },
    {
      title: 'Golongan',
      dataIndex: 'faction',
      sorter: (a, b) => a.faction.length - b.faction.length,
      searchable: true
    }
  ];

  if (user && user.eitherCan([UPDATE, EmploymentModel], [DELETE, EmploymentModel], [READ, EmploymentModel])) {
    Column.push({
      title: 'Aksi',
      render: (_, record) => (
        <Space size="small">
          <Edit
            title={`Edit ${Modul.EMPLOYMENT}`}
            model={EmploymentModel}
            onClick={() => {
              modal.edit({
                title: `Edit ${Modul.EMPLOYMENT}`,
                data: record,
                formFields: formFields,
                onSubmit: async (values) => {
                  const { message, isSuccess } = await updateEmployment.execute(record.id, values, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchEmployments({ token: token, page: pagination.page, per_page: pagination.per_page });
                  } else {
                    error('Gagal', message);
                  }
                  return isSuccess;
                }
              });
            }}
          />
          <Detail
            title={`Detail ${Modul.EMPLOYMENT}`}
            model={EmploymentModel}
            onClick={() => {
              modal.show.description({
                title: record.employment_name,
                data: [
                  {
                    key: 'employment_name',
                    label: `Nama ${Modul.EMPLOYMENT}`,
                    children: record.employment_name
                  },
                  {
                    key: 'employment_code',
                    label: `Kode ${Modul.EMPLOYMENT}`,
                    children: record.employment_code
                  },
                  {
                    key: 'faction',
                    label: `Golongan ${Modul.EMPLOYMENT}`,
                    children: record.faction
                  },
                  {
                    key: 'employment_duties',
                    label: `Tupoksi ${Modul.EMPLOYMENT}`,
                    children: record.employment_duties
                  }
                ]
              });
            }}
          />
          <Delete
            title={`Delete ${Modul.EMPLOYMENT}`}
            model={EmploymentModel}
            onClick={() => {
              modal.delete.default({
                title: `Delete ${Modul.EMPLOYMENT}`,
                data: record,
                formFields: formFields,
                onSubmit: async () => {
                  const { isSuccess, message } = await deleteEmployment.execute(record.id, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchEmployments({ token: token, page: pagination.page, per_page: pagination.per_page });
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
      title: `Hapus ${selectedData.length} ${Modul.EMPLOYMENT} Yang Dipilih ? `,
      formFields: formFields,
      onSubmit: async () => {
        const ids = selectedData.map((item) => item.id);
        const { message, isSuccess } = await deleteBatchEmnployment.execute(ids, token);
        if (isSuccess) {
          success('Berhasil', message);
          fetchEmployments({ token: token, page: pagination.page, per_page: pagination.per_page });
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  const onCreate = () => {
    modal.create({
      title: `Tambah ${Modul.EMPLOYMENT}`,
      formFields: formFields,
      onSubmit: async (values) => {
        const { message, isSuccess } = await storeEmployment.execute(values, token);
        if (isSuccess) {
          success('Berhasil', message);
          fetchEmployments({ token: token, page: pagination.page, per_page: pagination.per_page });
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  return (
    <div>
      <Card>
        <DataTableHeader model={EmploymentModel} modul={Modul.EMPLOYMENT} onStore={onCreate} onDeleteBatch={onDeleteBatch} selectedData={selectedData} onSearch={(values) => setFilterValues({ search: values })} />
        <div className="w-full max-w-full overflow-x-auto">
          <DataTable pagination={pagination} data={employments} columns={Column} loading={getAllEmployments.isLoading} map={(category) => ({ key: category.id, ...category })} handleSelectedData={(_, selectedRows) => setSelectedData(selectedRows)} />
        </div>
      </Card>
    </div>
  );
};

export default Employment;
