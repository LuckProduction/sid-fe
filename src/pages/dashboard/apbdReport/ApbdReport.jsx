import { DataLoader, DataTable } from '@/components';
import Modul from '@/constants/Modul';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import { ApbdReportService } from '@/services';
import dateFormatter from '@/utils/dateFormatter';
import { DeleteOutlined, DownloadOutlined, EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Space, Typography } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { formFields } from './FormFields';

const ApbdReport = () => {
  const { token } = useAuth();
  const { success, error } = useNotification();
  const { execute: fetchApbdReport, ...getAllApbdReport } = useService(ApbdReportService.getAll);
  const storeLegalProducts = useService(ApbdReportService.store);
  const updateLegalProducts = useService(ApbdReportService.update);
  const deleteLegalProducts = useService(ApbdReportService.delete);
  const deleteBatchLegalProducts = useService(ApbdReportService.deleteBatch);
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
    },
    {
      title: 'Aksi',
      width: '40%',
      render: (_, record) => (
        <Space size="small">
          <Button
            icon={<EditOutlined />}
            variant="outlined"
            color="primary"
            onClick={() => {
              modal.edit({
                title: `Edit ${Modul.APBD_REPORT}`,
                data: { ...record, year: dayjs(record.year) },
                formFields: formFields,
                onSubmit: async (values) => {
                  const { message, isSuccess } = await updateLegalProducts.execute(record.id, { ...values, year: dateFormatter(values.year, 'year'), _method: 'PUT' }, token, values.document.file);
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
          <Button
            icon={<EyeOutlined />}
            variant="outlined"
            color="green"
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
          <Button
            icon={<DeleteOutlined />}
            variant="outlined"
            color="danger"
            onClick={() => {
              modal.delete.default({
                title: `Delete ${Modul.APBD_REPORT}`,
                data: { ...record, year: dayjs(record.year) },
                formFields: formFields,
                onSubmit: async () => {
                  const { isSuccess, message } = await deleteLegalProducts.execute(record.id, token);
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
        </Space>
      )
    }
  ];

  return (
    <div>
      {getAllApbdReport.isLoading ? (
        <DataLoader type="datatable" />
      ) : (
        <Card>
          <div className="mb-6 flex items-center justify-between">
            <Typography.Title level={5}>Data {Modul.APBD_REPORT}</Typography.Title>
            <div className="inline-flex items-center gap-2">
              <Button
                variant="outlined"
                color="danger"
                disabled={selectedData.length <= 0}
                icon={<DeleteOutlined />}
                onClick={() => {
                  modal.delete.batch({
                    title: `Hapus ${selectedData.length} ${Modul.APBD_REPORT} Yang Dipilih ? `,
                    formFields: formFields,
                    onSubmit: async () => {
                      const ids = selectedData.map((item) => item.id);
                      const { message, isSuccess } = await deleteBatchLegalProducts.execute(ids, token);
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
              >
                {Modul.APBD_REPORT}
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  modal.create({
                    title: `Tambah ${Modul.APBD_REPORT}`,
                    formFields: formFields,
                    onSubmit: async (values) => {
                      const { message, isSuccess } = await storeLegalProducts.execute({ ...values, year: dateFormatter(values.year, 'year') }, token, values.document.file);
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
              >
                {Modul.APBD_REPORT}
              </Button>
            </div>
          </div>
          <div className="w-full max-w-full overflow-x-auto">
            <DataTable data={legalProducts} columns={Column} loading={getAllApbdReport.isLoading} map={(legalProducts) => ({ key: legalProducts.id, ...legalProducts })} handleSelectedData={(_, selectedRows) => setSelectedData(selectedRows)} />
          </div>
        </Card>
      )}
    </div>
  );
};

export default ApbdReport;
