import { DataLoader, DataTable } from '@/components';
import Modul from '@/constants/Modul';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import { PublicAssistanceService } from '@/services';
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Space, Tag, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { formFields } from './FormFields';

const PublicAssistance = () => {
  const { token } = useAuth();
  const { success, error } = useNotification();
  const { execute: fetchPublicAssistance, ...getAllPublicAssistance } = useService(PublicAssistanceService.getAll);
  const storePublicAssistance = useService(PublicAssistanceService.store);
  const updatePublicAssistance = useService(PublicAssistanceService.update);
  const deletePublicAssistance = useService(PublicAssistanceService.delete);
  const deleteBatchPublicAssistance = useService(PublicAssistanceService.deleteBatch);
  const [selectedData, setSelectedData] = useState([]);

  const pagination = usePagination({ totalData: getAllPublicAssistance.totalData });

  const modal = useCrudModal();

  useEffect(() => {
    fetchPublicAssistance(token, pagination.page, pagination.perPage);
  }, [fetchPublicAssistance, pagination.page, pagination.perPage, token]);

  const apbdItem = getAllPublicAssistance.data ?? [];

  const Column = [
    {
      title: 'Nama Bantuan',
      dataIndex: 'public_assistance_name',
      sorter: (a, b) => a.public_assistance_name.length - b.component_name.length,
      searchable: true
    },
    {
      title: 'Sasaran Program',
      dataIndex: 'program_target',
      sorter: (a, b) => a.program_target.length - b.program_target.length,
      searchable: true
    },
    {
      title: 'Asal Dana',
      dataIndex: 'source_funding',
      sorter: (a, b) => a.source_funding.length - b.source_funding.length,
      searchable: true
    },
    {
      title: 'Status',
      dataIndex: 'status',
      sorter: (a, b) => a.status.length - b.status.length,
      searchable: true,
      render: (_, record) => {
        switch (record.status) {
          case 'aktif':
            return <Tag color="blue">Aktif</Tag>;
          case 'nonaktif':
            return <Tag color="warning">Non-Aktif</Tag>;
          default:
            return <Tag color="error">Undifined</Tag>;
        }
      }
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
                title: `Edit ${Modul.PUBLIC_ASSISTANCE}`,
                data: record,
                formFields: formFields,
                onSubmit: async (values) => {
                  const { message, isSuccess } = await updatePublicAssistance.execute(record.id, values, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchPublicAssistance(token);
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
                title: record.public_assistance_name,
                data: [
                  {
                    key: 'public_assistance_name',
                    label: `Nama ${Modul.PUBLIC_ASSISTANCE}`,
                    children: record.public_assistance_name
                  },
                  {
                    key: 'program_target',
                    label: `Target ${Modul.PUBLIC_ASSISTANCE}`,
                    children: record.program_target
                  },
                  {
                    key: 'source_funding',
                    label: `Asal Dana ${Modul.PUBLIC_ASSISTANCE}`,
                    children: record.source_funding
                  },
                  {
                    key: 'status',
                    label: `Status `,
                    children: (() => {
                      let statusTag;
                      switch (record.status) {
                        case 'aktif':
                          statusTag = <Tag color="blue">Aktif</Tag>;
                          break;
                        case 'nonaktif':
                          statusTag = <Tag color="warning">Non-Aktif</Tag>;
                          break;
                        default:
                          statusTag = <Tag color="error">Undefined</Tag>;
                      }
                      return statusTag;
                    })()
                  },
                  {
                    key: 'description',
                    label: `Keterangan`,
                    children: record.description
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
                title: `Delete ${Modul.PUBLIC_ASSISTANCE}`,
                data: record,
                formFields: formFields,
                onSubmit: async () => {
                  const { isSuccess, message } = await deletePublicAssistance.execute(record.id, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchPublicAssistance(token);
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
      {getAllPublicAssistance.isLoading ? (
        <DataLoader type="datatable" />
      ) : (
        <Card>
          <div className="mb-6 flex items-center justify-between">
            <Typography.Title level={5}>Data {Modul.PUBLIC_ASSISTANCE}</Typography.Title>
            <div className="inline-flex items-center gap-2">
              <Button
                variant="outlined"
                color="danger"
                disabled={selectedData.length <= 0}
                icon={<DeleteOutlined />}
                onClick={() => {
                  modal.delete.batch({
                    title: `Hapus ${selectedData.length} ${Modul.PUBLIC_ASSISTANCE} Yang Dipilih ? `,
                    onSubmit: async () => {
                      const ids = selectedData.map((item) => item.id);
                      const { message, isSuccess } = await deleteBatchPublicAssistance.execute(ids, token);
                      if (isSuccess) {
                        success('Berhasil', message);
                        fetchPublicAssistance(token);
                      } else {
                        error('Gagal', message);
                      }
                      return isSuccess;
                    }
                  });
                }}
              >
                {Modul.PUBLIC_ASSISTANCE}
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  modal.create({
                    title: `Tambah ${Modul.PUBLIC_ASSISTANCE}`,
                    formFields: formFields,
                    onSubmit: async (values) => {
                      const { message, isSuccess } = await storePublicAssistance.execute(values, token);
                      if (isSuccess) {
                        success('Berhasil', message);
                        fetchPublicAssistance(token);
                      } else {
                        error('Gagal', message);
                      }
                      return isSuccess;
                    }
                  });
                }}
              >
                {Modul.PUBLIC_ASSISTANCE}
              </Button>
            </div>
          </div>
          <div className="w-full max-w-full overflow-x-auto">
            <DataTable data={apbdItem} columns={Column} loading={getAllPublicAssistance.isLoading} map={(legalProducts) => ({ key: legalProducts.id, ...legalProducts })} handleSelectedData={(_, selectedRows) => setSelectedData(selectedRows)} />
          </div>
        </Card>
      )}
    </div>
  );
};

export default PublicAssistance;
