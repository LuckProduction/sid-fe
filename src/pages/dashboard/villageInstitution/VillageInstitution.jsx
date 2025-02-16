import { DataLoader, DataTable, DataTableHeader } from '@/components';
import Modul from '@/constants/Modul';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import { VillageInstitutionService } from '@/services';
import { Button, Card, Space, Tag } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { formFields } from './FormFields';
import { useNavigate } from 'react-router-dom';
import { Action } from '@/constants';
import { Delete, Detail, Edit } from '@/components/dashboard/button';
import { VillageInstitution as VillageInstitutionModel } from '@/models';
import { DatabaseOutlined } from '@ant-design/icons';

const { DELETE, UPDATE, READ } = Action;

const VillageInstitution = () => {
  const { token, user } = useAuth();
  const { success, error } = useNotification();
  const modal = useCrudModal();
  const navigate = useNavigate();
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
      fetchFn(token, pagination.page, pagination.perPage);
    }, [fetchFn, pagination.page, pagination.perPage]);
  };

  const villageInstitutionService = useCrudService(VillageInstitutionService);

  const fetchVillageInstitution = useFetchData(villageInstitutionService.fetch, villageInstitutionService.pagination);

  useEffect(() => {
    fetchVillageInstitution();
  }, [fetchVillageInstitution]);

  const villageInstitution = villageInstitutionService.getAll.data ?? [];
  const [selectedData, setSelectedData] = useState([]);

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
    }
  ];

  if (user && user.eitherCan([UPDATE, VillageInstitutionModel], [DELETE, VillageInstitutionModel], [READ, VillageInstitutionModel])) {
    Column.push({
      title: 'Aksi',
      render: (_, record) => (
        <Space size="small">
          <Edit
            title={`Edit ${Modul.VILLAGE_INSTITUTION}`}
            model={VillageInstitutionModel}
            onClick={() => {
              modal.edit({
                title: `Edit ${Modul.VILLAGE_INSTITUTION}`,
                data: record,
                formFields: formFields,
                onSubmit: async (values) => {
                  const { message, isSuccess } = await villageInstitutionService.update.execute(record.id, { ...values, _method: 'PUT' }, token);
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
          <Detail
            title={`Detail ${Modul.VILLAGE_INSTITUTION}`}
            model={VillageInstitutionModel}
            onClick={() => {
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
          <Delete
            title={`Delete ${Modul.VILLAGE_INSTITUTION}`}
            model={VillageInstitutionModel}
            onClick={() => {
              modal.delete.default({
                title: `Delete ${Modul.VILLAGE_INSTITUTION}`,
                data: record,
                formFields: formFields,
                onSubmit: async () => {
                  const { isSuccess, message } = await villageInstitutionService.delete.execute(record.id, token);
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
          <Button icon={<DatabaseOutlined />} variant="solid" color="geekblue" onClick={() => navigate(window.location.pathname + `/${record.id}/institution_member`)} />
        </Space>
      )
    });
  }

  const onDeleteBatch = () => {
    modal.delete.batch({
      title: `Hapus ${selectedData.length} ${Modul.VILLAGE_INSTITUTION} Yang Dipilih ? `,
      formFields: formFields,
      onSubmit: async () => {
        const ids = selectedData.map((item) => item.id);
        const { message, isSuccess } = await villageInstitutionService.deleteBatch.execute(ids, token);
        if (isSuccess) {
          success('Berhasil', message);
          fetchVillageInstitution(token);
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  const onCreate = () => {
    modal.create({
      title: `Tambah ${Modul.VILLAGE_INSTITUTION}`,
      formFields: formFields,
      onSubmit: async (values) => {
        const { message, isSuccess } = await villageInstitutionService.store.execute(values, token);
        if (isSuccess) {
          success('Berhasil', message);
          fetchVillageInstitution(token);
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  return (
    <div>
      {villageInstitutionService.getAll.isLoading ? (
        <DataLoader type="datatable" />
      ) : (
        <Card>
          <DataTableHeader model={VillageInstitutionModel} modul={Modul.VILLAGE_INSTITUTION} onStore={onCreate} onDeleteBatch={onDeleteBatch} selectedData={selectedData} />
          <div className="w-full max-w-full overflow-x-auto">
            <DataTable
              data={villageInstitution}
              columns={Column}
              loading={villageInstitutionService.getAll.isLoading}
              map={(category) => ({ key: category.id, ...category })}
              handleSelectedData={(_, selectedRows) => setSelectedData(selectedRows)}
              pagination={villageInstitutionService.pagination}
            />
          </div>
        </Card>
      )}
    </div>
  );
};

export default VillageInstitution;
