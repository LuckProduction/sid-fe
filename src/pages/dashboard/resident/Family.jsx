import { DataLoader, DataTable, DataTableHeader } from '@/components';
import { useAuth, usePagination, useService } from '@/hooks';
import { ResidentService } from '@/services';
import { Card, Tag } from 'antd';
import { useCallback, useEffect } from 'react';
import Modul from '@/constants/Modul';
import { Resident as ResidentModel } from '@/models';

const Resident = () => {
  const { token } = useAuth();
  const { execute, ...getAllFamily } = useService(ResidentService.getFamily);
  const pagination = usePagination({ totalData: getAllFamily.totalData });

  const fetchFamily = useCallback(() => {
    execute({ token: token, page: pagination.page, perPage: pagination.perPage });
  }, [execute, pagination.page, pagination.perPage, token]);

  useEffect(() => {
    fetchFamily();
  }, [fetchFamily]);

  const family = getAllFamily.data ?? [];

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
      {getAllFamily.isLoading ? (
        <DataLoader type="datatable" />
      ) : (
        <Card>
          <DataTableHeader modul={Modul.FAMILY} model={ResidentModel} />
          <div className="w-full max-w-full overflow-x-auto">
            <DataTable data={family} columns={column} loading={getAllFamily.isLoading} map={(article) => ({ key: article.id, ...article })} pagination={pagination} />
          </div>
        </Card>
      )}
    </>
  );
};

export default Resident;
