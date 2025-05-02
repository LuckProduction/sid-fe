import { DataTable, DataTableHeader } from '@/components';
import Modul from '@/constants/Modul';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import { VillageReportService, SubmitReportService } from '@/services';
import { Button, List, Space, Tag } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { statusSubmitFormFields, submitReportFilterFields } from './FormFields';
import { Action } from '@/constants';
import { Delete, Detail, Edit } from '@/components/dashboard/button';
import { DownloadOutlined } from '@ant-design/icons';
import { BASE_URL } from '@/utils/asset';
import { SubmitReport as SubmitReportModel } from '@/models';

const { UPDATE, DELETE } = Action;

const SubmitReport = () => {
  const { token, user } = useAuth();
  const { success, error } = useNotification();
  const { execute, ...getAllSubmitReports } = useService(SubmitReportService.getAll);
  const { execute: fetchVillageReports, ...getAllVillageReports } = useService(VillageReportService.getAll);
  const updateSubmitReport = useService(SubmitReportService.update);
  const deleteSubmitReport = useService(SubmitReportService.delete);
  const deleteBatchSubmitReports = useService(SubmitReportService.deleteBatch);
  const [selectedData, setSelectedData] = useState([]);
  const pagination = usePagination({ totalData: getAllSubmitReports.totalData });
  const modal = useCrudModal();
  const [filterValues, setFilterValues] = useState({ search: '', master_laporan_id: null, status: null });

  const fetchSubmitLetter = useCallback(() => {
    execute({
      token: token,
      page: pagination.page,
      per_page: pagination.per_page,
      search: filterValues.search,
      master_laporan_id: filterValues.master_laporan_id,
      status: filterValues.status
    });
  }, [execute, filterValues.master_laporan_id, filterValues.search, filterValues.status, pagination.page, pagination.per_page, token]);

  useEffect(() => {
    fetchSubmitLetter();
    fetchVillageReports({ token: token });
  }, [fetchVillageReports, fetchSubmitLetter, token]);

  const submitReport = getAllSubmitReports.data ?? [];
  const villageReport = getAllVillageReports.data ?? [];

  const isDocumentPath = (content) => {
    // eslint-disable-next-line no-useless-escape
    const regex = /^(.*\/)?[^\/]+\.(pdf|docx?|xlsx?|pptx?)$/i;
    return regex.test(content);
  };

  const Column = [
    {
      title: 'Token',
      dataIndex: 'token',
      sorter: (a, b) => a.token.length - b.token.length,
      searchable: true
    },
    {
      title: 'Nama Laporan',
      dataIndex: ['village_report', 'report_name'],
      sorter: (a, b) => a.village_report.report_name.length - b.village_report.report_name.length,
      searchable: true
    },
    {
      title: 'Pengaju',
      dataIndex: ['resident', 'full_name'],
      searchable: true
    },
    {
      title: 'Status',
      dataIndex: 'status',
      sorter: (a, b) => a.status.length - b.status.length,
      searchable: true,
      render: (record) => {
        switch (record) {
          case 'proses':
            return <Tag color="blue">Diproses</Tag>;
          case 'terima':
            return <Tag color="green">Terima</Tag>;
          case 'tolak':
            return <Tag color="red">Tolak</Tag>;
          default:
            return <Tag color="error">Undifined</Tag>;
        }
      }
    },
    {
      title: 'Dibuat',
      dataIndex: 'created_at',
      sorter: (a, b) => a.created_at.length - b.created_at.length,
      searchable: true
    }
  ];

  if (user && user.eitherCan([UPDATE, SubmitReportModel], [DELETE, SubmitReportModel])) {
    Column.push({
      title: 'Aksi',
      render: (_, record) => (
        <Space size="small">
          <Edit
            title={`Edit ${Modul.VILLAGE_REPORT}`}
            model={SubmitReportModel}
            onClick={() => {
              modal.edit({
                title: `Edit ${Modul.VILLAGE_REPORT}`,
                data: record,
                formFields: statusSubmitFormFields,
                onSubmit: async (values) => {
                  const { message, isSuccess } = await updateSubmitReport.execute(record.id, values, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchSubmitLetter({ token: token, page: pagination.page, per_page: pagination.per_page });
                  } else {
                    error('Gagal', message);
                  }
                  return isSuccess;
                }
              });
            }}
          />
          <Detail
            title={`Detail ${Modul.VILLAGE_REPORT}`}
            model={SubmitReportModel}
            onClick={() => {
              const data = [
                {
                  key: 'Token Surat',
                  label: `Token ${Modul.VILLAGE_REPORT}`,
                  children: record.token
                },
                {
                  key: 'status',
                  label: `Status `,
                  children: (() => {
                    let statusTag;
                    switch (record.status) {
                      case 'proses':
                        statusTag = <Tag color="blue">Selesai</Tag>;
                        break;
                      case 'terima':
                        statusTag = <Tag color="green">Verifikasi</Tag>;
                        break;
                      case 'tolak':
                        statusTag = <Tag color="red">Menunggu</Tag>;
                        break;
                      default:
                        statusTag = <Tag color="error">Undefined</Tag>;
                    }
                    return statusTag;
                  })()
                },
                {
                  key: 'Nama Laporan',
                  label: `Nama Laporan`,
                  children: record.village_report.report_name
                },
                {
                  key: 'Tipe Laporan',
                  label: `Tipe Laporan`,
                  children: record.village_report.type
                },
                {
                  key: 'Status Laporan',
                  label: `Status Surat`,
                  children: record.village_report.status
                }
              ];

              if (record.resident !== null) {
                data.push(
                  {
                    key: 'Nama Pemohon',
                    label: `Nama Pemohon`,
                    children: record.resident.full_name
                  },
                  {
                    key: 'NIK Pemohon',
                    label: `NIK Pemohon`,
                    children: record.resident.nik
                  },
                  {
                    key: 'Status Kependudukan',
                    label: `Status Kependudukan`,
                    children: record.resident.resident_status
                  },
                  {
                    key: 'Jenis Kelamin',
                    label: `Jenis Kelamin`,
                    children: (() => {
                      let gender;
                      switch (record.resident.gender) {
                        case 'L':
                          gender = 'Laki Laki';
                          break;
                        case 'P':
                          gender = 'Perempuan';
                          break;
                        default:
                          gender = <Tag color="error">Undefined</Tag>;
                      }
                      return gender;
                    })()
                  }
                );
              }

              data.push({
                key: 'Atribut Laporan',
                label: 'Atribut Laporan',
                children: (
                  <List
                    dataSource={record.report_attribute}
                    renderItem={(item) => (
                      <List.Item>
                        <List.Item.Meta
                          title={item.attribute_name}
                          description={
                            isDocumentPath(item.content) ? (
                              <Button icon={<DownloadOutlined />} size="small" className="text-xs" color="primary" variant="solid" onClick={() => window.open(`${BASE_URL}/${item.content}`, '_blank')}>
                                Dokumen
                              </Button>
                            ) : (
                              item.content
                            )
                          }
                        />
                      </List.Item>
                    )}
                  />
                )
              });

              modal.show.description({
                title: 'Detail data pengajuan laporan',
                data: data
              });
            }}
          />
          <Delete
            title={`Delete ${Modul.VILLAGE_REPORT}`}
            model={SubmitReportModel}
            onClick={() => {
              modal.delete.default({
                title: `Delete ${Modul.VILLAGE_REPORT}`,
                data: record,
                onSubmit: async () => {
                  const { isSuccess, message } = await deleteSubmitReport.execute(record.id, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchSubmitLetter({ token: token, page: pagination.page, per_page: pagination.per_page });
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
      title: `Hapus ${selectedData.length} ${Modul.VILLAGE_REPORT} Yang Dipilih ? `,
      onSubmit: async () => {
        const ids = selectedData.map((item) => item.id);
        const { message, isSuccess } = await deleteBatchSubmitReports.execute(ids, token);
        if (isSuccess) {
          success('Berhasil', message);
          fetchSubmitLetter({ token: token, page: pagination.page, per_page: pagination.per_page });
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  const filter = {
    formFields: submitReportFilterFields({ options: { village_report: villageReport } }),
    initialData: {
      master_laporan_id: filterValues.master_laporan_id,
      status: filterValues.status
    },
    isLoading: getAllSubmitReports.isLoading,
    onSubmit: (values) => {
      setFilterValues({
        master_laporan_id: values.master_laporan_id,
        status: values.status
      });
    }
  };

  return (
    <>
      <DataTableHeader filter={filter} onSearch={(values) => setFilterValues({ ...filterValues, search: values })} model={SubmitReportModel} modul={Modul.VILLAGE_REPORT} onDeleteBatch={onDeleteBatch} selectedData={selectedData} />
      <div className="w-full max-w-full overflow-x-auto">
        <DataTable
          data={submitReport}
          columns={Column}
          pagination={pagination}
          loading={getAllSubmitReports.isLoading}
          map={(villageReport) => ({ key: villageReport.id, ...villageReport })}
          handleSelectedData={(_, selectedRows) => setSelectedData(selectedRows)}
        />
      </div>
    </>
  );
};

export default SubmitReport;
