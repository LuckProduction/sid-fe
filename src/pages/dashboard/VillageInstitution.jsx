import { DataLoader, DataTable } from '@/components';
import { InputType } from '@/constants';
import Modul from '@/constants/Modul';
import { useAuth, useCrudModal, useNotification, useService } from '@/hooks';
import { VillageInstitutionService } from '@/services';
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Space, Tag, Typography } from 'antd';
import { useEffect, useState } from 'react';

const VillageInstitution = () => {
  const { token } = useAuth();
  const { success, error } = useNotification();
  const { execute: fetchVillageInstitution, ...getAllVillageInstitution } = useService(VillageInstitutionService.getAll);
  const storeVillageInstitution = useService(VillageInstitutionService.store);
  const updateVillageInstitution = useService(VillageInstitutionService.update);
  const deleteVillageInstitution = useService(VillageInstitutionService.delete);
  const deleteBatchVillageInstitution = useService(VillageInstitutionService.deleteBatch);
  const [selectedData, setSelectedData] = useState([]);

  const modal = useCrudModal();

  useEffect(() => {
    fetchVillageInstitution(token);
  }, [fetchVillageInstitution, token]);

  const villageInstitution = getAllVillageInstitution.data ?? [];

  const Column = [
    {
      title: 'Nama Lembaga',
      dataIndex: 'institution_name',
      sorter: (a, b) => a.institution_name.length - b.institution_name.length,
      searchable: true
    },
    {
      title: 'Kode Lembaga',
      dataIndex: 'institution_code',
      sorter: (a, b) => a.institution_code.length - b.institution_code.length,
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
                title: `Edit ${Modul.VILLAGE_INSTITUTION}`,
                data: record,
                formFields: formFields,
                onSubmit: async (values) => {
                  const { message, isSuccess } = await updateVillageInstitution.execute(record.id, { ...values, _method: 'PUT' }, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchVillageInstitution(token);
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
              console.log(record.status);
              modal.show.description({
                title: record.institution_name,
                data: [
                  {
                    key: 'institution_name',
                    label: `Nama ${Modul.VILLAGE_INSTITUTION}`,
                    children: record.institution_name
                  },
                  {
                    key: 'institution_code',
                    label: `Kode ${Modul.VILLAGE_INSTITUTION}`,
                    children: record.institution_code
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
          <Button
            icon={<DeleteOutlined />}
            variant="outlined"
            color="danger"
            onClick={() => {
              modal.delete.default({
                title: `Delete ${Modul.VILLAGE_INSTITUTION}`,
                data: record,
                formFields: formFields,
                onSubmit: async () => {
                  const { isSuccess, message } = await deleteVillageInstitution.execute(record.id, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchVillageInstitution(token);
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
      label: `Nama ${Modul.VILLAGE_INSTITUTION}`,
      name: 'institution_name',
      type: InputType.TEXT,
      rules: [
        {
          required: true,
          message: `Nama ${Modul.VILLAGE_INSTITUTION} harus diisi`
        }
      ]
    },
    {
      label: `Kode ${Modul.VILLAGE_INSTITUTION}`,
      name: 'institution_code',
      type: InputType.TEXT,
      rules: [
        {
          required: true,
          message: `Kode ${Modul.VILLAGE_INSTITUTION} harus diisi`
        }
      ]
    },
    {
      label: `Status ${Modul.VILLAGE_INSTITUTION}`,
      name: 'status',
      type: InputType.SELECT,
      picker: 'select',
      rules: [
        {
          required: true,
          message: `Status ${Modul.VILLAGE_INSTITUTION} harus diisi`
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
      {getAllVillageInstitution.isLoading ? (
        <DataLoader type="datatable" />
      ) : (
        <Card>
          <div className="mb-6 flex items-center justify-between">
            <Typography.Title level={5}>Data {Modul.VILLAGE_INSTITUTION}</Typography.Title>
            <div className="inline-flex items-center gap-2">
              <Button
                variant="outlined"
                color="danger"
                disabled={selectedData.length <= 0}
                icon={<DeleteOutlined />}
                onClick={() => {
                  modal.delete.batch({
                    title: `Hapus ${selectedData.length} ${Modul.VILLAGE_INSTITUTION} Yang Dipilih ? `,
                    formFields: formFields,
                    onSubmit: async () => {
                      const ids = selectedData.map((item) => item.id);
                      const { message, isSuccess } = await deleteBatchVillageInstitution.execute(ids, token);
                      if (isSuccess) {
                        success('Berhasil', message);
                        fetchVillageInstitution(token);
                      } else {
                        error('Gagal', message);
                      }
                      return isSuccess;
                    }
                  });
                }}
              >
                {Modul.VILLAGE_INSTITUTION}
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  modal.create({
                    title: `Tambah ${Modul.VILLAGE_INSTITUTION}`,
                    formFields: formFields,
                    onSubmit: async (values) => {
                      const { message, isSuccess } = await storeVillageInstitution.execute(values, token);
                      if (isSuccess) {
                        success('Berhasil', message);
                        fetchVillageInstitution(token);
                      } else {
                        error('Gagal', message);
                      }
                      return isSuccess;
                    }
                  });
                }}
              >
                {Modul.VILLAGE_INSTITUTION}
              </Button>
            </div>
          </div>
          <div className="w-full max-w-full overflow-x-auto">
            <DataTable data={villageInstitution} columns={Column} loading={getAllVillageInstitution.isLoading} map={(category) => ({ key: category.id, ...category })} handleSelectedData={(_, selectedRows) => setSelectedData(selectedRows)} />
          </div>
        </Card>
      )}
    </div>
  );
};

export default VillageInstitution;
