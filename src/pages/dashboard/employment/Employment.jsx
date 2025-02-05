import { DataLoader, DataTable } from '@/components';
import Modul from '@/constants/Modul';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import { EmploymentService } from '@/services';
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Space, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { formFields } from './FormFields';

const Employment = () => {
  const { token } = useAuth();
  const { success, error } = useNotification();
  const { execute: fetchEmployments, ...getAllEmployments } = useService(EmploymentService.getAll);
  const storeEmployment = useService(EmploymentService.store);
  const updateEmployment = useService(EmploymentService.update);
  const deleteEmployment = useService(EmploymentService.delete);
  const deleteBatchEmnployment = useService(EmploymentService.deleteBatch);
  const [selectedData, setSelectedData] = useState([]);
  const modal = useCrudModal();

  const pagination = usePagination({ totalData: getAllEmployments.totalData });

  useEffect(() => {
    fetchEmployments(token, pagination.page, pagination.perPage);
  }, [fetchEmployments, pagination.page, pagination.perPage, token]);

  const employments = getAllEmployments.data ?? [];

  const Column = [
    {
      title: 'Nama Jabatan',
      dataIndex: 'employment_name',
      sorter: (a, b) => a.employment_name.length - b.employment_name.length,
      searchable: true
    },
    {
      title: 'Kode Jabatan',
      dataIndex: 'employment_code',
      sorter: (a, b) => a.employment_code.length - b.employment_code.length,
      searchable: true
    },
    {
      title: 'Golongan',
      dataIndex: 'faction',
      sorter: (a, b) => a.faction.length - b.faction.length,
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
                title: `Edit ${Modul.EMPLOYMENT}`,
                data: record,
                formFields: formFields,
                onSubmit: async (values) => {
                  const { message, isSuccess } = await updateEmployment.execute(record.id, values, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchEmployments(token);
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
                title: record.employment_name,
                data: [
                  {
                    key: 'employment_name',
                    label: `Nama ${Modul.EMPLOYMENT}`,
                    children: record.employment_name
                  },
                  {
                    key: 'employment_code',
                    label: `Kode ${Modul.EMPLOYMENT}`,
                    children: record.employment_code
                  },
                  {
                    key: 'faction',
                    label: `Golongan ${Modul.EMPLOYMENT}`,
                    children: record.faction
                  },
                  {
                    key: 'employment_duties',
                    label: `Tupoksi ${Modul.EMPLOYMENT}`,
                    children: record.employment_duties
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
                title: `Delete ${Modul.EMPLOYMENT}`,
                data: record,
                formFields: formFields,
                onSubmit: async () => {
                  const { isSuccess, message } = await deleteEmployment.execute(record.id, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchEmployments(token);
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
      {getAllEmployments.isLoading ? (
        <DataLoader type="datatable" />
      ) : (
        <Card>
          <div className="mb-6 flex items-center justify-between">
            <Typography.Title level={5}>Data {Modul.EMPLOYMENT}</Typography.Title>
            <div className="inline-flex items-center gap-2">
              <Button
                variant="outlined"
                color="danger"
                disabled={selectedData.length <= 0}
                icon={<DeleteOutlined />}
                onClick={() => {
                  modal.delete.batch({
                    title: `Hapus ${selectedData.length} ${Modul.EMPLOYMENT} Yang Dipilih ? `,
                    formFields: formFields,
                    onSubmit: async () => {
                      const ids = selectedData.map((item) => item.id);
                      const { message, isSuccess } = await deleteBatchEmnployment.execute(ids, token);
                      if (isSuccess) {
                        success('Berhasil', message);
                        fetchEmployments(token);
                      } else {
                        error('Gagal', message);
                      }
                      return isSuccess;
                    }
                  });
                }}
              >
                {Modul.EMPLOYMENT}
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  modal.create({
                    title: `Tambah ${Modul.EMPLOYMENT}`,
                    formFields: formFields,
                    onSubmit: async (values) => {
                      const { message, isSuccess } = await storeEmployment.execute(values, token);
                      if (isSuccess) {
                        success('Berhasil', message);
                        fetchEmployments(token);
                      } else {
                        error('Gagal', message);
                      }
                      return isSuccess;
                    }
                  });
                }}
              >
                {Modul.EMPLOYMENT}
              </Button>
            </div>
          </div>
          <div className="w-full max-w-full overflow-x-auto">
            <DataTable
              pagination={pagination}
              data={employments}
              columns={Column}
              loading={getAllEmployments.isLoading}
              map={(category) => ({ key: category.id, ...category })}
              handleSelectedData={(_, selectedRows) => setSelectedData(selectedRows)}
            />
          </div>
        </Card>
      )}
    </div>
  );
};

export default Employment;
