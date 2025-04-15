import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import { ReportAttributeService } from '@/services';
import { Button, Card, Space } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { ReportAttribute as ReportAttributeModel } from '@/models';
import { Action } from '@/constants';
import Modul from '@/constants/Modul';
import { reportAttributeFormFields } from './FormFields';
import { Delete, Edit } from '@/components/dashboard/button';
import { DataTable, DataTableHeader } from '@/components';
import { DatabaseOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';

const { UPDATE, READ, DELETE } = Action;

const ReportAttribute = () => {
  const { id } = useParams();
  const { token, user } = useAuth();
  const { success, error } = useNotification();
  const navigate = useNavigate();
  const { execute, ...getAllReportAttributes } = useService(ReportAttributeService.getAll);
  const storeReportAttribute = useService(ReportAttributeService.store);
  const updateReportAttribute = useService(ReportAttributeService.update);
  const deleteReportAttribute = useService(ReportAttributeService.delete);
  const deleteReportAttributes = useService(ReportAttributeService.deleteBatch);
  const [selectedData, setSelectedData] = useState([]);
  const pagination = usePagination({ totalData: getAllReportAttributes.totalData });
  const modal = useCrudModal();
  const [filterValues, setFilterValues] = useState({ search: '' });

  const fetchReportAttributes = useCallback(() => {
    execute({
      token: token,
      page: pagination.page,
      per_page: pagination.per_page,
      search: filterValues.search
    });
  }, [execute, filterValues.search, pagination.page, pagination.per_page, token]);

  useEffect(() => {
    fetchReportAttributes();
  }, [fetchReportAttributes]);

  const reportAttributes = getAllReportAttributes.data ?? [];

  const Column = [
    {
      title: 'Nama Atribut',
      dataIndex: 'attribute',
      sorter: (a, b) => a.attribute.length - b.attribute.length,
      searchable: true
    },
    {
      title: 'Jenis Atribut',
      dataIndex: 'type',
      sorter: (a, b) => a.type.length - b.type.length,
      searchable: true
    },
    {
      title: 'Label',
      dataIndex: 'label',
      sorter: (a, b) => a.label.length - b.label.length,
      searchable: true
    },
    {
      title: 'Placeholder',
      dataIndex: 'placeholder',
      sorter: (a, b) => a.placeholder.length - b.placeholder.length,
      searchable: true
    }
  ];

  if (user && user.eitherCan([UPDATE, ReportAttributeModel], [DELETE, ReportAttributeModel], [READ, ReportAttributeModel])) {
    Column.push({
      title: 'Aksi',
      render: (_, record) => (
        <Space size="small">
          <Edit
            title={`Edit ${Modul.REPORT_ATTRIBUTE}`}
            model={ReportAttributeModel}
            onClick={() => {
              modal.edit({
                title: `Edit ${Modul.REPORT_ATTRIBUTE}`,
                data: record,
                formFields: reportAttributeFormFields,
                onSubmit: async (values) => {
                  const { message, isSuccess } = await updateReportAttribute.execute(record.id, { ...values, village_report: id }, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchReportAttributes({ token: token, page: pagination.page, per_page: pagination.per_page });
                  } else {
                    error('Gagal', message);
                  }
                  return isSuccess;
                }
              });
            }}
          />
          <Delete
            title={`Delete ${Modul.REPORT_ATTRIBUTE}`}
            model={ReportAttributeModel}
            onClick={() => {
              modal.delete.default({
                title: `Delete ${Modul.REPORT_ATTRIBUTE}`,
                data: record,
                onSubmit: async () => {
                  const { isSuccess, message } = await deleteReportAttribute.execute(record.id, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchReportAttributes({ token: token, page: pagination.page, per_page: pagination.per_page });
                  } else {
                    error('Gagal', message);
                  }
                  return isSuccess;
                }
              });
            }}
          />
          <Button icon={<DatabaseOutlined />} variant="solid" color="geekblue" onClick={() => navigate(window.location.pathname + `/report_attribute/${record.id}`)} />
        </Space>
      )
    });
  }

  const onDeleteBatch = () => {
    modal.delete.batch({
      title: `Hapus ${selectedData.length} ${Modul.REPORT_ATTRIBUTE} Yang Dipilih ? `,
      formFields: reportAttributeFormFields,
      onSubmit: async () => {
        const ids = selectedData.map((item) => item.id);
        const { message, isSuccess } = await deleteReportAttributes.execute(ids, token);
        if (isSuccess) {
          success('Berhasil', message);
          fetchReportAttributes({ token: token, page: pagination.page, per_page: pagination.per_page });
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  const onCreate = () => {
    modal.create({
      title: `Tambah ${Modul.REPORT_ATTRIBUTE}`,
      formFields: reportAttributeFormFields,
      onSubmit: async (values) => {
        const { message, isSuccess } = await storeReportAttribute.execute({ ...values, village_report: id }, token);
        if (isSuccess) {
          success('Berhasil', message);
          fetchReportAttributes({ token: token, page: pagination.page, per_page: pagination.per_page });
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
        <DataTableHeader onSearch={(values) => setFilterValues({ ...filterValues, search: values })} model={ReportAttributeModel} modul={Modul.REPORT_ATTRIBUTE} onStore={onCreate} onDeleteBatch={onDeleteBatch} selectedData={selectedData} />
        <div className="w-full max-w-full overflow-x-auto">
          <DataTable
            data={reportAttributes}
            columns={Column}
            pagination={pagination}
            loading={getAllReportAttributes.isLoading}
            map={(reportAttribute) => ({ key: reportAttribute.id, ...reportAttribute })}
            handleSelectedData={(_, selectedRows) => setSelectedData(selectedRows)}
          />
        </div>
      </Card>
    </div>
  );
};

export default ReportAttribute;
