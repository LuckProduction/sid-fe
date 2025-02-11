import { DataLoader, DataTable } from '@/components';
import Modul from '@/constants/Modul';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import { EmploymentService, VillageOfficialsService } from '@/services';
import dateFormatter from '@/utils/dateFormatter';
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Image, Space, Typography } from 'antd';
import dayjs from 'dayjs';
import { useCallback, useEffect, useState } from 'react';
import { villageOfficialsFormFields } from './FormFields';

const VillageOfficials = () => {
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
      fetchFn(token, pagination?.page, pagination?.perPage);
    }, [fetchFn, pagination?.page, pagination?.perPage]);
  };

  const villageOfficialsService = useCrudService(VillageOfficialsService);
  const employmentService = useCrudService(EmploymentService);

  const fetchVillageOfficials = useFetchData(villageOfficialsService.fetch, villageOfficialsService.pagination);
  const fetchEmployment = useFetchData(employmentService.fetch);

  useEffect(() => {
    fetchVillageOfficials();
    fetchEmployment();
  }, [fetchVillageOfficials, fetchEmployment]);

  const villageOfficials = villageOfficialsService.getAll.data ?? [];
  const employments = employmentService.getAll.data ?? [];

  const [selectedVillageOfficials, setSelectedVillageOfficials] = useState([]);

  const villageOfficialsColumn = [
    {
      title: 'Nama',
      dataIndex: 'name',
      sorter: (a, b) => a.name.length - b.name.length,
      searchable: true
    },
    {
      title: 'Jabatan',
      dataIndex: ['employment', 'employment_name'],
      sorter: (a, b) => a.employment.employment_name.length - b.employment.employment_name.length,
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
                title: `Edit ${Modul.VILLAGE_OFFICIALS}`,
                data: { ...record, birth_date: dayjs(record.birth_date), birth_place: record.birth_place, employment_id: record.employment.id },
                formFields: villageOfficialsFormFields({ options: { employments } }),
                onSubmit: async (values) => {
                  const { message, isSuccess } = await villageOfficialsService.update.execute(record.id, { ...values, birth_date: dateFormatter(values.birth_date), _method: 'PUT' }, token, values.image.file);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchVillageOfficials(token);
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
                title: record.name,
                data: [
                  {
                    key: 'name',
                    label: `Nama ${Modul.VILLAGE_OFFICIALS}`,
                    children: record.name
                  },
                  {
                    key: 'nip',
                    label: `NIP ${Modul.VILLAGE_OFFICIALS}`,
                    children: record.nip
                  },
                  {
                    key: 'employment',
                    label: `Jabatan ${Modul.VILLAGE_OFFICIALS}`,
                    children: record.employment.employment_name
                  },
                  {
                    key: 'address',
                    label: `Alamat ${Modul.VILLAGE_OFFICIALS}`,
                    children: record.address
                  },
                  {
                    key: 'phone_number',
                    label: `No Telp ${Modul.VILLAGE_OFFICIALS}`,
                    children: record.phone_number
                  },
                  {
                    key: 'birth_place',
                    label: `Tempat Lahir ${Modul.VILLAGE_OFFICIALS}`,
                    children: record.birth_place
                  },
                  {
                    key: 'gender',
                    label: `Jenis Kelamin ${Modul.VILLAGE_OFFICIALS}`,
                    children: record.gender
                  },
                  {
                    key: 'status',
                    label: `Status ${Modul.VILLAGE_OFFICIALS}`,
                    children: record.status
                  },
                  {
                    key: 'image',
                    label: `Foto ${Modul.VILLAGE_OFFICIALS}`,
                    children: <Image width={200} src={record.image} />
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
                title: `Delete ${Modul.VILLAGE_OFFICIALS}`,
                data: { ...record, birth_date: dayjs(record.birth_date), employment_id: record.employment.id },
                formFields: villageOfficialsFormFields({ options: { employments } }),
                onSubmit: async () => {
                  const { isSuccess, message } = await villageOfficialsService.delete.execute(record.id, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchVillageOfficials(token);
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
    <>
      {villageOfficialsService.getAll.isLoading ? (
        <DataLoader type="datatable" />
      ) : (
        <div className="grid w-full grid-cols-12 gap-4">
          <Card className="col-span-12">
            <div className="mb-6 flex items-center justify-between">
              <Typography.Title level={5}>Data {Modul.VILLAGE_OFFICIALS}</Typography.Title>
              <div className="inline-flex items-center gap-2">
                <Button
                  variant="outlined"
                  color="danger"
                  disabled={selectedVillageOfficials.length <= 0}
                  icon={<DeleteOutlined />}
                  onClick={() => {
                    modal.delete.batch({
                      title: `Hapus ${selectedVillageOfficials.length} ${Modul.VILLAGE_OFFICIALS} Yang Dipilih ? `,
                      formFields: villageOfficialsFormFields({ options: { employments } }),
                      onSubmit: async () => {
                        const ids = selectedVillageOfficials.map((item) => item.id);
                        const { message, isSuccess } = await villageOfficialsService.deleteBatch.execute(ids, token);
                        if (isSuccess) {
                          success('Berhasil', message);
                          fetchVillageOfficials(token);
                        } else {
                          error('Gagal', message);
                        }
                        return isSuccess;
                      }
                    });
                  }}
                >
                  {Modul.VILLAGE_OFFICIALS}
                </Button>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    modal.create({
                      title: `Tambah ${Modul.VILLAGE_OFFICIALS}`,
                      formFields: villageOfficialsFormFields({ options: { employments } }),
                      onSubmit: async (values) => {
                        const { message, isSuccess } = await villageOfficialsService.store.execute(
                          {
                            ...values,
                            birth_date: dateFormatter(values.birth_date)
                          },
                          token,
                          values.image.file
                        );
                        if (isSuccess) {
                          success('Berhasil', message);
                          fetchVillageOfficials(token);
                        } else {
                          error('Gagal', message);
                        }
                        return isSuccess;
                      }
                    });
                  }}
                >
                  {Modul.VILLAGE_OFFICIALS}
                </Button>
              </div>
            </div>
            <div className="w-full max-w-full overflow-x-auto">
              <DataTable
                data={villageOfficials}
                pagination={villageOfficialsService.pagination}
                columns={villageOfficialsColumn}
                loading={villageOfficialsService.getAll.isLoading}
                map={(category) => ({ key: category.id, ...category })}
                handleSelectedData={(_, selectedRows) => setSelectedVillageOfficials(selectedRows)}
              />
            </div>
          </Card>
        </div>
      )}
    </>
  );
};

export default VillageOfficials;
