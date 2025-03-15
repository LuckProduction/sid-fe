import { DataTable, DataTableHeader } from '@/components';
import { useAuth, usePagination, useService } from '@/hooks';
import { HamletService, ResidentService } from '@/services';
import { Button, Card, Tag } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import Modul from '@/constants/Modul';
import { Resident as ResidentModel } from '@/models';
import { DatabaseOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { residentFilterFields } from './FormFields';

const Family = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { execute, ...getAllFamily } = useService(ResidentService.getFamily);
  const { execute: fetchHamlet, ...getAllHamlet } = useService(HamletService.getAll);
  const [filterValues, setFilterValues] = useState({ search: '', jenis_kelamin: null, status_perkawinan: null, status_penduduk: null, hubungan_keluarga: null, dusun_id: null });
  const pagination = usePagination({ totalData: getAllFamily.totalData });

  const fetchFamily = useCallback(() => {
    execute({
      token: token,
      page: pagination.page,
      per_page: pagination.per_page,
      search: filterValues.search,
      jenis_kelamin: filterValues.jenis_kelamin,
      status_perkawinan: filterValues.status_perkawinan,
      status_penduduk: filterValues.status_penduduk,
      hubungan_keluarga: filterValues.hubungan_keluarga,
      dusun_id: filterValues.dusun_id
    });
  }, [execute, filterValues.dusun_id, filterValues.hubungan_keluarga, filterValues.jenis_kelamin, filterValues.search, filterValues.status_penduduk, filterValues.status_perkawinan, pagination.page, pagination.per_page, token]);

  useEffect(() => {
    fetchFamily();
    fetchHamlet({ token: token, search: '' });
  }, [fetchFamily, fetchHamlet, token]);

  const family = getAllFamily.data ?? [];
  const hamlet = getAllHamlet.data ?? [];

  const exportFamily = () => {
    fetch('http://desa1.api-example.govillage.id/api/master-penduduk/export?keluarga=true', {
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
        a.download = 'master_keluarga.xlsx';
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
      render: (_, record) => <Button icon={<DatabaseOutlined />} variant="solid" color="geekblue" onClick={() => navigate(window.location.pathname + `/${record.id}/detail`)} />
    }
  ];

  const filter = {
    formFields: residentFilterFields({ options: { hamlet } }),
    initialData: {
      jenis_kelamin: filterValues.jenis_kelamin,
      status_perkawinan: filterValues.status_perkawinan,
      status_penduduk: filterValues.status_penduduk,
      hubungan_keluarga: filterValues.hubungan_keluarga,
      dusun_id: filterValues.dusun_id
    },
    isLoading: getAllFamily.isLoading,
    onSubmit: (values) => {
      setFilterValues({
        jenis_kelamin: values.jenis_kelamin,
        status_perkawinan: values.status_perkawinan,
        status_penduduk: values.status_penduduk,
        hubungan_keluarga: values.hubungan_keluarga,
        dusun_id: values.dusun_id
      });
    }
  };

  return (
    <Card>
      <DataTableHeader modul={Modul.FAMILY} model={ResidentModel} onExport={exportFamily} filter={filter} onSearch={(values) => setFilterValues({ ...filterValues, search: values })} />
      <div className="w-full max-w-full overflow-x-auto">
        <DataTable data={family} columns={column} loading={getAllFamily.isLoading} map={(article) => ({ key: article.id, ...article })} pagination={pagination} />
      </div>
    </Card>
  );
};

export default Family;
