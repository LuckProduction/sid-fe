import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import { ComunityService, OfficerService, WebSettingsService } from '@/services';
import { Button, Card, Popconfirm, Result, Space, Switch } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import Modul from '@/constants/Modul';
import { Comunity as ComunityModel } from '@/models';
import { Delete, Detail } from '@/components/dashboard/button';
import { comunityFormFields } from './FormFields';
import { DataTable, DataTableHeader } from '@/components';
import { LockOutlined } from '@ant-design/icons';
import { Action } from '@/constants';

const { DELETE, UPDATE, READ } = Action;

const Comunity = () => {
  const { token, user } = useAuth();
  const modal = useCrudModal();
  const { success, error } = useNotification();
  const { execute, ...getAllComunity } = useService(ComunityService.getAll);
  const { execute: fetchWebSettings, ...getAllWebaSettings } = useService(WebSettingsService.getBySlug);
  const deleteComunity = useService(ComunityService.delete);
  const deleteBatchComunity = useService(ComunityService.deleteBatch);
  const updateComunity = useService(ComunityService.update);
  const resetPassword = useService(OfficerService.resetPassword);
  const givePermission = useService(ComunityService.givePermission);
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
    fetchWebSettings('gunakan_tanda_tangan_digital', token);
  }, [fetchComunity, fetchWebSettings, token]);

  const comunity = getAllComunity.data ?? [];
  const webSettings = getAllWebaSettings.data ?? {};

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

  if (user && user.eitherCan([UPDATE, ComunityModel], [DELETE, ComunityModel], [READ, ComunityModel])) {
    if (webSettings.value === 'Perlu Verifikasi Mobile oleh Kepala Desa') {
      column.push({
        title: 'Akses',
        render: (_, record) => (
          <Space size="small">
            <Popconfirm
              title={record.permission.includes('verifikasi_surat') ? 'Hapus Permission' : 'Berikan Permission'}
              description="Konfirmasi Tindakan?"
              onConfirm={async () => {
                const { isSuccess, message } = await givePermission.execute(record.id, token);
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
              <Button loading={resetPassword.isLoading} icon={<LockOutlined />} variant="outlined" color={record?.permission?.includes('verifikasi_surat') ? 'default' : 'primary'}></Button>
            </Popconfirm>
          </Space>
        )
      });
    }
    column.push(
      {
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
      },
      {
        title: 'Aktif/Non-Aktif',
        render: (_, record) => (
          <Switch
            checked={record.status === 'aktif' ? true : false}
            onChange={() => {
              modal.show.paragraph({
                data: {
                  content: (
                    <Result
                      title="Ubah Status ?"
                      subTitle="Tindakan ini akan mengubah status pengguna masyarakat"
                      extra={[
                        <Button key="buy" onClick={() => modal.close()}>
                          Batal
                        </Button>,
                        <Button
                          type="primary"
                          key="console"
                          onClick={async () => {
                            const { isSuccess, message } = await updateComunity.execute(record.id, { status: record.status === 'aktif' ? 'nonaktif' : 'aktif' }, token);
                            if (isSuccess) {
                              success('Berhasil', message);
                              fetchComunity({ token: token, page: pagination.page, per_page: pagination.per_page });
                              modal.close();
                            } else {
                              error('Gagal', message);
                              modal.close();
                            }
                            return isSuccess;
                          }}
                        >
                          Ubah
                        </Button>
                      ]}
                    />
                  )
                }
              });
            }}
          />
        )
      }
    );
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
