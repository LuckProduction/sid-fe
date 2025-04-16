import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import { VillageReportService } from '@/services';
import { Button, Card, Space, Tabs, Tag } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { VillageReport as VillageReportModel } from '@/models';
import { Action } from '@/constants';
import Modul from '@/constants/Modul';
import { formFields } from './FormFields';
import { DataTable, DataTableHeader } from '@/components';
import { DatabaseOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import SubmitReport from './SubmitReport';

const { UPDATE, READ, DELETE } = Action;

const VillageReport = () => {
  const { token, user } = useAuth();
  const { success, error } = useNotification();
  const navigate = useNavigate();
  const { execute, ...getAllVillageReports } = useService(VillageReportService.getAll);
  const storeVillageReport = useService(VillageReportService.store);
  const deleteBatchVillageReports = useService(VillageReportService.deleteBatch);
  const [selectedData, setSelectedData] = useState([]);
  const pagination = usePagination({ totalData: getAllVillageReports.totalData });
  const modal = useCrudModal();
  const [filterValues, setFilterValues] = useState({ search: '' });

  const fetchVillageReports = useCallback(() => {
    execute({
      token: token,
      page: pagination.page,
      per_page: pagination.per_page,
      search: filterValues.search
    });
  }, [execute, filterValues.search, pagination.page, pagination.per_page, token]);

  useEffect(() => {
    fetchVillageReports();
  }, [fetchVillageReports]);

  const villageReports = getAllVillageReports.data ?? [];

  const Column = [
    {
      title: 'Nama Laporan',
      dataIndex: 'report_name',
      sorter: (a, b) => a.report_name.length - b.report_name.length,
      searchable: true
    },
    {
      title: 'Jenis Laporan',
      dataIndex: 'type',
      sorter: (a, b) => a.type.length - b.type.length,
      searchable: true,
      render: (_, record) => {
        switch (record.type) {
          case 'ubah':
            return <Tag color="blue">Ubah</Tag>;
          case 'masuk':
            return <Tag color="green">Masuk</Tag>;
          case 'keluar':
            return <Tag color="warning">Keluar</Tag>;
          case 'lahir':
            return <Tag color="blue-inverse">Lahir</Tag>;
          case 'meninggal':
            return <Tag color="red-inverse">Meninggal</Tag>;
          default:
            return <Tag color="error">Undifined</Tag>;
        }
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      sorter: (a, b) => a.status.length - b.status.length,
      searchable: true,
      render: (_, record) => {
        switch (record.status) {
          case 'aktif':
            return <Tag color="blue-inverse">Aktif</Tag>;
          case 'nonaktif':
            return <Tag color="red-inverse">Non Aktif</Tag>;
          default:
            return <Tag color="error">Undifined</Tag>;
        }
      }
    }
  ];

  if (user && user.eitherCan([UPDATE, VillageReportModel], [DELETE, VillageReportModel], [READ, VillageReportModel])) {
    Column.push({
      title: 'Aksi',
      render: (_, record) => (
        <Space size="small">
          <Button icon={<DatabaseOutlined />} variant="solid" color="geekblue" onClick={() => navigate(window.location.pathname + `/report_attribute/${record.id}`)} />
        </Space>
      )
    });
  }

  const onDeleteBatch = () => {
    modal.delete.batch({
      title: `Hapus ${selectedData.length} ${Modul.VILLAGE_REPORT} Yang Dipilih ? `,
      formFields: formFields,
      onSubmit: async () => {
        const ids = selectedData.map((item) => item.id);
        const { message, isSuccess } = await deleteBatchVillageReports.execute(ids, token);
        if (isSuccess) {
          success('Berhasil', message);
          fetchVillageReports({ token: token, page: pagination.page, per_page: pagination.per_page });
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  const onCreate = () => {
    modal.create({
      title: `Tambah ${Modul.VILLAGE_REPORT}`,
      formFields: formFields,
      onSubmit: async (values) => {
        const { message, isSuccess } = await storeVillageReport.execute(values, token);
        if (isSuccess) {
          success('Berhasil', message);
          fetchVillageReports({ token: token, page: pagination.page, per_page: pagination.per_page });
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  return (
    <div>
      <Card>
        <Tabs type="card">
          <Tabs.TabPane key="laporan-penduduk" tab="Laporan Penduduk">
            <SubmitReport />
          </Tabs.TabPane>
          <Tabs.TabPane key="master-laporan" tab="Master Laporan">
            <DataTableHeader onSearch={(values) => setFilterValues({ ...filterValues, search: values })} model={VillageReportModel} modul={Modul.VILLAGE_REPORT} onStore={onCreate} onDeleteBatch={onDeleteBatch} selectedData={selectedData} />
            <div className="w-full max-w-full overflow-x-auto">
              <DataTable
                data={villageReports}
                columns={Column}
                pagination={pagination}
                loading={getAllVillageReports.isLoading}
                map={(villageReports) => ({ key: villageReports.id, ...villageReports })}
                handleSelectedData={(_, selectedRows) => setSelectedData(selectedRows)}
              />
            </div>
          </Tabs.TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default VillageReport;
