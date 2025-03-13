import { DataTable, DataTableHeader } from '@/components';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import { HamletService, ResidentService } from '@/services';
import { Card, Space, Tag } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modul from '@/constants/Modul';
import { Action, InputType } from '@/constants';
import { formFields, residentFilterFields } from './FormFields';
import { Resident as ResidentModel } from '@/models';
import { Delete, Detail, Edit } from '@/components/dashboard/button';
import dateFormatter from '@/utils/dateFormatter';

const { UPDATE, DELETE } = Action;

const Resident = () => {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const { success, error } = useNotification();
  const { execute, ...getAllResident } = useService(ResidentService.getAll);
  const { execute: fetchHamlet, ...getAllHamlet } = useService(HamletService.getAll);
  const storeResident = useService(ResidentService.store);
  const importResident = useService(ResidentService.import);
  const deleteResident = useService(ResidentService.delete);
  const deleteBatchResident = useService(ResidentService.deleteBatch);
  const [selectedResident, setSelectedResident] = useState([]);
  const modal = useCrudModal();
  const pagination = usePagination({ totalData: getAllResident.totalData });
  const [filterValues, setFilterValues] = useState({ search: '', jenis_kelamin: null, status_perkawinan: null, status_penduduk: null, hubungan_keluarga: null, dusun: null });

  const fetchResident = useCallback(() => {
    execute({
      token: token,
      page: pagination.page,
      per_page: pagination.per_page,
      search: filterValues.search,
      jenis_kelamin: filterValues.jenis_kelamin,
      status_perkawinan: filterValues.status_perkawinan,
      status_penduduk: filterValues.status_penduduk,
      hubungan_keluarga: filterValues.hubungan_keluarga,
      dusun: filterValues.dusun
    });
  }, [execute, filterValues.dusun, filterValues.hubungan_keluarga, filterValues.jenis_kelamin, filterValues.search, filterValues.status_penduduk, filterValues.status_perkawinan, pagination.page, pagination.per_page, token]);

  useEffect(() => {
    fetchResident();
    fetchHamlet({ token: token, search: '' });
  }, [fetchHamlet, fetchResident, token]);

  const resident = getAllResident.data ?? [];
  const hamlet = getAllHamlet.data ?? [];

  const exportResident = () => {
    fetch('http://desa1.api-example.govillage.id/api/master-penduduk/export?penduduk=true', {
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
        a.download = 'master_penduduk.xlsx';
        document.body.appendChild(a);
        a.click();
        a.remove();
      })
      .catch((error) => console.error('Export failed:', error));
  };

  const column = [
    {
      title: 'NIK',
      dataIndex: 'nik',
      sorter: (a, b) => a.nik.length - b.nik.length,
      searchable: true
    },
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
    }
  ];

  if (user && user.eitherCan([UPDATE, ResidentModel], [DELETE, ResidentModel])) {
    column.push({
      title: 'Aksi',
      render: (_, record) => (
        <Space size="small">
          <Edit
            model={ResidentModel}
            title={`Edit ${Modul.RESIDENTIAL}`}
            onClick={() => {
              navigate(window.location.pathname + '/edit/' + record.id);
            }}
          />
          <Detail
            model={ResidentModel}
            title={`Detail ${Modul.RESIDENTIAL}`}
            onClick={() => {
              navigate(window.location.pathname + '/detail/' + record.id);
            }}
          />
          <Delete
            model={ResidentModel}
            title={`Delete ${Modul.RESIDENTIAL}`}
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
    });
  }

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

  const onCreate = () => {
    modal.create({
      title: `Tambah ${Modul.RESIDENTIAL} `,
      formFields: formFields,
      onSubmit: async (values) => {
        const { message, isSuccess } = await storeResident.execute({ ...values, birth: { birth_date: dateFormatter(values.birth_date), akta_kelahiran_number: values.akta_kelahiran_number, birth_place: values.birth_place } }, token);
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

  const filter = {
    formFields: residentFilterFields({ options: { hamlet } }),
    initialData: {
      jenis_kelamin: filterValues.jenis_kelamin,
      status_perkawinan: filterValues.status_perkawinan,
      status_penduduk: filterValues.status_penduduk,
      hubungan_keluarga: filterValues.hubungan_keluarga,
      dusun: filterValues.dusun
    },
    isLoading: getAllResident.isLoading,
    onSubmit: (values) => {
      setFilterValues({
        jenis_kelamin: values.jenis_kelamin,
        status_perkawinan: values.status_perkawinan,
        status_penduduk: values.status_penduduk,
        hubungan_keluarga: values.hubungan_keluarga,
        dusun: values.dusun
      });
    }
  };

  console.log(hamlet);

  return (
    <Card>
      <DataTableHeader
        modul={Modul.RESIDENTIAL}
        model={ResidentModel}
        onDeleteBatch={onDeleteBatch}
        onStore={onCreate}
        onExport={exportResident}
        onImport={onImport}
        selectedData={selectedResident}
        onSearch={(values) => setFilterValues({ ...filterValues, search: values })}
        filter={filter}
      />
      <div className="w-full max-w-full overflow-x-auto">
        <DataTable data={resident} columns={column} loading={getAllResident.isLoading} map={(article) => ({ key: article.id, ...article })} handleSelectedData={(_, selectedRows) => setSelectedResident(selectedRows)} pagination={pagination} />
      </div>
    </Card>
  );
};

export default Resident;
