import { DataLoader, DataTable } from '@/components';
import Modul from '@/constants/Modul';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import { HamletService } from '@/services';
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Space, Typography } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { formFields } from './FormFields';

const Hamlet = () => {
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

  const hamletService = useCrudService(HamletService);

  const fetchHamlets = useFetchData(hamletService.fetch, hamletService.pagination);

  useEffect(() => {
    fetchHamlets();
  }, [fetchHamlets]);

  const hamlets = hamletService.getAll.data ?? [];
  const [selectedData, setSelectedData] = useState([]);

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
    },
    {
      title: 'Aksi',
      render: (_, record) => (
        <Space size="small">
          <Button
            icon={<EditOutlined />}
            variant="outlined"
            color="primary"
            onClick={() => {
              modal.edit({
                title: `Edit ${Modul.HAMLET}`,
                data: record,
                formFields: formFields,
                onSubmit: async (values) => {
                  const { message, isSuccess } = await hamletService.update.execute(record.id, { ...values, _method: 'PUT' }, token, values.administrative_area.file);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchHamlets(token);
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
          <Button
            icon={<DeleteOutlined />}
            variant="outlined"
            color="danger"
            onClick={() => {
              modal.delete.default({
                title: `Delete ${Modul.HAMLET}`,
                data: record,
                formFields: formFields,
                onSubmit: async () => {
                  const { isSuccess, message } = await hamletService.delete.execute(record.id, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchHamlets(token);
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
      {hamletService.getAll.isLoading ? (
        <DataLoader type="datatable" />
      ) : (
        <Card>
          <div className="mb-6 flex items-center justify-between">
            <Typography.Title level={5}>Data {Modul.HAMLET}</Typography.Title>
            <div className="inline-flex items-center gap-2">
              <Button
                variant="outlined"
                color="danger"
                disabled={selectedData.length <= 0}
                icon={<DeleteOutlined />}
                onClick={() => {
                  modal.delete.batch({
                    title: `Hapus ${selectedData.length} ${Modul.HAMLET} Yang Dipilih ? `,
                    formFields: formFields,
                    onSubmit: async () => {
                      const ids = selectedData.map((item) => item.id);
                      const { message, isSuccess } = await hamletService.deleteBatch.execute(ids, token);
                      if (isSuccess) {
                        success('Berhasil', message);
                        fetchHamlets(token);
                      } else {
                        error('Gagal', message);
                      }
                      return isSuccess;
                    }
                  });
                }}
              >
                {Modul.HAMLET}
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  modal.create({
                    title: `Tambah ${Modul.HAMLET}`,
                    formFields: formFields,
                    onSubmit: async (values) => {
                      const { message, isSuccess } = await hamletService.store.execute(values, token, values.administrative_area.file);
                      if (isSuccess) {
                        success('Berhasil', message);
                        fetchHamlets(token);
                      } else {
                        error('Gagal', message);
                      }
                      return isSuccess;
                    }
                  });
                }}
              >
                {Modul.HAMLET}
              </Button>
            </div>
          </div>
          <div className="w-full max-w-full overflow-x-auto">
            <DataTable
              data={hamlets}
              columns={Column}
              loading={hamletService.getAll.isLoading}
              map={(hamlet) => ({ key: hamlet.id, ...hamlet })}
              handleSelectedData={(_, selectedRows) => setSelectedData(selectedRows)}
              pagination={hamletService.pagination}
            />
          </div>
        </Card>
      )}
    </div>
  );
};

export default Hamlet;
