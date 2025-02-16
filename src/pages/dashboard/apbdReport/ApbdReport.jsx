import { DataLoader, DataTable, DataTableHeader } from '@/components';
import Modul from '@/constants/Modul';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import { ApbdReportService } from '@/services';
import dateFormatter from '@/utils/dateFormatter';
import { DatabaseOutlined, DownloadOutlined } from '@ant-design/icons';
import { Button, Card, Space } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { formFields } from './FormFields';
import { useNavigate } from 'react-router-dom';
import { Delete, Detail, Edit } from '@/components/dashboard/button';
import { Action } from '@/constants';
import { ApbdReport as ApbdReportModel } from '@/models';

const { DELETE, UPDATE, READ } = Action;

const ApbdReport = () => {
  const { token, user } = useAuth();
  const { success, error } = useNotification();
  const navigate = useNavigate();
  const { execute: fetchApbdReport, ...getAllApbdReport } = useService(ApbdReportService.getAll);
  const storeApbdReport = useService(ApbdReportService.store);
  const updateApbdReport = useService(ApbdReportService.update);
  const deleteApbdReport = useService(ApbdReportService.delete);
  const deleteBatchApbdReport = useService(ApbdReportService.deleteBatch);
  const [selectedData, setSelectedData] = useState([]);

  const pagination = usePagination({ totalData: getAllApbdReport.totalData });

  const modal = useCrudModal();

  useEffect(() => {
    fetchApbdReport(token, pagination.page, pagination.perPage);
  }, [fetchApbdReport, pagination.page, pagination.perPage, token]);

  const legalProducts = getAllApbdReport.data ?? [];

  const Column = [
    {
      title: 'Nama Laporan',
      dataIndex: 'report_name',
      sorter: (a, b) => a.report_name.length - b.report_name.length,
      searchable: true
    },
    {
      title: 'Tahun',
      dataIndex: 'year',
      sorter: (a, b) => a.year.length - b.year.length,
      searchable: true
    }
  ];

  if (user && user.eitherCan([UPDATE, ApbdReportModel], [DELETE, ApbdReportModel], [READ, ApbdReportModel])) {
    Column.push({
      title: 'Aksi',
      render: (_, record) => (
        <Space size="small">
          <Edit
            title={`Edit ${Modul.APBD_REPORT}`}
            model={ApbdReportModel}
            onClick={() => {
              modal.edit({
                title: `Edit ${Modul.APBD_REPORT}`,
                data: { ...record, year: dayjs(record.year) },
                formFields: formFields,
                onSubmit: async (values) => {
                  const { message, isSuccess } = await updateApbdReport.execute(record.id, { ...values, year: dateFormatter(values.year, 'year'), _method: 'PUT' }, token, values.document.file);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchApbdReport(token);
                  } else {
                    error('Gagal', message);
                  }
                  return isSuccess;
                }
              });
            }}
          />
          <Detail
            title={`Detail ${Modul.APBD_REPORT}`}
            model={ApbdReportModel}
            onClick={() => {
              modal.show.description({
                title: record.report_name,
                data: [
                  {
                    key: 'report_name',
                    label: `Judul ${Modul.APBD_REPORT}`,
                    children: record.report_name
                  },
                  {
                    key: 'year',
                    label: `Tahun ${Modul.APBD_REPORT}`,
                    children: record.year
                  },
                  {
                    key: 'document',
                    label: `Dokumen`,
                    children: (
                      <Button icon={<DownloadOutlined />} onClick={() => window.open(record.document, '_blank')}>
                        Download Sumber
                      </Button>
                    )
                  }
                ]
              });
            }}
          />
          <Delete
            title={`Delete ${Modul.APBD_REPORT}`}
            model={ApbdReportModel}
            onClick={() => {
              modal.delete.default({
                title: `Delete ${Modul.APBD_REPORT}`,
                data: { ...record, year: dayjs(record.year) },
                formFields: formFields,
                onSubmit: async () => {
                  const { isSuccess, message } = await deleteApbdReport.execute(record.id, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchApbdReport(token);
                  } else {
                    error('Gagal', message);
                  }
                  return isSuccess;
                }
              });
            }}
          />
          <Button icon={<DatabaseOutlined />} variant="solid" color="geekblue" onClick={() => navigate(window.location.pathname + `/${record.id}/apbd-item`)} />
        </Space>
      )
    });
  }

  const onDeleteBatch = () => {
    modal.delete.batch({
      title: `Hapus ${selectedData.length} ${Modul.APBD_REPORT} Yang Dipilih ? `,
      formFields: formFields,
      onSubmit: async () => {
        const ids = selectedData.map((item) => item.id);
        const { message, isSuccess } = await deleteBatchApbdReport.execute(ids, token);
        if (isSuccess) {
          success('Berhasil', message);
          fetchApbdReport(token);
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  const onCreate = () => {
    modal.create({
      title: `Tambah ${Modul.APBD_REPORT}`,
      formFields: formFields,
      onSubmit: async (values) => {
        const { message, isSuccess } = await storeApbdReport.execute({ ...values, year: dateFormatter(values.year, 'year') }, token, values.document.file);
        if (isSuccess) {
          success('Berhasil', message);
          fetchApbdReport(token);
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  return (
    <div>
      {getAllApbdReport.isLoading ? (
        <DataLoader type="datatable" />
      ) : (
        <Card>
          <DataTableHeader model={ApbdReportModel} modul={Modul.APBD_REPORT} onStore={onCreate} onDeleteBatch={onDeleteBatch} selectedData={selectedData} />
          <div className="w-full max-w-full overflow-x-auto">
            <DataTable data={legalProducts} columns={Column} loading={getAllApbdReport.isLoading} map={(legalProducts) => ({ key: legalProducts.id, ...legalProducts })} handleSelectedData={(_, selectedRows) => setSelectedData(selectedRows)} />
          </div>
        </Card>
      )}
    </div>
  );
};

export default ApbdReport;
