import { DataLoader, DataTable } from '@/components';
import Modul from '@/constants/Modul';
import { useAuth, usePagination, useService } from '@/hooks';
import { ProspectiveVotersService } from '@/services';
import { Card, Tag, Typography } from 'antd';
import { useEffect } from 'react';

const Resident = () => {
  const { token } = useAuth();
  const { execute: fetchProspectiveVoter, ...getAllProspectiveVoter } = useService(ProspectiveVotersService.getAll);
  const pagination = usePagination({ totalData: getAllProspectiveVoter.totalData });

  useEffect(() => {
    fetchProspectiveVoter(token, pagination.page, pagination.perPage);
  }, [fetchProspectiveVoter, pagination.page, pagination.perPage, token]);

  const prospectiveVoter = getAllProspectiveVoter.data ?? [];

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

  return (
    <>
      {getAllProspectiveVoter.isLoading ? (
        <DataLoader type="datatable" />
      ) : (
        <Card>
          <div className="mb-6">
            <Typography.Title level={5}>Data {Modul.PROSPECTIVE_VOTER}</Typography.Title>
          </div>
          <div className="w-full max-w-full overflow-x-auto">
            <DataTable data={prospectiveVoter} columns={column} loading={getAllProspectiveVoter.isLoading} map={(article) => ({ key: article.id, ...article })} pagination={pagination} />
          </div>
        </Card>
      )}
    </>
  );
};

export default Resident;
