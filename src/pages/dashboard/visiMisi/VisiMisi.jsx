import { DataTable, DataTableHeader } from '@/components';
import Modul from '@/constants/Modul';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import { VisiMisiService } from '@/services';
import { Card, Space } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { formFields } from './FormFields';
import { Action } from '@/constants';
import { VisiMisi as VisiMisiModel } from '@/models';
import { Delete, Detail, Edit } from '@/components/dashboard/button';

const { DELETE, UPDATE, READ } = Action;
const VisiMisi = () => {
  const { token, user } = useAuth();
  const { success, error } = useNotification();
  const modal = useCrudModal();
  const useCrudService = (service) => {
    const { execute: fetch, ...getAll } = useService(service.getAll);
    return {
      fetch,
      store: useService(service.store),
      update: useService(service.update),
      delete: useService(service.delete),
      deleteBatch: useService(service.deleteBatch),
      getAll,
      pagination: usePagination({ totalData: getAll.totalData }),
      selected: useState([])
    };
  };

  const useFetchData = (fetchFn, pagination) => {
    return useCallback(() => {
      fetchFn({ token: token, page: pagination.page, per_page: pagination.per_page });
    }, [fetchFn, pagination.page, pagination.per_page]);
  };

  const visiMisiService = useCrudService(VisiMisiService);

  const fetchVisiMisi = useFetchData(visiMisiService.fetch, visiMisiService.pagination);

  useEffect(() => {
    fetchVisiMisi();
  }, [fetchVisiMisi]);

  const visiMisi = visiMisiService.getAll.data ?? [];
  const [selectedData, setSelectedData] = useState([]);

  const Column = [
    {
      title: 'Tipe',
      dataIndex: 'type',
      sorter: (a, b) => a.type.length - b.type.length,
      searchable: true
    },
    {
      title: 'Konten',
      dataIndex: 'content',
      sorter: (a, b) => a.content.length - b.content.length,
      searchable: true
    }
  ];

  if (user && user.eitherCan([UPDATE, VisiMisiModel], [DELETE, VisiMisiModel], [READ, VisiMisiModel])) {
    Column.push({
      title: 'Aksi',
      render: (_, record) => (
        <Space size="small">
          <Edit
            title={`Edit ${Modul.VISI_MISI}`}
            model={VisiMisiModel}
            onClick={() => {
              modal.edit({
                title: `Edit ${Modul.VISI_MISI}`,
                data: record,
                formFields: formFields,
                onSubmit: async (values) => {
                  const { message, isSuccess } = await visiMisiService.update.execute(record.id, { ...values, _method: 'PUT' }, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchVisiMisi(token);
                  } else {
                    error('Gagal', message);
                  }
                  return isSuccess;
                }
              });
            }}
          />
          <Detail
            title={`Detail ${Modul.VISI_MISI}`}
            model={VisiMisiModel}
            onClick={() => {
              modal.show.description({
                title: record.type,
                data: [
                  {
                    key: 'content',
                    label: `Konten ${Modul.VISI_MISI}`,
                    children: record.content
                  },
                  {
                    key: 'type',
                    label: `Tipe ${Modul.VISI_MISI}`,
                    children: record.type
                  }
                ]
              });
            }}
          />
          <Delete
            title={`Delete ${Modul.VISI_MISI}`}
            model={VisiMisiModel}
            onClick={() => {
              modal.delete.default({
                title: `Delete ${Modul.VISI_MISI}`,
                data: record,
                formFields: formFields,
                onSubmit: async () => {
                  const { isSuccess, message } = await visiMisiService.delete.execute(record.id, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchVisiMisi(token);
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
      title: `Hapus ${selectedData.length} ${Modul.VISI_MISI} Yang Dipilih ? `,
      formFields: formFields,
      onSubmit: async () => {
        const ids = selectedData.map((item) => item.id);
        const { message, isSuccess } = await visiMisiService.deleteBatch.execute(ids, token);
        if (isSuccess) {
          success('Berhasil', message);
          fetchVisiMisi(token);
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  const onCreate = () => {
    modal.create({
      title: `Tambah ${Modul.VISI_MISI}`,
      formFields: formFields,
      onSubmit: async (values) => {
        const { message, isSuccess } = await visiMisiService.store.execute(values, token);
        if (isSuccess) {
          success('Berhasil', message);
          fetchVisiMisi(token);
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
        <DataTableHeader model={VisiMisiModel} modul={Modul.VISI_MISI} onStore={onCreate} onDeleteBatch={onDeleteBatch} selectedData={selectedData} />
        <div className="w-full max-w-full overflow-x-auto">
          <DataTable
            data={visiMisi}
            columns={Column}
            loading={visiMisiService.getAll.isLoading}
            map={(category) => ({ key: category.id, ...category })}
            handleSelectedData={(_, selectedRows) => setSelectedData(selectedRows)}
            pagination={visiMisiService.pagination}
          />
        </div>
      </Card>
    </div>
  );
};

export default VisiMisi;
