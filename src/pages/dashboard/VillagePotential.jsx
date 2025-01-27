import { DataLoader, DataTable } from '@/components';
import { InputType } from '@/constants';
import Modul from '@/constants/Modul';
import { useAuth, useCrudModal, useNotification, useService } from '@/hooks';
import { CategoryService, VillagePotentialService } from '@/services';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Space, Typography } from 'antd';
import { useEffect, useState } from 'react';

const VillagePotential = () => {
  const { token } = useAuth();
  const { success, error } = useNotification();
  const { execute: fetchVillagePotential, ...getAllVillagePotential } = useService(VillagePotentialService.getAll);
  const { execute: fetchCategory, ...getAllCategory } = useService(CategoryService.getByType);
  const updateCategory = useService(CategoryService.update);
  const deleteCategory = useService(CategoryService.delete);
  const storeCategory = useService(CategoryService.store);
  const deleteBatchCategory = useService(CategoryService.deleteBatch);
  const storeVillagePotential = useService(VillagePotentialService.store);
  const updateVillagePotential = useService(VillagePotentialService.update);
  const deleteVillagePotential = useService(VillagePotentialService.delete);
  const deleteBatchVillagePotential = useService(VillagePotentialService.deleteBatch);
  const [selectedVillagePotential, setSelectedVillagePotential] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);

  const modal = useCrudModal();

  useEffect(() => {
    fetchVillagePotential(token);
    fetchCategory(token, 'potensi');
  }, [fetchVillagePotential, fetchCategory, token]);

  const villagePotential = getAllVillagePotential.data ?? [];
  const category = getAllCategory.data ?? [];

  const villagePotentialColumn = [
    {
      title: 'Nama Potensi',
      dataIndex: 'potential_name',
      sorter: (a, b) => a.potential_name.length - b.potential_name.length,
      searchable: true
    },
    {
      title: 'Lokasi',
      dataIndex: 'location',
      sorter: (a, b) => a.location.length - b.location.length,
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
                title: `Edit ${Modul.VILLAGE_POTENTIALS}`,
                data: { ...record, category: record.category.id },
                formFields: villagePotentialFormFields,
                onSubmit: async (values) => {
                  const { message, isSuccess } = await updateVillagePotential.execute(record.id, { ...values, _method: 'PUT' }, token, values.foto.file);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchVillagePotential(token);
                  } else {
                    error('Gagal', message);
                  }
                  return isSuccess;
                }
              });
            }}
          />
          <Button
            icon={<DeleteOutlined />}
            variant="outlined"
            color="danger"
            onClick={() => {
              modal.delete.default({
                title: `Delete ${Modul.VILLAGE_POTENTIALS}`,
                data: { ...record, category: record.category.id },
                formFields: villagePotentialFormFields,
                onSubmit: async () => {
                  const { isSuccess, message } = await deleteVillagePotential.execute(record.id, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchVillagePotential(token);
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

  const categoryColumn = [
    {
      title: 'Nama',
      dataIndex: 'category_name',
      sorter: (a, b) => a.category_name.length - b.category_name.length,
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
                title: `Edit ${Modul.CATEGORY}`,
                data: record,
                formFields: categoryFormFields,
                onSubmit: async (values) => {
                  const { message, isSuccess } = await updateCategory.execute(record.id, { ...values, type: 'potensi' }, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchCategory(token, 'potensi');
                  } else {
                    error('Gagal', message);
                  }
                  return isSuccess;
                }
              });
            }}
          />
          <Button
            icon={<DeleteOutlined />}
            variant="outlined"
            color="danger"
            onClick={() => {
              modal.delete.default({
                title: `Delete ${Modul.CATEGORY}`,
                data: record,
                formFields: categoryFormFields,
                onSubmit: async () => {
                  const { isSuccess, message } = await deleteCategory.execute(record.id, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchCategory(token, 'potensi');
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

  const villagePotentialFormFields = [
    {
      label: `Nama Potensi`,
      name: 'potential_name',
      type: InputType.TEXT,
      rules: [
        {
          required: true,
          message: `Nama Potensi harus diisi`
        }
      ]
    },
    {
      label: `Deskripsi`,
      name: 'description',
      type: InputType.LONGTEXT,
      rules: [
        {
          required: true,
          message: `Deskripsi harus diisi`
        }
      ]
    },
    {
      label: `Lokasi`,
      name: 'location',
      type: InputType.TEXT,
      rules: [
        {
          required: true,
          message: `Lokasi harus diisi`
        }
      ]
    },
    {
      label: `Kategori`,
      name: 'category',
      type: InputType.SELECT,
      options: category.map((item) => ({
        label: item.category_name,
        value: item.id
      })),
      rules: [
        {
          required: true,
          message: `Kategori harus diisi`
        }
      ]
    },
    {
      label: `Gambar ${Modul.VILLAGE_POTENTIALS}`,
      name: 'foto',
      type: InputType.UPLOAD,
      max: 1,
      beforeUpload: () => {
        return false;
      },
      getFileList: (data) => {
        return [
          {
            url: data?.foto,
            name: data?.name
          }
        ];
      },
      accept: ['.png', '.jpg', '.jpeg', 'webp'],
      rules: [{ required: true, message: 'Logo harus diisi' }]
    },
    {
      label: `Titik Koordinat`,
      name: 'coordinate',
      type: InputType.TEXT,
      rules: [
        {
          required: true,
          message: `Titik Koordinat harus diisi`
        }
      ]
    }
  ];

  const categoryFormFields = [
    {
      label: `Nama Kategori`,
      name: 'category_name',
      type: InputType.TEXT,
      rules: [
        {
          required: true,
          message: `Nama Kategori harus diisi`
        }
      ]
    }
  ];

  return (
    <>
      {getAllVillagePotential.isLoading ? (
        <DataLoader type="datatable" />
      ) : (
        <div className="grid w-full grid-cols-12 gap-4">
          <Card className="col-span-8">
            <div className="mb-6 flex items-center justify-between">
              <Typography.Title level={5}>Data {Modul.VILLAGE_POTENTIALS}</Typography.Title>
              <div className="inline-flex items-center gap-2">
                <Button
                  variant="outlined"
                  color="danger"
                  disabled={selectedVillagePotential.length <= 0}
                  icon={<DeleteOutlined />}
                  onClick={() => {
                    modal.delete.batch({
                      title: `Hapus ${selectedVillagePotential.length} ${Modul.VILLAGE_POTENTIALS} Yang Dipilih ? `,
                      onSubmit: async () => {
                        const ids = selectedVillagePotential.map((item) => item.id);
                        const { message, isSuccess } = await deleteBatchVillagePotential.execute(ids, token);
                        if (isSuccess) {
                          success('Berhasil', message);
                          fetchVillagePotential(token);
                        } else {
                          error('Gagal', message);
                        }
                        return isSuccess;
                      }
                    });
                  }}
                >
                  {Modul.VILLAGE_POTENTIALS}
                </Button>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    modal.create({
                      title: `Tambah ${Modul.VILLAGE_POTENTIALS}`,
                      formFields: villagePotentialFormFields,
                      onSubmit: async (values) => {
                        const { message, isSuccess } = await storeVillagePotential.execute(values, token, values.foto.file);
                        if (isSuccess) {
                          success('Berhasil', message);
                          fetchVillagePotential(token);
                        } else {
                          error('Gagal', message);
                        }
                        return isSuccess;
                      }
                    });
                  }}
                >
                  {Modul.VILLAGE_POTENTIALS}
                </Button>
              </div>
            </div>
            <div className="w-full max-w-full overflow-x-auto">
              <DataTable
                data={villagePotential}
                columns={villagePotentialColumn}
                loading={getAllVillagePotential.isLoading}
                map={(article) => ({ key: article.id, ...article })}
                handleSelectedData={(_, selectedRows) => setSelectedVillagePotential(selectedRows)}
              />
            </div>
          </Card>
          <Card className="col-span-4">
            <div className="mb-6 flex items-center justify-between">
              <Typography.Title level={5}>Data {Modul.CATEGORY}</Typography.Title>
              <div className="inline-flex items-center gap-2">
                <Button
                  variant="outlined"
                  color="danger"
                  disabled={selectedCategory.length <= 0}
                  icon={<DeleteOutlined />}
                  onClick={() => {
                    modal.delete.batch({
                      title: `Hapus ${selectedCategory.length} ${Modul.CATEGORY} ${Modul.VILLAGE_POTENTIALS} Yang Dipilih ? `,
                      onSubmit: async () => {
                        const ids = selectedCategory.map((item) => item.id);
                        const { message, isSuccess } = await deleteBatchCategory.execute(ids, token);
                        if (isSuccess) {
                          success('Berhasil', message);
                          fetchCategory(token, 'potensi');
                        } else {
                          error('Gagal', message);
                        }
                        return isSuccess;
                      }
                    });
                  }}
                >
                  {Modul.ARTICLE}
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    modal.create({
                      title: `Tambah Kategori`,
                      formFields: categoryFormFields,
                      onSubmit: async (values) => {
                        const { message, isSuccess } = await storeCategory.execute({ ...values, type: 'potensi' }, token);
                        if (isSuccess) {
                          success('Berhasil', message);
                          fetchCategory(token, 'potensi');
                        } else {
                          error('Gagal', message);
                        }
                        return isSuccess;
                      }
                    });
                  }}
                >
                  {Modul.CATEGORY}
                </Button>
              </div>
            </div>
            <div className="w-full max-w-full overflow-x-auto">
              <DataTable data={category} columns={categoryColumn} loading={getAllCategory.isLoading} map={(category) => ({ key: category.id, ...category })} handleSelectedData={(_, selectedRows) => setSelectedCategory(selectedRows)} />
            </div>
          </Card>
        </div>
      )}
    </>
  );
};

export default VillagePotential;
