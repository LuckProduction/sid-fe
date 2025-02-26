import { DataLoader, DataTable, DataTableHeader } from '@/components';
import Modul from '@/constants/Modul';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import { OfficerService } from '@/services';
import { Card, Space } from 'antd';
import { useEffect, useState } from 'react';
import { Officer as OfficerModel } from '@/models';
import { userFormFields } from './FormFields';
import { Delete, Detail, Edit } from '@/components/dashboard/button';

const User = () => {
  const { token } = useAuth();
  const modal = useCrudModal();
  const { success, error } = useNotification();
  const { execute: fetchUsers, ...getAllUsers } = useService(OfficerService.getAll);
  const { execute: fetchPermission, ...getAllPermission } = useService(OfficerService.getAllPermision);
  const storeUser = useService(OfficerService.store);
  const updateUser = useService(OfficerService.update);
  const deleteUser = useService(OfficerService.delete);
  const deleteBatchUser = useService(OfficerService.deleteBatch);

  const pagination = usePagination({ totalData: getAllUsers.totalData });

  const [selectedArticle, setSelectedArticle] = useState([]);

  useEffect(() => {
    fetchUsers(token, pagination.page, pagination.perPage);
    fetchPermission({ token: token, page: pagination.page, perPage: pagination.perPage, id: 1 });
  }, [fetchPermission, fetchUsers, pagination.page, pagination.perPage, token]);

  const user = (getAllUsers.data ?? []).filter((item) => item.name !== 'admin');
  const permission = getAllPermission.data ?? [];

  const column = [
    {
      title: 'Nama',
      dataIndex: 'name',
      sorter: (a, b) => a.name.length - b.name.length,
      searchable: true
    },
    {
      title: 'Email',
      dataIndex: 'email',
      sorter: (a, b) => a.email.length - b.email.length,
      searchable: true
    },
    {
      title: 'Role',
      dataIndex: ['role', 'name'],
      sorter: (a, b) => a.role.name.length - b.role.name.length,
      searchable: true
    }
  ];

  if (user) {
    column.push({
      title: 'Aksi',
      render: (_, record) => (
        <Space size="small">
          <Edit
            title={`Edit ${Modul.USERS}`}
            model={OfficerModel}
            onClick={() => {
              modal.edit({
                title: `Edit ${Modul.LEGAL_PRODUCTS}`,
                data: { ...record, role: record.role.id },
                formFields: userFormFields({ options: { permission } }),
                onSubmit: async (values) => {
                  const { message, isSuccess } = await updateUser.execute(record.id, { ...values, _method: 'PUT' }, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchUsers(token, pagination.page, pagination.perPage);
                  } else {
                    error('Gagal', message);
                  }
                  return isSuccess;
                }
              });
            }}
          />
          <Detail
            title={`Detail ${Modul.USERS}`}
            model={OfficerModel}
            onClick={() => {
              modal.show.description({
                title: record.name,
                data: [
                  {
                    key: 'name',
                    label: `Nama ${Modul.USERS}`,
                    children: record.name
                  },
                  {
                    key: 'email',
                    label: `Email`,
                    children: record.email
                  },
                  {
                    key: 'role',
                    label: `Role`,
                    children: record.role.name
                  },
                  {
                    key: 'permission',
                    label: `Permission`,
                    children: record.permissions.map((item) => `${item} ,`)
                  }
                ]
              });
            }}
          />

          <Delete
            title={`Delete ${Modul.USERS}`}
            model={OfficerModel}
            onClick={() => {
              modal.delete.default({
                title: `Delete ${Modul.LEGAL_PRODUCTS}`,
                data: { ...record, role: record.role.id },
                formFields: userFormFields({ options: { permission } }),
                onSubmit: async () => {
                  const { isSuccess, message } = await deleteUser.execute(record.id, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchUsers(token, pagination.page, pagination.perPage);
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
      title: `Hapus ${selectedArticle.length} ${Modul.USERS} Yang Dipilih ? `,
      onSubmit: async () => {
        const ids = selectedArticle.map((item) => item.id);
        const { message, isSuccess } = await deleteBatchUser.execute(ids, token);
        if (isSuccess) {
          success('Berhasil', message);
          fetchUsers(token, pagination.page, pagination.perPage);
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  const onCreate = () => {
    modal.create({
      title: `Tambah ${Modul.USERS}`,
      formFields: userFormFields({ options: { permission } }),
      onSubmit: async (values) => {
        const { message, isSuccess } = await storeUser.execute({ ...values, password: "12345678" }, token);
        if (isSuccess) {
          success('Berhasil', message);
          fetchUsers(token, pagination.page, pagination.perPage);
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  return (
    <>
      {getAllUsers.isLoading ? (
        <DataLoader type="datatable" />
      ) : (
        <Card>
          <DataTableHeader model={OfficerModel} modul={Modul.USERS} onStore={onCreate} onDeleteBatch={onDeleteBatch} selectedData={selectedArticle} />
          <div className="w-full max-w-full overflow-x-auto">
            <DataTable data={user} columns={column} loading={getAllUsers.isLoading} map={(article) => ({ key: article.id, ...article })} pagination={pagination} handleSelectedData={(_, selectedRows) => setSelectedArticle(selectedRows)} />
          </div>
        </Card>
      )}
    </>
  );
};

export default User;
