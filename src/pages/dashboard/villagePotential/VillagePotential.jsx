import { DataTable, DataTableHeader } from '@/components';
import Modul from '@/constants/Modul';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import { CategoryService, VillagePotentialService } from '@/services';
import { Card, Space, Tabs } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { villagePotentialFormFields } from './FormFields';
import Category from './Category';
import { Delete, Edit } from '@/components/dashboard/button';
import { Action } from '@/constants';
import { VillagePotential as VillagePotentialModel } from '@/models';
import { useNavigate } from 'react-router-dom';

const { DELETE, UPDATE } = Action;

const VillagePotential = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const { success, error } = useNotification();
  const { execute, ...getAllVillagePotential } = useService(VillagePotentialService.getAll);
  const { execute: fetchCategory, ...getAllCategory } = useService(CategoryService.getByType);
  const deleteVillagePotential = useService(VillagePotentialService.delete);
  const deleteBatchVillagePotential = useService(VillagePotentialService.deleteBatch);
  const [selectedVillagePotential, setSelectedVillagePotential] = useState([]);
  const modal = useCrudModal();
  const pagination = usePagination({ totalData: getAllVillagePotential.totalData });
  const [filterValues, setFilterValues] = useState({ search: '' });

  const fetchVillagePotential = useCallback(() => {
    execute({
      token: token,
      page: pagination.page,
      per_page: pagination.per_page,
      search: filterValues.search
    });
  }, [execute, filterValues.search, pagination.page, pagination.per_page, token]);

  useEffect(() => {
    fetchVillagePotential();
    fetchCategory(token, 'potensi');
  }, [fetchCategory, fetchVillagePotential, token]);

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
              navigate(window.location.pathname + '/edit/' + record.id);
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

  return (
    <Card>
      <Tabs type="card">
        <Tabs.TabPane tab="Potensi Desa" key="potensi_desa">
          <DataTableHeader
            onSearch={(values) => setFilterValues({ ...filterValues, search: values })}
            model={VillagePotentialModel}
            modul={Modul.VILLAGE_POTENTIALS}
            onStore={() => navigate(window.location.pathname + '/create')}
            onDeleteBatch={onDeleteBatch}
            selectedData={selectedVillagePotential}
          />
          <div className="w-full max-w-full overflow-x-auto">
            <DataTable
              data={villagePotential}
              columns={villagePotentialColumn}
              loading={getAllVillagePotential.isLoading}
              map={(article) => ({ key: article.id, ...article })}
              handleSelectedData={(_, selectedRows) => setSelectedVillagePotential(selectedRows)}
            />
          </div>
        </Tabs.TabPane>
        <Tabs.TabPane tab="Kategori Potensi" key="category">
          <Category />
        </Tabs.TabPane>
      </Tabs>
    </Card>
  );
};

export default VillagePotential;
