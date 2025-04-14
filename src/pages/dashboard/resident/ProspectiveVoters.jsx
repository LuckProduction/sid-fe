import { DataTable, DataTableHeader } from '@/components';
import Modul from '@/constants/Modul';
import { useAuth, usePagination, useService } from '@/hooks';
import { HamletService, ResidentService } from '@/services';
import { Button, Card, Tag } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { Resident as ResidentModel } from '@/models';
import { InfoOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dateFormatter from '@/utils/dateFormatter';
import { ProspectiveVotersFilterFields } from './FormFields';
import dayjs from 'dayjs';
import { BASE_URL } from '@/utils/api';

const ProspectiveVoters = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { execute: fetchProspectiveVoter, ...getAllProspectiveVoter } = useService(ResidentService.getProspectiveVoter);
  const { execute: fetchHamlet, ...getAllHamlet } = useService(HamletService.getAll);
  const pagination = usePagination({ totalData: getAllProspectiveVoter.totalData });

  const [filterValues, setFilterValues] = useState({
    search: '',
    tanggal_pemilu: null,
    jenis_kelamin: null,
    status_perkawinan: null,
    status_penduduk: null,
    hubungan_keluarga: null,
    dusun_id: null
  });

  const fetchData = useCallback(() => {
    fetchProspectiveVoter({
      token,
      page: pagination.page,
      per_page: pagination.per_page,
      tanggal_pemilu: filterValues.tanggal_pemilu ? dateFormatter(filterValues.tanggal_pemilu) : '',
      search: filterValues.search,
      jenis_kelamin: filterValues.jenis_kelamin,
      status_perkawinan: filterValues.status_perkawinan,
      status_penduduk: filterValues.status_penduduk,
      hubungan_keluarga: filterValues.hubungan_keluarga,
      dusun_id: filterValues.dusun_id
    });
  }, [
    fetchProspectiveVoter,
    token,
    pagination.page,
    pagination.per_page,
    filterValues.tanggal_pemilu,
    filterValues.search,
    filterValues.jenis_kelamin,
    filterValues.status_perkawinan,
    filterValues.status_penduduk,
    filterValues.hubungan_keluarga,
    filterValues.dusun_id
  ]);

  useEffect(() => {
    fetchData();
    fetchHamlet({ token: token });
  }, [fetchData, fetchHamlet, token]);

  const prospectiveVoter = getAllProspectiveVoter.data ?? [];
  const hamlet = getAllHamlet.data ?? [];

  const exportProspectiveVoters = () => {
    fetch(`${BASE_URL}/master-penduduk/export?calon_pemilih=true`, {
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
        a.download = 'master_calon_pemilih.xlsx';
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
          case 'aktif':
            return <Tag color="blue-inverse">Aktif</Tag>;
          case 'meninggal':
            return <Tag color="red">Meninggal</Tag>;
          case 'pindah':
            return <Tag color="warning">Pindah</Tag>;
          case 'masuk':
            return <Tag color="green-inverse">Masuk</Tag>;
          default:
            return <Tag color="default">Undifined</Tag>;
        }
      }
    },
    {
      title: 'Aksi',
      render: (_, record) => <Button icon={<InfoOutlined />} variant="outlined" color="green" onClick={() => navigate('/dashboard/residential/detail/' + record.id)} />
    }
  ];

  const filter = {
    formFields: ProspectiveVotersFilterFields({ options: { hamlet } }),
    initialData: {
      tanggal_pemilu: filterValues.tanggal_pemilu,
      jenis_kelamin: filterValues.jenis_kelamin,
      status_perkawinan: filterValues.status_perkawinan,
      status_penduduk: filterValues.status_penduduk,
      hubungan_keluarga: filterValues.hubungan_keluarga,
      dusun_id: filterValues.dusun_id
    },
    isLoading: getAllProspectiveVoter.isLoading,
    onSubmit: (values) => {
      setFilterValues({
        tanggal_pemilu: values.tanggal_pemilu ? dayjs(values.tanggal_pemilu) : null,
        jenis_kelamin: values.jenis_kelamin,
        status_perkawinan: values.status_perkawinan,
        status_penduduk: values.status_penduduk,
        hubungan_keluarga: values.hubungan_keluarga,
        dusun_id: values.dusun_id
      });
    }
  };

  return (
    <>
      <Card>
        <DataTableHeader modul={Modul.PROSPECTIVE_VOTER} model={ResidentModel} onExport={exportProspectiveVoters} filter={filter} onSearch={(values) => setFilterValues({ ...filterValues, search: values })} />
        <div className="w-full max-w-full overflow-x-auto">
          <DataTable data={prospectiveVoter} columns={column} loading={getAllProspectiveVoter.isLoading} map={(article) => ({ key: article.id, ...article })} pagination={pagination} />
        </div>
      </Card>
    </>
  );
};

export default ProspectiveVoters;
