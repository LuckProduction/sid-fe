import { DataLoader, DataTable } from '@/components';
import Modul from '@/constants/Modul';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import { EmploymentService, ResidentService, VillageOfficialsService } from '@/services';
import dateFormatter from '@/utils/dateFormatter';
import { Button, Card, Dropdown, Image, Space, Typography } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { villageOfficialsFormFields } from './FormFields';
import { Action } from '@/constants';
import { Delete, Detail, Edit } from '@/components/dashboard/button';
import { VillageOfficials as VillageOfficialsModel } from '@/models';
import { DeleteOutlined, DownOutlined, PlusOutlined, UserAddOutlined } from '@ant-design/icons';

const { DELETE, UPDATE, READ } = Action;

const VillageOfficials = () => {
  const { token, user } = useAuth();
  const { success, error } = useNotification();
  const modal = useCrudModal();
  const { execute: fetchVillageOfficials, ...getAllVillageOfficials } = useService(VillageOfficialsService.getAll);
  const { execute: fetchEmployments, ...getAllEmployments } = useService(EmploymentService.getAll);
  const { execute: fetchResidents } = useService(ResidentService.getAll);
  const { ...getAllResidentDetails } = useService(ResidentService.getById);
  const storeVillageOfficials = useService(VillageOfficialsService.store);
  const updateVillageOfficials = useService(VillageOfficialsService.update);
  const deleteVillageOfficials = useService(VillageOfficialsService.delete);
  const deleteBatchVillageOfficials = useService(VillageOfficialsService.deleteBatch);

  const pagination = usePagination({ totalData: getAllVillageOfficials.totalData });

  useEffect(() => {
    fetchVillageOfficials(token, pagination.page, pagination.perPage);
    fetchEmployments(token);
    fetchResidents({ token: token });
  }, [fetchEmployments, fetchResidents, fetchVillageOfficials, pagination.page, pagination.perPage, token]);

  const menuItems = [
    {
      label: 'Tambah',
      key: 'default_create',
      icon: <PlusOutlined />
    },
    {
      label: 'Tambah Dari Master Penduduk',
      key: 'create_by_resident',
      icon: <UserAddOutlined />
    }
  ];

  const villageOfficials = getAllVillageOfficials.data ?? [];
  const employments = getAllEmployments.data ?? [];

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
    }
  ];

  if (user && user.eitherCan([UPDATE, VillageOfficialsModel], [DELETE, VillageOfficialsModel], [READ, VillageOfficialsModel])) {
    villageOfficialsColumn.push({
      title: 'Aksi',
      render: (_, record) => (
        <Space size="small">
          <Edit
            title={`Edit ${Modul.VILLAGE_OFFICIALS}`}
            model={VillageOfficialsModel}
            onClick={() => {
              modal.edit({
                title: `Edit ${Modul.VILLAGE_OFFICIALS}`,
                data: { ...record, birth_date: dayjs(record.birth_date), birth_place: record.birth_place, employment_id: record.employment.id },
                formFields: villageOfficialsFormFields({ key: 'default_create', options: { employments } }),
                onSubmit: async (values) => {
                  const { message, isSuccess } = await updateVillageOfficials.execute(record.id, { ...values, birth_date: dateFormatter(values.birth_date), _method: 'PUT', address: '-' }, token, values.image.file);
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
          <Detail
            title={`Detail ${Modul.VILLAGE_OFFICIALS}`}
            model={VillageOfficialsModel}
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
          <Delete
            title={`Delete ${Modul.VILLAGE_OFFICIALS}`}
            model={VillageOfficialsModel}
            onClick={() => {
              modal.delete.default({
                title: `Delete ${Modul.VILLAGE_OFFICIALS}`,
                data: { ...record, birth_date: dayjs(record.birth_date), employment_id: record.employment.id },
                formFields: villageOfficialsFormFields({ key: 'default_create', options: { employments } }),
                onSubmit: async () => {
                  const { isSuccess, message } = await deleteVillageOfficials.execute(record.id, token);
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
    });
  }

  const onDeleteBatch = () => {
    modal.delete.batch({
      title: `Hapus ${selectedVillageOfficials.length} ${Modul.VILLAGE_OFFICIALS} Yang Dipilih ? `,
      formFields: villageOfficialsFormFields({ options: { employments } }),
      onSubmit: async () => {
        const ids = selectedVillageOfficials.map((item) => item.id);
        const { message, isSuccess } = await deleteBatchVillageOfficials.execute(ids, token);
        if (isSuccess) {
          success('Berhasil', message);
          fetchVillageOfficials(token);
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  const handleMenuClick = async (e) => {
    modal.create({
      title: `Tambah ${Modul.VILLAGE_OFFICIALS}`,
      formFields: villageOfficialsFormFields({ key: e.key, options: { employments }, fetch: fetchResidents }),
      onSubmit: async (values) => {
        let residentData = null;

        if (values.resident) {
          const { data } = await getAllResidentDetails.execute(token, values.resident);
          residentData = data;
        }

        const payload =
          e.key === 'create_by_resident' && residentData
            ? {
                ...values,
                name: residentData.full_name,
                gender: residentData.gender,
                birth_place: residentData.birth.birth_place,
                birth_date: dateFormatter(residentData.birth.birth_date),
                address: '-'
              }
            : {
                ...values,
                birth_date: dateFormatter(values.birth_date)
              };

        const { message, isSuccess } = await storeVillageOfficials.execute(payload, token, values.image?.file);

        if (isSuccess) {
          success('Berhasil', message);
          fetchVillageOfficials(token);
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  return (
    <>
      {getAllVillageOfficials.isLoading ? (
        <DataLoader type="datatable" />
      ) : (
        <div className="grid w-full grid-cols-12 gap-4">
          <Card className="col-span-12">
            {/* <DataTableHeader model={VillageOfficialsModel} modul={Modul.VILLAGE_OFFICIALS} onStore={onCreate} onDeleteBatch={onDeleteBatch} selectedData={selectedVillageOfficials} /> */}
            <div className="mb-6">
              <Typography.Title level={5}>Data {Modul.VILLAGE_OFFICIALS}</Typography.Title>
              <div className="mb-6 mt-6 flex flex-col-reverse justify-end gap-2 empty:hidden md:flex-row">
                <Button className="me-auto" icon={<DeleteOutlined />} variant="solid" color="danger" disabled={!selectedVillageOfficials?.length} onClick={onDeleteBatch}>
                  Hapus {selectedVillageOfficials?.length || null} Pilihan
                </Button>
                {/* <Button icon={<PlusOutlined />} type="primary" onClick={onCreate}>
                    Tambah
                  </Button> */}
                <Dropdown menu={{ items: menuItems, onClick: handleMenuClick }}>
                  <Button>
                    <Space>
                      Tambah
                      <DownOutlined />
                    </Space>
                  </Button>
                </Dropdown>
              </div>
            </div>
            <div className="w-full max-w-full overflow-x-auto">
              <DataTable
                data={villageOfficials}
                pagination={pagination}
                columns={villageOfficialsColumn}
                loading={getAllVillageOfficials.isLoading}
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
