import { DataLoader, DataTable, DataTableHeader } from '@/components';
import Modul from '@/constants/Modul';
import { useAuth, useNotification, usePagination, useService } from '@/hooks';
import { ProspectiveVotersService } from '@/services';
import { Card, Tag } from 'antd';
import { useEffect } from 'react';
import { Resident as ResidentModel } from '@/models';

const ProspectiveVoters = () => {
  const { token } = useAuth();
  const { success, error } = useNotification();
  const { execute: fetchProspectiveVoter, ...getAllProspectiveVoter } = useService(ProspectiveVotersService.getAll);
  const pagination = usePagination({ totalData: getAllProspectiveVoter.totalData });

  useEffect(() => {
    fetchProspectiveVoter(token, pagination.page, pagination.perPage);
  }, [fetchProspectiveVoter, pagination.page, pagination.perPage, token]);

  const prospectiveVoter = getAllProspectiveVoter.data ?? [];

  const exportProspectiveVoters = () => {
    fetch('http://desa1.localhost:8000/api/master-penduduk/export?calon_pemilih=true', {
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
    }
  ];

  const onExport = () => {
    const { message, isSuccess } = exportProspectiveVoters();
    if (isSuccess) {
      success('Berhasil', message);
      fetchProspectiveVoter(token);
    } else {
      error('Gagal', message);
    }
    return isSuccess;
  };

  return (
    <>
      {getAllProspectiveVoter.isLoading ? (
        <DataLoader type="datatable" />
      ) : (
        <Card>
          <DataTableHeader modul={Modul.PROSPECTIVE_VOTER} model={ResidentModel} onExport={onExport} />
          <div className="w-full max-w-full overflow-x-auto">
            <DataTable data={prospectiveVoter} columns={column} loading={getAllProspectiveVoter.isLoading} map={(article) => ({ key: article.id, ...article })} pagination={pagination} />
          </div>
        </Card>
      )}
    </>
  );
};

export default ProspectiveVoters;
