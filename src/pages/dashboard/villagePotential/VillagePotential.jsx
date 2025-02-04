import { DataLoader, DataTable } from '@/components';
import Modul from '@/constants/Modul';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import { CategoryService, VillagePotentialService } from '@/services';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Space, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { villagePotentialFormFields } from './FormFields';
import Category from './Category';

const VillagePotential = () => {
  const { token } = useAuth();
  const { success, error } = useNotification();
  const { execute: fetchVillagePotential, ...getAllVillagePotential } = useService(VillagePotentialService.getAll);
  const { execute: fetchCategory, ...getAllCategory } = useService(CategoryService.getByType);

  const storeVillagePotential = useService(VillagePotentialService.store);
  const updateVillagePotential = useService(VillagePotentialService.update);
  const deleteVillagePotential = useService(VillagePotentialService.delete);
  const deleteBatchVillagePotential = useService(VillagePotentialService.deleteBatch);
  const [selectedVillagePotential, setSelectedVillagePotential] = useState([]);

  const modal = useCrudModal();

  const pagination = usePagination({ totalData: getAllVillagePotential.totalData });

  useEffect(() => {
    fetchVillagePotential(token, pagination.page, pagination.perPage);
    fetchCategory(token, 'potensi');
  }, [fetchCategory, fetchVillagePotential, pagination.page, pagination.perPage, token]);

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
                formFields: villagePotentialFormFields({ options: { category } }).filter((field) => field.name !== 'content'),
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
                formFields: villagePotentialFormFields({ options: { category } }).filter((field) => field.name !== 'content'),
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
                      formFields: villagePotentialFormFields({ options: { category } }).filter((field) => field.name !== 'content'),
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
          <Category />
        </div>
      )}
    </>
  );
};

export default VillagePotential;
