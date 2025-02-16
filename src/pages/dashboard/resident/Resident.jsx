import { DataLoader, DataTable, DataTableHeader } from '@/components';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import { ResidentService } from '@/services';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Card, Space, Tag } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modul from '@/constants/Modul';
import { InputType } from '@/constants';
import { formFields } from './FormFields';

const Resident = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const { success, error } = useNotification();
  const { execute, ...getAllResident } = useService(ResidentService.getAll);
  const storeResident = useService(ResidentService.store);
  const importResident = useService(ResidentService.import);
  const deleteResident = useService(ResidentService.delete);
  const deleteBatchResident = useService(ResidentService.deleteBatch);
  const [selectedResident, setSelectedResident] = useState([]);
  const modal = useCrudModal();
  const pagination = usePagination({ totalData: getAllResident.totalData });

  const fetchResident = useCallback(() => {
    execute({ token: token, page: pagination.page, perPage: pagination.perPage });
  }, [execute, pagination.page, pagination.perPage, token]);

  useEffect(() => {
    fetchResident();
  }, [fetchResident]);

  const resident = getAllResident.data ?? [];

  const exportResident = () => {
    fetch('http://127.0.0.1:8000/api/master-penduduk/export', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }
    })
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'users.xlsx';
        document.body.appendChild(a);
        a.click();
        a.remove();
      })
      .catch((error) => console.error('Export failed:', error));
  };

  const column = [
    {
      title: 'Nama Lengkap',
      dataIndex: 'full_name',
      sorter: (a, b) => a.full_name.length - b.full_name.length,
      searchable: true
    },
    {
      title: 'Jenis Kelamin',
      dataIndex: 'gender',
      sorter: (a, b) => a.gender.length - b.gender.length,
      searchable: true
    },
    {
      title: 'Hubungan Keluarga',
      dataIndex: 'family_relation',
      sorter: (a, b) => a.family_relation.length - b.family_relation.length,
      searchable: true
    },
    {
      title: 'Status',
      dataIndex: 'resident_status',
      sorter: (a, b) => a.resident_status.length - b.resident_status.length,
      searchable: true,
      render: (record) => {
        switch (record) {
          case 'tetap':
            return <Tag color="blue">Tetap</Tag>;
          case 'tidak tetap':
            return <Tag color="green">Tidak Tetap</Tag>;
          default:
            return <Tag color="error">Undifined</Tag>;
        }
      }
    },
    {
      title: 'Aksi',
      render: (_, record) => (
        <Space size="small">
          <Button
            icon={<EditOutlined />}
            variant="outlined"
            color="primary"
            onClick={() => {
              navigate(window.location.pathname + '/edit/' + record.id);
            }}
          />
          <Button
            icon={<DeleteOutlined />}
            variant="outlined"
            color="danger"
            onClick={() => {
              modal.delete.default({
                title: `Delete ${Modul.RESIDENTIAL}`,
                data: record,
                formFields: formFields,
                onSubmit: async () => {
                  const { isSuccess, message } = await deleteResident.execute(record.id, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchResident(token);
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

  const onDeleteBatch = () => {
    modal.delete.batch({
      title: `Hapus ${selectedResident.length} ${Modul.RESIDENTIAL} Yang Dipilih ? `,
      onSubmit: async () => {
        const ids = selectedResident.map((item) => item.id);
        const { message, isSuccess } = await deleteBatchResident.execute(ids, token);
        if (isSuccess) {
          success('Berhasil', message);
          fetchResident(token);
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  const onImport = () => {
    modal.create({
      formFields: [
        {
          label: `File ${Modul.RESIDENTIAL} `,
          name: 'file',
          type: InputType.UPLOAD,
          max: 1,
          beforeUpload: () => {
            return false;
          },
          getFileList: (data) => {
            return [
              {
                url: data?.file,
                name: data?.name
              }
            ];
          },
          accept: ['.xlsx'],
          rules: [{ required: true, message: 'Logo harus diisi' }]
        }
      ],
      title: `Import ${Modul.RESIDENTIAL} `,
      onSubmit: async (values) => {
        const { message, isSuccess } = await importResident.execute(values, token, values.file.file);
        if (isSuccess) {
          success('Berhasil', message);
          fetchResident(token);
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  const onExport = () => {
    const { message, isSuccess } = exportResident();
    if (isSuccess) {
      success('Berhasil', message);
      fetchResident(token);
    } else {
      error('Gagal', message);
    }
    return isSuccess;
  };

  const onCreate = () => {
    modal.create({
      title: `Tambah ${Modul.RESIDENTIAL} `,
      formFields: formFields,
      onSubmit: async (values) => {
        const { message, isSuccess } = await storeResident.execute(values, token);
        if (isSuccess) {
          success('Berhasil', message);
          fetchResident(token);
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  return (
    <>
      {getAllResident.isLoading ? (
        <DataLoader type="datatable" />
      ) : (
        <Card>
          <DataTableHeader modul={Modul.RESIDENTIAL} onCreate={onCreate} onDeleteBatch={onDeleteBatch} onExport={onExport} onImport={onImport} selectedData={selectedResident} />
          <div className="w-full max-w-full overflow-x-auto">
            <DataTable data={resident} columns={column} loading={getAllResident.isLoading} map={(article) => ({ key: article.id, ...article })} handleSelectedData={(_, selectedRows) => setSelectedResident(selectedRows)} pagination={pagination} />
          </div>
        </Card>
      )}
    </>
  );
};

export default Resident;
