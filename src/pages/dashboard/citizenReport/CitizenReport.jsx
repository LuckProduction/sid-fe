import { DataTable, DataTableHeader } from '@/components';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import { CitizenReportService } from '@/services';
import { Button, Card, Space, Tag, Tooltip } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { CitizenReport as CitizenReportModel } from '@/models';
import Modul from '@/constants/Modul';
import { citizenReportsFilterFields, replyFormFields, statusFormFields } from './FormFields';
import { Action } from '@/constants';
import { Delete, Detail, Edit } from '@/components/dashboard/button';
import { useNavigate } from 'react-router-dom';
import timeAgo from '@/utils/timeAgo';
import dateFormatter from '@/utils/dateFormatter';
import { CommentOutlined } from '@ant-design/icons';

const { DELETE, UPDATE, READ } = Action;

const CitizenReport = () => {
  const { token, user } = useAuth();
  const modal = useCrudModal();
  const navigate = useNavigate();
  const { success, error } = useNotification();
  const { execute, ...getAllCitizenReport } = useService(CitizenReportService.getAll);
  const [filterValues, setFilterValues] = useState({ search: '', status: null });
  const pagination = usePagination({ totalData: getAllCitizenReport.totalData });
  const [selectedData, setSelectedData] = useState([]);

  const deleteBatchCitizenReport = useService(CitizenReportService.deleteBatch);
  const deleteCitizenReport = useService(CitizenReportService.delete);
  const verifCitizenReport = useService(CitizenReportService.verification);
  const replyCitizenReport = useService(CitizenReportService.reply);

  const fetchCitizenReport = useCallback(() => {
    execute({
      token: token,
      page: pagination.page,
      per_page: pagination.per_page,
      search: filterValues.search,
      status: filterValues.status
    });
  }, [execute, filterValues.search, filterValues.status, pagination.page, pagination.per_page, token]);

  useEffect(() => {
    fetchCitizenReport();
  }, [fetchCitizenReport]);

  const citizenReport = getAllCitizenReport.data ?? [];

  const Column = [
    {
      title: 'Judul',
      dataIndex: 'report_title',
      sorter: (a, b) => a.report_titlelength - b.report_titlelength,
      searchable: true,
      render: (_, record) => <div className="news-text">{record.report_title}</div>
    },
    {
      title: 'Nama Pengadu',
      dataIndex: ['resident', 'full_name'],
      sorter: (a, b) => a.resident.full_name.length - b.resident.full_name.length,
      searchable: true
    },
    {
      title: 'Dibuat',
      dataIndex: 'created_at',
      sorter: (a, b) => a.created_at.length - b.created_at.length,
      searchable: true,
      render: (record) => <Tooltip title={dateFormatter(record)}>{timeAgo(record)}</Tooltip>
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

  if (user && user.eitherCan([UPDATE, CitizenReportModel], [DELETE, CitizenReportModel], [READ, CitizenReportModel])) {
    Column.push({
      title: 'Aksi',
      render: (_, record) => (
        <Space size="small">
          <Edit
            title={`Edit ${Modul.CITIZEN_REPORT}`}
            model={CitizenReportModel}
            onClick={() => {
              modal.edit({
                title: `Edit Status ${Modul.CITIZEN_REPORT}`,
                data: record,
                formFields: statusFormFields,
                onSubmit: async (values) => {
                  const { message, isSuccess } = await verifCitizenReport.execute(record.id, { ...values, _method: 'PUT' }, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchCitizenReport({ token: token, page: pagination.page, per_page: pagination.per_page });
                  } else {
                    error('Gagal', message);
                  }
                  return isSuccess;
                }
              });
            }}
          />
          <Detail title={`Detail ${Modul.CITIZEN_REPORT}`} model={CitizenReportModel} onClick={() => navigate(window.location.pathname + `/detail/${record.id}`)} />
          <Delete
            title={`Delete ${Modul.CITIZEN_REPORT}`}
            model={CitizenReportModel}
            onClick={() => {
              modal.delete.default({
                title: `Delete ${Modul.CITIZEN_REPORT}`,
                data: record,
                formFields: statusFormFields,
                onSubmit: async () => {
                  const { isSuccess, message } = await deleteCitizenReport.execute(record.id, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchCitizenReport({ token: token, page: pagination.page, per_page: pagination.per_page });
                  } else {
                    error('Gagal', message);
                  }
                  return isSuccess;
                }
              });
            }}
          />
          <Button
            icon={<CommentOutlined />}
            color="primary"
            variant="outlined"
            onClick={() => {
              modal.create({
                title: `Balas ${Modul.CITIZEN_REPORT}`,
                formFields: replyFormFields,
                onSubmit: async (values) => {
                  const { message, isSuccess } = await replyCitizenReport.execute({ ...values, citizen_report: record.id }, token, values.doc?.file ? values.doc.file : null);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchCitizenReport({ token: token, page: pagination.page, per_page: pagination.per_page });
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
        const { message, isSuccess } = await deleteBatchCitizenReport.execute(ids, token);
        if (isSuccess) {
          success('Berhasil', message);
          fetchCitizenReport({ token: token, page: pagination.page, per_page: pagination.per_page });
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  const filter = {
    formFields: citizenReportsFilterFields(),
    initialData: {
      status: filterValues.status
    },
    isLoading: getAllCitizenReport.isLoading,
    onSubmit: (values) => {
      setFilterValues({
        status: values.status
      });
    }
  };

  return (
    <div>
      <Card>
        <DataTableHeader filter={filter} onSearch={(values) => setFilterValues({ ...filterValues, search: values })} model={CitizenReportModel} modul={Modul.CITIZEN_REPORT} onDeleteBatch={onDeleteBatch} selectedData={selectedData} />
        <div className="w-full max-w-full overflow-x-auto">
          <DataTable
            data={citizenReport}
            columns={Column}
            pagination={pagination}
            loading={getAllCitizenReport.isLoading}
            map={(citizenReport) => ({ key: citizenReport.id, ...citizenReport })}
            handleSelectedData={(_, selectedRows) => setSelectedData(selectedRows)}
          />
        </div>
      </Card>
    </div>
  );
};

export default CitizenReport;
