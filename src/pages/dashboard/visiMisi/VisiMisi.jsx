import { DataLoader, DataTable } from '@/components';
import Modul from '@/constants/Modul';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import { VisiMisiService } from '@/services';
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Space, Typography } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { formFields } from './FormFields';

const VisiMisi = () => {
  const { token } = useAuth();
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
      fetchFn(token, pagination.page, pagination.perPage);
    }, [fetchFn, pagination.page, pagination.perPage]);
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
          <Button
            icon={<EyeOutlined />}
            variant="outlined"
            color="green"
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
          <Button
            icon={<DeleteOutlined />}
            variant="outlined"
            color="danger"
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
    }
  ];

  return (
    <div>
      {visiMisiService.getAll.isLoading ? (
        <DataLoader type="datatable" />
      ) : (
        <Card>
          <div className="mb-6 flex items-center justify-between">
            <Typography.Title level={5}>Data {Modul.VISI_MISI}</Typography.Title>
            <div className="inline-flex items-center gap-2">
              <Button
                variant="outlined"
                color="danger"
                disabled={selectedData.length <= 0}
                icon={<DeleteOutlined />}
                onClick={() => {
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
                }}
              >
                {Modul.VISI_MISI}
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
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
                }}
              >
                {Modul.VISI_MISI}
              </Button>
            </div>
          </div>
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
      )}
    </div>
  );
};

export default VisiMisi;
