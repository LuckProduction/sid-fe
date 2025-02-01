import { DataLoader, DataTable } from '@/components';
import { InputType } from '@/constants';
import Modul from '@/constants/Modul';
import { useAuth, useCrudModal, useNotification, useService } from '@/hooks';
import { EmploymentService, VillageOfficialsService } from '@/services';
import dateFormatter from '@/utils/dateFormatter';
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Image, Space, Typography } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

const VillageOfficials = () => {
  const { token } = useAuth();
  const { success, error } = useNotification();
  const { execute: fetchVillageOfficials, ...getAllVillageOfficials } = useService(VillageOfficialsService.getAll);
  const storeVillageOfficials = useService(VillageOfficialsService.store);
  const updateVillageOfficials = useService(VillageOfficialsService.update);
  const deleteVillageOfficials = useService(VillageOfficialsService.delete);
  const deleteBatchVillageOfficials = useService(VillageOfficialsService.deleteBatch);
  const [selectedVillageOfficials, setSelectedVillageOfficials] = useState([]);

  const { execute: fetchEmployment, ...getAllEmployment } = useService(EmploymentService.getAll);
  const storeEmployment = useService(EmploymentService.store);
  const updateEmployment = useService(EmploymentService.update);
  const deleteEmployment = useService(EmploymentService.delete);
  const deleteBatchEmnployment = useService(EmploymentService.deleteBatch);
  const [selectedEmployment, setSelectedEmployment] = useState([]);

  const modal = useCrudModal();

  useEffect(() => {
    fetchVillageOfficials(token);
    fetchEmployment(token);
  }, [fetchEmployment, fetchVillageOfficials, token]);

  const villageOfficials = getAllVillageOfficials.data ?? [];
  const employments = getAllEmployment.data ?? [];

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
      width: '40%',
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
                formFields: villageOfficialsFormFields,
                onSubmit: async (values) => {
                  const { message, isSuccess } = await updateVillageOfficials.execute(record.id, { ...values, birth_date: dateFormatter(values.birth_date), _method: 'PUT' }, token, values.image.file);
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
                formFields: villageOfficialsFormFields,
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
    }
  ];

  const employmentColumn = [
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
                title: `Edit ${Modul.EMPLOYMENT}`,
                data: record,
                formFields: employmentFormFields,
                onSubmit: async (values) => {
                  const { message, isSuccess } = await updateEmployment.execute(record.id, values, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchEmployment(token);
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
          <Button
            icon={<DeleteOutlined />}
            variant="outlined"
            color="danger"
            onClick={() => {
              modal.delete.default({
                title: `Delete ${Modul.EMPLOYMENT}`,
                data: record,
                formFields: employmentFormFields,
                onSubmit: async () => {
                  const { isSuccess, message } = await deleteEmployment.execute(record.id, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchEmployment(token);
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

  const villageOfficialsFormFields = [
    {
      label: `Nama ${Modul.VILLAGE_OFFICIALS}`,
      name: 'name',
      type: InputType.TEXT,
      rules: [
        {
          required: true,
          message: `Nama ${Modul.VILLAGE_OFFICIALS} harus diisi`
        }
      ]
    },
    {
      label: `Jenis Kelamin ${Modul.VILLAGE_OFFICIALS}`,
      name: 'gender',
      type: InputType.SELECT,
      rules: [
        {
          required: true,
          message: `Jenis Kelamin ${Modul.VILLAGE_OFFICIALS} harus diisi`
        }
      ],
      options: [
        {
          label: 'Laki-laki',
          value: 'L'
        },
        {
          label: 'Perempuan',
          value: 'P'
        }
      ]
    },
    {
      label: `NIP ${Modul.VILLAGE_OFFICIALS}`,
      name: 'nip',
      type: InputType.TEXT
      // FIXME: IT HAS TO BE REQUIRED BUT FIX IT WHEN THE BACKEND IS FIXED
      // rules: [
      //   {
      //     required: true,
      //     message: `NIP ${Modul.VILLAGE_OFFICIALS} harus diisi`
      //   }
      // ]
    },
    {
      label: `Alamat ${Modul.VILLAGE_OFFICIALS}`,
      name: 'address',
      type: InputType.LONGTEXT,
      rules: [
        {
          required: true,
          message: `Alamat ${Modul.VILLAGE_OFFICIALS} harus diisi`
        }
      ]
    },
    {
      label: `Nomor Telp ${Modul.VILLAGE_OFFICIALS}`,
      name: 'phone_number',
      type: InputType.TEXT,
      rules: [
        {
          required: true,
          message: `Nomor Telp ${Modul.VILLAGE_OFFICIALS} harus diisi`
        }
      ]
    },
    {
      label: `Tempat Lahir ${Modul.VILLAGE_OFFICIALS}`,
      name: 'birth_place',
      type: InputType.TEXT,
      rules: [
        {
          required: true,
          message: `Tempat Lahir ${Modul.VILLAGE_OFFICIALS} harus diisi`
        }
      ]
    },
    {
      label: `Tanggal Lahir ${Modul.VILLAGE_OFFICIALS}`,
      name: 'birth_date',
      type: InputType.DATE,
      rules: [
        {
          required: true,
          message: `Tanggal Lahir ${Modul.VILLAGE_OFFICIALS} harus diisi`
        }
      ]
    },
    {
      label: `Status ${Modul.VILLAGE_OFFICIALS}`,
      name: 'status',
      type: InputType.SELECT,
      rules: [
        {
          required: true,
          message: `Status ${Modul.VILLAGE_OFFICIALS} harus diisi`
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
    },
    {
      label: `Jabatan ${Modul.VILLAGE_OFFICIALS}`,
      name: 'employment_id',
      type: InputType.SELECT,
      rules: [
        {
          required: true,
          message: `Jabatan ${Modul.VILLAGE_OFFICIALS} harus diisi`
        }
      ],
      options: employments.map((item) => ({
        label: item.employment_name,
        value: item.id
      }))
    },
    {
      label: `Gambar ${Modul.VILLAGE_OFFICIALS}`,
      name: 'image',
      type: InputType.UPLOAD,
      max: 1,
      beforeUpload: () => {
        return false;
      },
      getFileList: (data) => {
        return [
          {
            url: data?.image,
            name: data?.name
          }
        ];
      },
      accept: ['.png', '.jpg', '.jpeg', 'webp'],
      rules: [{ required: true, message: 'Logo harus diisi' }]
    }
  ];

  const employmentFormFields = [
    {
      label: `Nama ${Modul.EMPLOYMENT}`,
      name: 'employment_name',
      type: InputType.TEXT,
      rules: [
        {
          required: true,
          message: `Nama ${Modul.EMPLOYMENT} harus diisi`
        }
      ]
    },
    {
      label: `Kode ${Modul.EMPLOYMENT}`,
      name: 'employment_code',
      type: InputType.TEXT,
      rules: [
        {
          required: true,
          message: `Kode ${Modul.EMPLOYMENT} harus diisi`
        }
      ]
    },
    {
      label: `Tupoksi ${Modul.EMPLOYMENT}`,
      name: 'employment_duties',
      type: InputType.TEXT,
      rules: [
        {
          required: true,
          message: `Tupoksi ${Modul.EMPLOYMENT} harus diisi`
        }
      ]
    },
    {
      label: `Golongan ${Modul.EMPLOYMENT}`,
      name: 'faction',
      type: InputType.TEXT,
      rules: [
        {
          required: true,
          message: `Golongan ${Modul.EMPLOYMENT} harus diisi`
        }
      ]
    }
  ];

  return (
    <>
      {getAllVillageOfficials.isLoading ? (
        <DataLoader type="datatable" />
      ) : (
        <div className="grid w-full grid-cols-12 gap-4">
          <Card className="col-span-8">
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
                      formFields: villageOfficialsFormFields,
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
                      formFields: villageOfficialsFormFields,
                      onSubmit: async (values) => {
                        const { message, isSuccess } = await storeVillageOfficials.execute(
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
                columns={villageOfficialsColumn}
                loading={getAllVillageOfficials.isLoading}
                map={(category) => ({ key: category.id, ...category })}
                handleSelectedData={(_, selectedRows) => setSelectedVillageOfficials(selectedRows)}
              />
            </div>
          </Card>
          <Card className="col-span-4">
            <div className="mb-6 flex items-center justify-between">
              <Typography.Title level={5}>Data {Modul.EMPLOYMENT}</Typography.Title>
              <div className="inline-flex items-center gap-2">
                <Button
                  variant="outlined"
                  color="danger"
                  disabled={selectedEmployment.length <= 0}
                  icon={<DeleteOutlined />}
                  onClick={() => {
                    modal.delete.batch({
                      title: `Hapus ${selectedEmployment.length} ${Modul.EMPLOYMENT} Yang Dipilih ? `,
                      formFields: employmentFormFields,
                      onSubmit: async () => {
                        const ids = selectedEmployment.map((item) => item.id);
                        const { message, isSuccess } = await deleteBatchEmnployment.execute(ids, token);
                        if (isSuccess) {
                          success('Berhasil', message);
                          fetchEmployment(token);
                        } else {
                          error('Gagal', message);
                        }
                        return isSuccess;
                      }
                    });
                  }}
                >
                  {Modul.EMPLOYMENT}
                </Button>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    modal.create({
                      title: `Tambah ${Modul.EMPLOYMENT}`,
                      formFields: employmentFormFields,
                      onSubmit: async (values) => {
                        const { message, isSuccess } = await storeEmployment.execute(values, token);
                        if (isSuccess) {
                          success('Berhasil', message);
                          fetchEmployment(token);
                        } else {
                          error('Gagal', message);
                        }
                        return isSuccess;
                      }
                    });
                  }}
                >
                  {Modul.EMPLOYMENT}
                </Button>
              </div>
            </div>
            <div className="w-full max-w-full overflow-x-auto">
              <DataTable data={employments} columns={employmentColumn} loading={getAllEmployment.isLoading} map={(employment) => ({ key: employment.id, ...employment })} handleSelectedData={(_, selectedRows) => setSelectedEmployment(selectedRows)} />
            </div>
          </Card>
        </div>
      )}
    </>
  );
};

export default VillageOfficials;
