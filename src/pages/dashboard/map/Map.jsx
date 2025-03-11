import { DataLoader, DataTable } from '@/components';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import { CategoryService, MapService } from '@/services';
import { AreaChartOutlined, DeleteOutlined, DownOutlined, PushpinOutlined } from '@ant-design/icons';
import { Button, Card, Dropdown, Space, Tabs, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { Action } from '@/constants';
import Category from './Category';
import Modul from '@/constants/Modul';
import { mapFormFields } from './FormFields';
import { Map as MapModel } from '@/models';
import { Delete, Edit } from '@/components/dashboard/button';

const { READ, UPDATE, DELETE } = Action;

const Map = () => {
  const { token, user } = useAuth();
  const modal = useCrudModal();
  const { success, error } = useNotification();
  const { execute: fetchMap, ...getAllMap } = useService(MapService.getAll);
  const { execute: fetchCategory, ...getAllCategory } = useService(CategoryService.getByType);
  const storeMap = useService(MapService.store);
  const updateMap = useService(MapService.update);
  const deleteMap = useService(MapService.delete);
  const deleteBatchMap = useService(MapService.deleteBatch);
  const [selectedData, setSelectedData] = useState([]);

  const pagination = usePagination({ totalData: getAllMap.totalData });

  useEffect(() => {
    fetchMap(token, pagination.page, pagination.per_page);
    fetchCategory(token, 'pemetaan');
  }, [fetchCategory, fetchMap, pagination.page, pagination.per_page, token]);

  const map = getAllMap.data ?? [];
  const category = getAllCategory.data ?? [];

  const menuItems = [
    {
      label: 'Area',
      key: 'area',
      icon: <AreaChartOutlined />
    },
    {
      label: 'Titik',
      key: 'titik',
      icon: <PushpinOutlined />
    }
  ];

  const Column = [
    {
      title: 'Nama Pemetaan',
      dataIndex: 'map_name',
      sorter: (a, b) => a.map_name.length - b.map_name.length,
      searchable: true
    },
    {
      title: 'Jenis',
      dataIndex: 'type',
      sorter: (a, b) => a.type.length - b.type.length,
      searchable: true
    },
    {
      title: 'Kategori',
      dataIndex: ['category', 'category_name'],
      sorter: (a, b) => a.category.category_name.length - b.category.category_name.length,
      searchable: true
    }
  ];

  if (user && user.eitherCan([UPDATE, MapModel], [DELETE, MapModel], [READ, MapModel])) {
    Column.push({
      title: 'Aksi',
      render: (_, record) => (
        <Space size="small">
          <Edit
            title={`Edit ${Modul.MAP}`}
            model={MapModel}
            onClick={() => {
              if (record.type === 'area') {
                modal.edit({
                  title: `Edit ${Modul.MAP}`,
                  data: { ...record, category_id: record.category.id },
                  formFields: mapFormFields({ key: 'area', options: { category } }),
                  onSubmit: async (values) => {
                    const { message, isSuccess } = await updateMap.execute(record.id, { ...values, _method: 'PUT', type: 'area' }, token, values.content.file);
                    if (isSuccess) {
                      success('Berhasil', message);
                      fetchMap(token, pagination.page, pagination.per_page);
                    } else {
                      error('Gagal', message);
                    }
                    return isSuccess;
                  }
                });
              }

              if (record.type === 'titik') {
                const [longitude, latitude] = record.content.split(',').map((coord) => coord.trim());
                modal.edit({
                  title: `Edit ${Modul.MAP}`,
                  data: { ...record, category_id: record.category.id, longitude: longitude, latitude: latitude },
                  formFields: mapFormFields({ key: 'titik', options: { category } }),
                  onSubmit: async (values) => {
                    const { message, isSuccess } = await updateMap.execute(record.id, { ...values, _method: 'PUT', type: 'titik', content: `${values.longitude}, ${values.latitude}` }, token);
                    if (isSuccess) {
                      success('Berhasil', message);
                      fetchMap(token, pagination.page, pagination.per_page);
                    } else {
                      error('Gagal', message);
                    }
                    return isSuccess;
                  }
                });
              }
            }}
          />
          <Delete
            title={`Delete ${Modul.LEGAL_PRODUCTS}`}
            model={MapModel}
            onClick={() => {
              modal.delete.default({
                title: `Delete ${Modul.LEGAL_PRODUCTS}`,
                data: { ...record, category_id: record.category.id },
                formFields: mapFormFields({ options: { category } }),
                onSubmit: async () => {
                  const { isSuccess, message } = await deleteMap.execute(record.id, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchMap(token, pagination.page, pagination.per_page);
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
      title: `Hapus ${selectedData.length} ${Modul.LEGAL_PRODUCTS} Yang Dipilih ? `,
      onSubmit: async () => {
        const ids = selectedData.map((item) => item.id);
        const { message, isSuccess } = await deleteBatchMap.execute(ids, token);
        if (isSuccess) {
          success('Berhasil', message);
          fetchMap(token);
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  const handleMenuClick = (e) => {
    modal.create({
      title: `Tambah ${Modul.MAP}`,
      formFields: mapFormFields({ key: e.key, options: { category } }),
      onSubmit: async (values) => {
        const { message, isSuccess } =
          e.key === 'titik' ? await storeMap.execute({ ...values, content: `${values.longitude}, ${values.latitude}`, type: 'titik' }, token) : await storeMap.execute({ ...values, type: 'area' }, token, values.content?.file);
        if (isSuccess) {
          success('Berhasil', message);
          fetchMap(token, pagination.page, pagination.per_page);
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };
  return (
    <div>
      {getAllMap.isLoading ? (
        <DataLoader type="datatable" />
      ) : (
        <Card>
          <Tabs type="card">
            <Tabs.TabPane tab="Data Pemetaan" key="data_pemetaan">
              <div className="mb-6">
                <Typography.Title level={5}>Data {Modul.MAP}</Typography.Title>
              </div>
              <div className="mb-6 flex flex-col-reverse justify-end gap-2 empty:hidden md:flex-row">
                <Button className="me-auto" icon={<DeleteOutlined />} variant="solid" color="danger" disabled={!selectedData?.length} onClick={onDeleteBatch}>
                  Hapus {selectedData?.length || null} Pilihan
                </Button>
                <Dropdown menu={{ items: menuItems, onClick: handleMenuClick }}>
                  <Button>
                    <Space>
                      Tambah
                      <DownOutlined />
                    </Space>
                  </Button>
                </Dropdown>
              </div>
              <div className="w-full max-w-full overflow-x-auto">
                <DataTable
                  data={map}
                  columns={Column}
                  pagination={pagination}
                  loading={getAllMap.isLoading}
                  map={(legalProducts) => ({ key: legalProducts.id, ...legalProducts })}
                  handleSelectedData={(_, selectedRows) => setSelectedData(selectedRows)}
                />
              </div>
            </Tabs.TabPane>
            <Tabs.TabPane tab="Kategori" key="data_kategori">
              <Category />
            </Tabs.TabPane>
          </Tabs>
        </Card>
      )}
    </div>
  );
};

export default Map;
