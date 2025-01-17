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
  const { execute: fetchEmployment, ...getAllEmployMent } = useService(EmploymentService.getAll);
  const storeVillageOfficials = useService(VillageOfficialsService.store);
  const updateVillageOfficials = useService(VillageOfficialsService.update);
  const deleteVillageOfficials = useService(VillageOfficialsService.delete);
  const deleteBatchVillageOfficials = useService(VillageOfficialsService.deleteBatch);
  const [selectedData, setSelectedData] = useState([]);

  const modal = useCrudModal();

  useEffect(() => {
    fetchVillageOfficials(token);
    fetchEmployment(token);
  }, [fetchEmployment, fetchVillageOfficials, token]);

  const villageOfficials = getAllVillageOfficials.data ?? [];
  const employments = getAllEmployMent.data ?? [];

  const Column = [
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
                formFields: formFields,
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
                formFields: formFields,
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

  const formFields = [
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

  return (
    <div>
      {getAllVillageOfficials.isLoading ? (
        <DataLoader type="datatable" />
      ) : (
        <Card>
          <div className="mb-6 flex items-center justify-between">
            <Typography.Title level={5}>Data {Modul.VILLAGE_OFFICIALS}</Typography.Title>
            <div className="inline-flex items-center gap-2">
              <Button
                variant="outlined"
                color="danger"
                disabled={selectedData.length <= 0}
                icon={<DeleteOutlined />}
                onClick={() => {
                  modal.delete.batch({
                    title: `Hapus ${selectedData.length} ${Modul.VILLAGE_OFFICIALS} Yang Dipilih ? `,
                    formFields: formFields,
                    onSubmit: async () => {
                      const ids = selectedData.map((item) => item.id);
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
                    formFields: formFields,
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
            <DataTable data={villageOfficials} columns={Column} loading={getAllVillageOfficials.isLoading} map={(category) => ({ key: category.id, ...category })} handleSelectedData={(_, selectedRows) => setSelectedData(selectedRows)} />
          </div>
        </Card>
      )}
    </div>
  );
};

export default VillageOfficials;
