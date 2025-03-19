import { DataTable, DataTableHeader } from '@/components';
import Modul from '@/constants/Modul';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import { HamletService } from '@/services';
import { Card, Space } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { formFields } from './FormFields';
import { Action } from '@/constants';
import { Hamlet as HamletModel } from '@/models';
import { Delete, Detail, Edit } from '@/components/dashboard/button';

const { UPDATE, READ, DELETE } = Action;

const Hamlet = () => {
  const { token, user } = useAuth();
  const { success, error } = useNotification();
  const modal = useCrudModal();
  const { execute, ...getAllHamlets } = useService(HamletService.getAll);
  const storeHamlet = useService(HamletService.store);
  const updateHamlet = useService(HamletService.update);
  const deleteHamlet = useService(HamletService.delete);
  const deleteBatchHamlet = useService(HamletService.deleteBatch);
  const [selectedData, setSelectedData] = useState([]);
  const [filterValues, setFilterValues] = useState({ search: '' });
  const pagination = usePagination({ totalData: getAllHamlets.totalData });

  const fetchHamlet = useCallback(() => {
    execute({
      token: token,
      page: pagination.page,
      per_page: pagination.per_page,
      search: filterValues.search
    });
  }, [execute, filterValues.search, pagination.page, pagination.per_page, token]);

  useEffect(() => {
    fetchHamlet();
  }, [fetchHamlet, token]);

  const hamlets = getAllHamlets.data ?? [];

  const Column = [
    {
      title: 'Nama Dusun',
      dataIndex: 'hamlet_name',
      sorter: (a, b) => a.hamlet_name.length - b.hamlet_name.length,
      searchable: true
    },
    {
      title: 'Nama Kepala Dusun',
      dataIndex: 'head_hamlet_name',
      sorter: (a, b) => a.head_hamlet_name.length - b.head_hamlet_name.length,
      searchable: true
    }
  ];

  if (user && user.eitherCan([UPDATE, HamletModel], [DELETE, HamletModel], [READ, HamletModel])) {
    Column.push({
      title: 'Aksi',
      render: (_, record) => (
        <Space size="small">
          <Edit
            model={HamletModel}
            title={`Edit ${Modul.HAMLET}`}
            onClick={() => {
              modal.edit({
                title: `Edit ${Modul.HAMLET}`,
                data: record,
                formFields: formFields,
                onSubmit: async (values) => {
                  const { message, isSuccess } = await updateHamlet.execute(record.id, { ...values, _method: 'PUT' }, token, values.administrative_area?.file ?? undefined);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchHamlet({ token: token, page: pagination.page, per_page: pagination.per_page });
                  } else {
                    error('Gagal', message);
                  }
                  return isSuccess;
                }
              });
            }}
          />
          <Detail
            model={HamletModel}
            title={`Detail ${Modul.HAMLET}`}
            onClick={() => {
              modal.show.description({
                title: record.hamlet_name,
                data: [
                  {
                    key: 'hamlet_name',
                    label: `Nama ${Modul.HAMLET}`,
                    children: record.hamlet_name
                  },
                  {
                    key: 'head_hamlet_name',
                    label: `Nama Kepala ${Modul.HAMLET}`,
                    children: record.head_hamlet_name
                  },
                  {
                    key: 'head_hamlet_nik',
                    label: `NIK Kepala ${Modul.HAMLET}`,
                    children: record.head_hamlet_nik
                  }
                ]
              });
            }}
          />
          <Delete
            model={HamletModel}
            title={`Delete ${Modul.HAMLET}`}
            onClick={() => {
              modal.delete.default({
                title: `Delete ${Modul.HAMLET}`,
                data: record,
                onSubmit: async () => {
                  const { isSuccess, message } = await deleteHamlet.execute(record.id, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchHamlet({ token: token, page: pagination.page, per_page: pagination.per_page });
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
      title: `Hapus ${selectedData.length} ${Modul.HAMLET} Yang Dipilih ? `,
      formFields: formFields,
      onSubmit: async () => {
        const ids = selectedData.map((item) => item.id);
        const { message, isSuccess } = await deleteBatchHamlet.execute(ids, token);
        if (isSuccess) {
          success('Berhasil', message);
          fetchHamlet({ token: token, page: pagination.page, per_page: pagination.per_page });
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  const onCreate = () => {
    modal.create({
      title: `Tambah ${Modul.HAMLET}`,
      formFields: formFields,
      onSubmit: async (values) => {
        const { message, isSuccess } = await storeHamlet.execute(values, token, values.administrative_area?.file ?? null);
        if (isSuccess) {
          success('Berhasil', message);
          fetchHamlet({ token: token, page: pagination.page, per_page: pagination.per_page });
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  return (
    <Card>
      <DataTableHeader model={HamletModel} modul={Modul.HAMLET} onDeleteBatch={onDeleteBatch} onStore={onCreate} selectedData={selectedData} onSearch={(values) => setFilterValues({ ...filterValues, search: values })} />
      <div className="w-full max-w-full overflow-x-auto">
        <DataTable data={hamlets} columns={Column} loading={getAllHamlets.isLoading} map={(hamlet) => ({ key: hamlet.id, ...hamlet })} handleSelectedData={(_, selectedRows) => setSelectedData(selectedRows)} pagination={pagination} />
      </div>
    </Card>
  );
};

export default Hamlet;
