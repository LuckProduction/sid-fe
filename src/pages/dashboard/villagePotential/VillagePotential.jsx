import { DataLoader, DataTable, DataTableHeader } from '@/components';
import Modul from '@/constants/Modul';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import { CategoryService, VillagePotentialService } from '@/services';
import { Card, Space } from 'antd';
import { useEffect, useState } from 'react';
import { villagePotentialFormFields } from './FormFields';
import Category from './Category';
import { Delete, Edit } from '@/components/dashboard/button';
import { Action } from '@/constants';
import { VillagePotential as VillagePotentialModel } from '@/models';

const { DELETE, UPDATE } = Action;

const VillagePotential = () => {
  const { token, user } = useAuth();
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
    fetchVillagePotential(token, pagination.page, pagination.per_page);
    fetchCategory(token, 'potensi');
  }, [fetchCategory, fetchVillagePotential, pagination.page, pagination.per_page, token]);

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
    }
  ];

  if (user && user.eitherCan([UPDATE, VillagePotentialModel], [DELETE, VillagePotentialModel])) {
    villagePotentialColumn.push({
      title: 'Aksi',
      render: (_, record) => (
        <Space size="small">
          <Edit
            title={`Edit ${Modul.VILLAGE_POTENTIALS}`}
            model={VillagePotentialModel}
            onClick={() => {
              const [longitude, latitude] = record.coordinate.split(',').map((coord) => coord.trim());
              modal.edit({
                title: `Edit ${Modul.VILLAGE_POTENTIALS}`,
                data: { ...record, category: record.category.id, longitude: longitude, latitude: latitude },
                formFields: villagePotentialFormFields({ options: { category } }).filter((field) => field.name !== 'content'),
                onSubmit: async (values) => {
                  const { message, isSuccess } = await updateVillagePotential.execute(record.id, { ...values, _method: 'PUT', coordinate: `${values.longitude}, ${values.latitude}` }, token, values.foto.file);
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
          <Delete
            title={`Delete ${Modul.VILLAGE_POTENTIALS}`}
            model={VillagePotentialModel}
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
    });
  }

  const onDeleteBatch = () => {
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
  };

  const onCreate = () => {
    modal.create({
      title: `Tambah ${Modul.VILLAGE_POTENTIALS}`,
      formFields: villagePotentialFormFields({ options: { category } }).filter((field) => field.name !== 'content'),
      onSubmit: async (values) => {
        const { message, isSuccess } = await storeVillagePotential.execute({ ...values, coordinate: `${values.longitude}, ${values.latitude}` }, token, values.foto.file);
        if (isSuccess) {
          success('Berhasil', message);
          fetchVillagePotential(token);
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  return (
    <>
      {getAllVillagePotential.isLoading ? (
        <DataLoader type="datatable" />
      ) : (
        <div className="grid w-full grid-cols-12 gap-4">
          <Card className="col-span-8">
            <DataTableHeader model={VillagePotentialModel} modul={Modul.VILLAGE_POTENTIALS} onStore={onCreate} onDeleteBatch={onDeleteBatch} selectedData={selectedVillagePotential} />
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
