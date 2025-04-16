import { Action } from '@/constants';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import { CitizenReportReplyService } from '@/services';
import { Button, Card, Descriptions, Space, Tag } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { CitizenReportReply as citizenReportReplyModel } from '@/models';
import Modul from '@/constants/Modul';
import { repliesFilterFields, replyFormFields, statusFormFields } from './FormFields';
import { Delete, Detail, Edit } from '@/components/dashboard/button';
import { DataTable, DataTableHeader } from '@/components';
import timeAgo from '@/utils/timeAgo';
import asset from '@/utils/asset';
import { CheckOutlined, DownloadOutlined } from '@ant-design/icons';
import dateFormatter from '@/utils/dateFormatter';

const { UPDATE, DELETE, READ } = Action;

const Replies = () => {
  const { token, user } = useAuth();
  const modal = useCrudModal();
  const { success, error } = useNotification();
  const { execute, ...getAllCitizenReportReplies } = useService(CitizenReportReplyService.getAll);
  const [filterValues, setFilterValues] = useState({ search: '', status: null, tipe_balasan: null });
  const pagination = usePagination({ totalData: getAllCitizenReportReplies.totalData });
  const [selectedData, setSelectedData] = useState([]);
  const editCitizenReportReply = useService(CitizenReportReplyService.update);
  const deleteBatchCitizenReportReplies = useService(CitizenReportReplyService.deleteBatch);
  const deleteCitizenReportReply = useService(CitizenReportReplyService.delete);
  const verifyCitizenReportReply = useService(CitizenReportReplyService.verification);

  const fetchCitizenReportReplies = useCallback(() => {
    execute({
      token: token,
      page: pagination.page,
      per_page: pagination.per_page,
      search: filterValues.search,
      status: filterValues.status,
      tipe_balasan: filterValues.tipe_balasan
    });
  }, [execute, filterValues.search, filterValues.status, filterValues.tipe_balasan, pagination.page, pagination.per_page, token]);

  useEffect(() => {
    fetchCitizenReportReplies();
  }, [fetchCitizenReportReplies]);

  const citizenReportReplies = getAllCitizenReportReplies.data ?? [];

  const Column = [
    {
      title: 'Pengirim Balasan',
      dataIndex: ['resident', 'full_name'],
      sorter: (a, b) => a.resident.full_name.length - b.resident.full_name.length,
      searchable: true
    },
    {
      title: 'Balasan',
      dataIndex: 'content',
      sorter: (a, b) => a.content.length - b.content.length,
      searchable: true,
      render: (_, record) => <div className="news-text">{record.content}</div>
    },
    {
      title: 'Judul Balasan',
      dataIndex: ['citizen_report', 'report_title'],
      sorter: (a, b) => a.citizen_report.report_title.length - b.citizen_report.report_title.length,
      searchable: true,
      render: (_, record) => <div className="news-text max-w-80">{record.citizen_report.report_title}</div>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      sorter: (a, b) => a.status.length - b.status.length,
      searchable: true,
      render: (_, record) => {
        switch (record.status) {
          case 'privasi':
            return <Tag color="blue">Privasi</Tag>;
          case 'verifikasi':
            return <Tag color="warning">Verifikasi</Tag>;
          case 'publikasi':
            return <Tag color="green">Publikasi</Tag>;
          case 'diproses':
            return <Tag color="blue-inverse">Diproses</Tag>;
          case 'selesai':
            return <Tag color="geekblue">Selesai</Tag>;
          default:
            return <Tag color="error">Undifined</Tag>;
        }
      }
    }
  ];

  if (user && user.eitherCan([UPDATE, citizenReportReplyModel], [DELETE, citizenReportReplyModel], [READ, citizenReportReplyModel])) {
    Column.push({
      title: 'Aksi',
      render: (_, record) => (
        <Space size="small">
          <Edit
            title={`Edit ${Modul.CITIZEN_REPORT_REPLIES}`}
            model={citizenReportReplyModel}
            onClick={() => {
              modal.edit({
                title: `Edit ${Modul.CITIZEN_REPORT_REPLIES}`,
                data: record,
                formFields: replyFormFields,
                onSubmit: async (values) => {
                  const { message, isSuccess } = await editCitizenReportReply.execute(record.id, { ...values, citizen_report: record.citizen_report.id, _method: 'PUT' }, token, values.doc?.file ? values.doc.file : null);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchCitizenReportReplies({ token: token, page: pagination.page, per_page: pagination.per_page });
                  } else {
                    error('Gagal', message);
                  }
                  return isSuccess;
                }
              });
            }}
          />
          <Detail
            title={`Detail ${Modul.CITIZEN_REPORT_REPLIES}`}
            model={citizenReportReplyModel}
            onClick={() => {
              modal.show.paragraph({
                title: 'Balasan Pengaduan',
                data: {
                  content: (
                    <>
                      <Card>
                        <div className="flex flex-col gap-y-2">
                          <b className="text-sm">{`(${record?.resident?.full_name} - ${timeAgo(record?.created_at)} )`} ,</b>
                          <p className="mt-2">{record?.content}</p>
                          {record?.doc && (
                            <>
                              <hr className="my-2" />
                              <p>Lampiran :</p>

                              {!record?.doc.split('.').pop().toLowerCase().includes('pdf') && <img className="max-w-96" src={asset(record.doc)} alt="Lampiran" />}

                              {record?.doc.split('.').pop().toLowerCase() === 'pdf' && (
                                <Button icon={<DownloadOutlined />} className="w-fit" variant="solid" color="primary" onClick={() => window.open(asset(record?.doc), '_blank')}>
                                  Dokumen
                                </Button>
                              )}
                            </>
                          )}
                        </div>
                      </Card>
                      <Descriptions bordered column={1} size="small" className="mt-4">
                        <Descriptions.Item label="Suka">{record.liked}</Descriptions.Item>
                        <Descriptions.Item label="Dibuat">{dateFormatter(record.created_at)}</Descriptions.Item>
                        <Descriptions.Item label="Disukai">{record.has_like ? 'Disukai' : 'Tidak Disukai'}</Descriptions.Item>
                        <Descriptions.Item label="Konten Pengaduan">{record.citizen_report.desc}</Descriptions.Item>
                      </Descriptions>
                    </>
                  )
                }
              });
            }}
          />
          <Delete
            title={`Delete ${Modul.CITIZEN_REPORT_REPLIES}`}
            model={citizenReportReplyModel}
            onClick={() => {
              modal.delete.default({
                title: `Delete ${Modul.CITIZEN_REPORT_REPLIES}`,
                data: record,
                onSubmit: async () => {
                  const { isSuccess, message } = await deleteCitizenReportReply.execute(record.id, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchCitizenReportReplies({ token: token, page: pagination.page, per_page: pagination.per_page });
                  } else {
                    error('Gagal', message);
                  }
                  return isSuccess;
                }
              });
            }}
          />
          <Button
            icon={<CheckOutlined />}
            color="primary"
            variant="outlined"
            onClick={() => {
              modal.edit({
                title: `Edit Status ${Modul.CITIZEN_REPORT_REPLIES}`,
                data: record,
                formFields: statusFormFields,
                onSubmit: async (values) => {
                  const { message, isSuccess } = await verifyCitizenReportReply.execute(record.id, { ...values, _method: 'PUT' }, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchCitizenReportReplies({ token: token, page: pagination.page, per_page: pagination.per_page });
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
      title: `Hapus ${selectedData.length} ${Modul.LEGAL_PRODUCTS} Yang Dipilih ? `,
      onSubmit: async () => {
        const ids = selectedData.map((item) => item.id);
        const { message, isSuccess } = await deleteBatchCitizenReportReplies.execute(ids, token);
        if (isSuccess) {
          success('Berhasil', message);
          fetchCitizenReportReplies({ token: token, page: pagination.page, per_page: pagination.per_page });
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  const filter = {
    formFields: repliesFilterFields(),
    initialData: {
      status: filterValues.status,
      tipe_balasan: filterValues.tipe_balasan
    },
    isLoading: getAllCitizenReportReplies.isLoading,
    onSubmit: (values) => {
      setFilterValues({
        status: values.status,
        tipe_balasan: values.tipe_balasan
      });
    }
  };

  return (
    <>
      <DataTableHeader filter={filter} onSearch={(values) => setFilterValues({ ...filterValues, search: values })} model={citizenReportReplyModel} modul={Modul.CITIZEN_REPORT_REPLIES} onDeleteBatch={onDeleteBatch} selectedData={selectedData} />
      <div className="w-full max-w-full overflow-x-auto">
        <DataTable
          data={citizenReportReplies}
          columns={Column}
          pagination={pagination}
          loading={getAllCitizenReportReplies.isLoading}
          map={(citizenReport) => ({ key: citizenReport.id, ...citizenReport })}
          handleSelectedData={(_, selectedRows) => setSelectedData(selectedRows)}
        />
      </div>
    </>
  );
};

export default Replies;
