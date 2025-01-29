import { DataLoader, DataTable } from '@/components';
import { InputType } from '@/constants';
import Modul from '@/constants/Modul';
import { useAuth, useCrudModal, useNotification, useService } from '@/hooks';
import { VisiMisiService } from '@/services';
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Space, Typography } from 'antd';
import { useEffect, useState } from 'react';

const VisiMisi = () => {
  const { token } = useAuth();
  const { success, error } = useNotification();
  const { execute: fetchVisiMisi, ...getAllVisiMisi } = useService(VisiMisiService.getAll);
  const storeVisiMisi = useService(VisiMisiService.store);
  const updateVisiMisi = useService(VisiMisiService.update);
  const deleteVisiMisi = useService(VisiMisiService.delete);
  const deleteBatchVisiMisi = useService(VisiMisiService.deleteBatch);
  const [selectedData, setSelectedData] = useState([]);

  const modal = useCrudModal();

  useEffect(() => {
    fetchVisiMisi(token);
  }, [fetchVisiMisi, token]);

  const visiMisi = getAllVisiMisi.data ?? [];

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
                  const { message, isSuccess } = await updateVisiMisi.execute(record.id, { ...values, _method: 'PUT' }, token);
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
                  const { isSuccess, message } = await deleteVisiMisi.execute(record.id, token);
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

  const formFields = [
    {
      label: `Konten ${Modul.VISI_MISI}`,
      name: 'content',
      type: InputType.LONGTEXT,
      rules: [
        {
          required: true,
          message: `Konten ${Modul.VISI_MISI} harus diisi`
        }
      ]
    },
    {
      label: `Tipe ${Modul.VISI_MISI}`,
      name: 'type',
      type: InputType.SELECT,
      rules: [
        {
          required: true,
          message: `Tipe ${Modul.VISI_MISI} harus diisi`
        }
      ],
      options: [
        {
          label: 'Visi',
          value: 'visi'
        },
        {
          label: 'Misi',
          value: 'misi'
        }
      ]
    }
  ];

  return (
    <div>
      {getAllVisiMisi.isLoading ? (
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
                      const { message, isSuccess } = await deleteBatchVisiMisi.execute(ids, token);
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
                      const { message, isSuccess } = await storeVisiMisi.execute(values, token);
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
            <DataTable data={visiMisi} columns={Column} loading={getAllVisiMisi.isLoading} map={(category) => ({ key: category.id, ...category })} handleSelectedData={(_, selectedRows) => setSelectedData(selectedRows)} />
          </div>
        </Card>
      )}
    </div>
  );
};

export default VisiMisi;
