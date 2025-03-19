import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import { ComunityService, OfficerService } from '@/services';
import { Button, Card, Popconfirm, Space } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import Modul from '@/constants/Modul';
import { Comunity as ComunityModel } from '@/models';
import { Delete, Detail } from '@/components/dashboard/button';
import { comunityFormFields } from './FormFields';
import { DataTable, DataTableHeader } from '@/components';
import { LockOutlined } from '@ant-design/icons';

const Comunity = () => {
  const { token } = useAuth();
  const modal = useCrudModal();
  const { success, error } = useNotification();
  const { execute, ...getAllComunity } = useService(ComunityService.getAll);
  const deleteComunity = useService(ComunityService.delete);
  const deleteBatchComunity = useService(ComunityService.deleteBatch);
  const resetPassword = useService(OfficerService.resetPassword);
  const [filterValues, setFilterValues] = useState({ search: '' });

  const pagination = usePagination({ totalData: getAllComunity.totalData });

  const [selectedArticle, setSelectedArticle] = useState([]);

  const fetchComunity = useCallback(() => {
    execute({
      token: token,
      page: pagination.page,
      per_page: pagination.per_page,
      search: filterValues.search
    });
  }, [execute, filterValues.search, pagination.page, pagination.per_page, token]);

  useEffect(() => {
    fetchComunity();
  }, [fetchComunity]);

  const comunity = getAllComunity.data ?? [];

  const column = [
    {
      title: 'NIK',
      dataIndex: ['resident', 'nik'],
      sorter: (a, b) => a.resident.nik.length - b.resident.nik.length,
      searchable: true
    },
    {
      title: 'Nama',
      dataIndex: ['resident', 'full_name'],
      sorter: (a, b) => a.resident.full_name.length - b.resident.full_name.length,
      searchable: true
    },
    {
      title: 'Email',
      dataIndex: ['user_id', 'email'],
      sorter: (a, b) => a.user_id.email.length - b.user_id.email.length,
      searchable: true
    }
  ];

  if (comunity) {
    column.push({
      title: 'Aksi',
      render: (_, record) => (
        <Space size="small">
          <Detail
            title={`Detail ${Modul.COMUNITY}`}
            model={ComunityModel}
            onClick={() => {
              modal.show.description({
                title: record.resident.full_name,
                data: [
                  {
                    key: 'nik',
                    label: `NIK`,
                    children: record.resident.nik
                  },
                  {
                    key: 'name',
                    label: `Nama`,
                    children: record.resident.full_name
                  },
                  {
                    key: 'family_relation',
                    label: `Hubungan Keluarga`,
                    children: record.resident.family_relation
                  },
                  {
                    key: 'resident_status',
                    label: `Status Kependudukan`,
                    children: record.resident.resident_status
                  },
                  {
                    key: 'marital_status',
                    label: `Status Perkawinan`,
                    children: record.resident.marital_status
                  },
                  {
                    key: 'kk_number',
                    label: `Nomor KK`,
                    children: record.resident.kk_number
                  },
                  {
                    key: 'gender',
                    label: `Jenis Kelamin`,
                    children: record.resident.gender
                  },
                  {
                    key: 'religion',
                    label: `Agama`,
                    children: record.resident.religion
                  },
                  {
                    key: 'email',
                    label: `Email`,
                    children: record.user_id.email
                  }
                ]
              });
            }}
          />

          <Delete
            title={`Delete ${Modul.COMUNITY}`}
            model={ComunityModel}
            onClick={() => {
              modal.delete.default({
                title: `Delete ${Modul.COMUNITY}`,
                data: { ...record, name: record.resident.full_name, email: record.user_id.email },
                formFields: comunityFormFields(),
                onSubmit: async () => {
                  const { isSuccess, message } = await deleteComunity.execute(record.id, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchComunity({ token: token, page: pagination.page, per_page: pagination.per_page });
                  } else {
                    error('Gagal', message);
                  }
                  return isSuccess;
                }
              });
            }}
          />
          <Popconfirm
            title="Reset Passowrd"
            description="Reset Password Pengguna?"
            onConfirm={async () => {
              const { isSuccess, message } = await resetPassword.execute(token, record.user_id.id);
              if (isSuccess) {
                success('Berhasil', message);
                fetchComunity({ token: token, page: pagination.page, per_page: pagination.per_page });
              } else {
                error('Gagal', message);
              }
              return isSuccess;
            }}
            okText="Ok"
            cancelText="Batal"
          >
            <Button loading={resetPassword.isLoading} icon={<LockOutlined />} danger></Button>
          </Popconfirm>
        </Space>
      )
    });
  }

  const onDeleteBatch = () => {
    modal.delete.batch({
      title: `Hapus ${selectedArticle.length} ${Modul.COMUNITY} Yang Dipilih ? `,
      onSubmit: async () => {
        const ids = selectedArticle.map((item) => item.id);
        const { message, isSuccess } = await deleteBatchComunity.execute(ids, token);
        if (isSuccess) {
          success('Berhasil', message);
          fetchComunity({ token: token, page: pagination.page, per_page: pagination.per_page });
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  return (
    <>
      <Card>
        <DataTableHeader model={ComunityModel} modul={Modul.COMUNITY} onDeleteBatch={onDeleteBatch} selectedData={selectedArticle} onSearch={(values) => setFilterValues({ search: values })} />
        <div className="w-full max-w-full overflow-x-auto">
          <DataTable data={comunity} columns={column} loading={getAllComunity.isLoading} map={(article) => ({ key: article.id, ...article })} pagination={pagination} handleSelectedData={(_, selectedRows) => setSelectedArticle(selectedRows)} />
        </div>
      </Card>
    </>
  );
};

export default Comunity;
