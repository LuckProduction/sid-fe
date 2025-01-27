import { DataLoader, DataTable } from '@/components';
import { InputType } from '@/constants';
import Modul from '@/constants/Modul';
import { useAuth, useCrudModal, useNotification, useService } from '@/hooks';
import { HamletService } from '@/services';
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Space, Typography } from 'antd';
import { useEffect, useState } from 'react';

const Hamlet = () => {
  const { token } = useAuth();
  const { success, error } = useNotification();
  const { execute: fetchHamlets, ...getAllHamlets } = useService(HamletService.getAll);
  const storeVillageOfficials = useService(HamletService.store);
  const updateVillageOfficials = useService(HamletService.update);
  const deleteVillageOfficials = useService(HamletService.delete);
  const deleteBatchVillageOfficials = useService(HamletService.deleteBatch);
  const [selectedData, setSelectedData] = useState([]);

  const modal = useCrudModal();

  useEffect(() => {
    fetchHamlets(token);
  }, [fetchHamlets, token]);

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
                title: `Edit ${Modul.HAMLET}`,
                data: record,
                formFields: formFields,
                onSubmit: async (values) => {
                  const { message, isSuccess } = await updateVillageOfficials.execute(record.id, { ...values, _method: 'PUT' }, token, values.administrative_area.file);
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
                  const { isSuccess, message } = await deleteVillageOfficials.execute(record.id, token);
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

  const formFields = [
    {
      label: `Nama ${Modul.HAMLET}`,
      name: 'hamlet_name',
      type: InputType.TEXT,
      rules: [
        {
          required: true,
          message: `Nama ${Modul.HAMLET} harus diisi`
        }
      ]
    },
    {
      label: `Nama Kepala ${Modul.HAMLET}`,
      name: 'head_hamlet_name',
      type: InputType.TEXT,
      rules: [
        {
          required: true,
          message: `Nama Kepala ${Modul.HAMLET} harus diisi`
        }
      ]
    },
    {
      label: `Nik Kepala ${Modul.HAMLET}`,
      name: 'head_hamlet_nik',
      type: InputType.TEXT,
      rules: [
        {
          required: true,
          message: `Nik Kepala ${Modul.HAMLET} harus diisi`
        },
        {
          validator: (_, value) => {
            if (!value) {
              return Promise.resolve();
            }
            if (!/^\d+$/.test(value)) {
              return Promise.reject(`Nik Kepala ${Modul.HAMLET} harus berupa angka`);
            }
            return Promise.resolve();
          }
        }
      ]
    },
    {
      label: `File Batas ${Modul.HAMLET}`,
      name: 'administrative_area',
      type: InputType.UPLOAD,
      max: 1,
      beforeUpload: () => {
        return false;
      },
      getFileList: (data) => {
        return [
          {
            url: data?.administrative_area,
            name: data?.name
          }
        ];
      },
      accept: ['.geojson'],
      rules: [{ required: true, message: `File Batas ${Modul.HAMLET} harus diisi` }]
    }
  ];

  return (
    <div>
      {getAllHamlets.isLoading ? (
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
                      const { message, isSuccess } = await deleteBatchVillageOfficials.execute(ids, token);
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
                      const { message, isSuccess } = await storeVillageOfficials.execute(values, token, values.administrative_area.file);
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
            <DataTable data={hamlets} columns={Column} loading={getAllHamlets.isLoading} map={(hamlet) => ({ key: hamlet.id, ...hamlet })} handleSelectedData={(_, selectedRows) => setSelectedData(selectedRows)} />
          </div>
        </Card>
      )}
    </div>
  );
};

export default Hamlet;
