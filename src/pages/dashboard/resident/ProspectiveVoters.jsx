import { DataTable, DataTableHeader } from '@/components';
import Modul from '@/constants/Modul';
import { useAuth, usePagination, useService } from '@/hooks';
import { ResidentService } from '@/services';
import { Button, Card, Tag } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { Resident as ResidentModel } from '@/models';
import { InfoOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dateFormatter from '@/utils/dateFormatter';
import { ProspectiveVotersFilterFields } from './FormFields';
import dayjs from 'dayjs';

const ProspectiveVoters = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { execute: fetchProspectiveVoter, ...getAllProspectiveVoter } = useService(ResidentService.getProspectiveVoter);
  const pagination = usePagination({ totalData: getAllProspectiveVoter.totalData });

  const [filterValues, setFilterValues] = useState({
    tanggal_pemilu: null
  });

  const fetchData = useCallback(() => {
    fetchProspectiveVoter({
      token,
      page: pagination.page,
      per_page: pagination.per_page,
      tanggal_pemilu: filterValues.tanggal_pemilu ? dateFormatter(filterValues.tanggal_pemilu) : ''
    });
  }, [fetchProspectiveVoter, token, pagination.page, pagination.per_page, filterValues.tanggal_pemilu]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const prospectiveVoter = getAllProspectiveVoter.data ?? [];

  const exportProspectiveVoters = () => {
    fetch('http://desa1.api-example.govillage.id/api/master-penduduk/export?calon_pemilih=true', {
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
      render: (_, record) => <Button icon={<InfoOutlined />} variant="outlined" color="green" onClick={() => navigate('/dashboard/residential/detail/' + record.id)} />
    }
  ];

  const filter = {
    formFields: ProspectiveVotersFilterFields(),
    initialData: {
      tanggal_pemilu: filterValues.tanggal_pemilu
    },
    isLoading: getAllProspectiveVoter.isLoading,
    onSubmit: (values) => {
      setFilterValues({
        tanggal_pemilu: values.tanggal_pemilu ? dayjs(values.tanggal_pemilu) : null
      });
    }
  };

  return (
    <>
      <Card>
        <DataTableHeader modul={Modul.PROSPECTIVE_VOTER} model={ResidentModel} onExport={exportProspectiveVoters} filter={filter} />
        <div className="w-full max-w-full overflow-x-auto">
          <DataTable data={prospectiveVoter} columns={column} loading={getAllProspectiveVoter.isLoading} map={(article) => ({ key: article.id, ...article })} pagination={pagination} />
        </div>
      </Card>
    </>
  );
};

export default ProspectiveVoters;
