import { DataLoader, DataTable } from '@/components';
import Modul from '@/constants/Modul';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import { ApbdItemService, ApbdReportService } from '@/services';
import { DeleteOutlined, DownloadOutlined, EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Descriptions, Space, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { formFields } from './FormField';
import { rupiahFormat } from '@/utils/rupiahFormat';
import { useParams } from 'react-router-dom';

const ApbdItem = () => {
  const { token } = useAuth();
  const { success, error } = useNotification();
  const { id } = useParams();
  const { execute: fetchApbdItem, ...getAllApbdItem } = useService(ApbdItemService.getAll);
  const { execute: fetchApbdReportById, ...getAllApbdReportById } = useService(ApbdReportService.getById);
  const storeApbdItem = useService(ApbdItemService.store);
  const updateApbdItem = useService(ApbdItemService.update);
  const deleteApbdItem = useService(ApbdItemService.delete);
  const deleteBatchApbdItem = useService(ApbdItemService.deleteBatch);
  const [selectedData, setSelectedData] = useState([]);

  const pagination = usePagination({ totalData: getAllApbdItem.totalData });

  const modal = useCrudModal();

  useEffect(() => {
    fetchApbdItem(token, id, pagination.page, pagination.perPage);
    fetchApbdReportById(token, id);
  }, [fetchApbdItem, fetchApbdReportById, id, pagination.page, pagination.perPage, token]);

  const apbdItem = getAllApbdItem.data ?? [];
  const apbdReportById = getAllApbdReportById.data ?? [];

  const Column = [
    {
      title: 'Nama Komponen',
      dataIndex: 'component_name',
      sorter: (a, b) => a.component_name.length - b.component_name.length,
      searchable: true
    },
    {
      title: 'Tipe',
      dataIndex: 'type',
      sorter: (a, b) => a.type.length - b.type.length,
      searchable: true
    },
    {
      title: 'Sumber Anggaran',
      dataIndex: 'source_funding',
      sorter: (a, b) => a.source_funding.length - b.source_funding.length,
      searchable: true
    },
    {
      title: 'Jumlah Anggaran',
      dataIndex: 'budget_amount',
      sorter: (a, b) => a.budget_amount.length - b.budget_amount.length,
      searchable: true,
      render: (record) => rupiahFormat(record, true)
    },
    {
      title: 'Total Saldo',
      dataIndex: 'total_amount',
      sorter: (a, b) => a.total_amount.length - b.total_amount.length,
      searchable: true,
      render: (record) => rupiahFormat(record, true)
    },
    {
      title: 'Aksi',
      render: (_, record) => (
        <Space size="small">
          <Button
            icon={<EditOutlined />}
            variant="outlined"
            color="primary"
            onClick={() => {
              modal.edit({
                title: `Edit ${Modul.APBD_ITEM}`,
                data: { ...record, apbd_report: record.apbd_report.id },
                formFields: formFields(),
                onSubmit: async (values) => {
                  const { message, isSuccess } = await updateApbdItem.execute(record.id, { ...values, apbd_report: apbdReportById.id }, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchApbdItem(token);
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
                title: record.component_name,
                data: [
                  {
                    key: 'component_name',
                    label: `Nama Komponen`,
                    children: record.component_name
                  },
                  {
                    key: 'apbd_report',
                    label: `Laporan APBD`,
                    children: (
                      <div className="flex flex-col gap-y-1">
                        <b>Laporan : {record.apbd_report.report_name}</b>
                        <small>Tahun :{record.apbd_report.year}</small>
                      </div>
                    )
                  },
                  {
                    key: 'type',
                    label: `Tipe`,
                    children: record.type
                  },
                  {
                    key: 'source_funding',
                    label: `Sumber Anggaran`,
                    children: record.source_funding
                  },
                  {
                    key: 'budget_amount',
                    label: `Jumlah Anggaran`,
                    children: record.budget_amount
                  },
                  {
                    key: 'total_amount',
                    label: `Total Saldo`,
                    children: record.total_amount
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
                title: `Delete ${Modul.APBD_ITEM}`,
                data: { ...record, apbd_report: record.apbd_report.id },
                formFields: formFields(),
                onSubmit: async () => {
                  const { isSuccess, message } = await deleteApbdItem.execute(record.id, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchApbdItem(token);
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
      {getAllApbdItem.isLoading ? (
        <DataLoader type="datatable" />
      ) : (
        <div className="grid grid-cols-12 gap-6">
          <Card className="col-span-12">
            <Descriptions bordered>
              <Descriptions.Item label="Nama Bantuan">{apbdReportById.report_name}</Descriptions.Item>
              <Descriptions.Item label="Target Bantuan">{apbdReportById.year}</Descriptions.Item>
              <Descriptions.Item label="Sumber Dana">
                <Button icon={<DownloadOutlined />} onClick={() => window.open(apbdReportById.document, '_blank')}>
                  Download Sumber
                </Button>
              </Descriptions.Item>
            </Descriptions>
          </Card>
          <Card className="col-span-12">
            <div className="mb-6 flex items-center justify-between">
              <Typography.Title level={5}>Data {Modul.APBD_ITEM}</Typography.Title>
              <div className="inline-flex items-center gap-2">
                <Button
                  variant="outlined"
                  color="danger"
                  disabled={selectedData.length <= 0}
                  icon={<DeleteOutlined />}
                  onClick={() => {
                    modal.delete.batch({
                      title: `Hapus ${selectedData.length} ${Modul.APBD_ITEM} Yang Dipilih ? `,
                      onSubmit: async () => {
                        const ids = selectedData.map((item) => item.id);
                        const { message, isSuccess } = await deleteBatchApbdItem.execute(ids, token);
                        if (isSuccess) {
                          success('Berhasil', message);
                          fetchApbdItem(token);
                        } else {
                          error('Gagal', message);
                        }
                        return isSuccess;
                      }
                    });
                  }}
                >
                  {Modul.APBD_ITEM}
                </Button>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    modal.create({
                      title: `Tambah ${Modul.APBD_ITEM}`,
                      formFields: formFields(),
                      onSubmit: async (values) => {
                        const { message, isSuccess } = await storeApbdItem.execute({ ...values, apbd_report: apbdReportById.id }, token);
                        if (isSuccess) {
                          success('Berhasil', message);
                          fetchApbdItem(token);
                        } else {
                          error('Gagal', message);
                        }
                        return isSuccess;
                      }
                    });
                  }}
                >
                  {Modul.APBD_ITEM}
                </Button>
              </div>
            </div>
            <div className="w-full max-w-full overflow-x-auto">
              <DataTable data={apbdItem} columns={Column} loading={getAllApbdItem.isLoading} map={(legalProducts) => ({ key: legalProducts.id, ...legalProducts })} handleSelectedData={(_, selectedRows) => setSelectedData(selectedRows)} />
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ApbdItem;
