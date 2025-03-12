import { DataLoader, DataTable, DataTableHeader } from '@/components';
import Modul from '@/constants/Modul';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import { SubmitLetterService } from '@/services';
import { Button, Card, List, Space, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { letterTypeFormFields, submitLetterFormFields } from './FormFields';
import { SubmitLetter as SubmitLetterModel } from '@/models';
import { Action } from '@/constants';
import { Delete, Detail, Edit } from '@/components/dashboard/button';
import { DownloadOutlined } from '@ant-design/icons';

const { UPDATE, DELETE } = Action;

const SubmitLetter = () => {
  const { token, user } = useAuth();
  const { success, error } = useNotification();
  const { execute: fetchSubmitLetter, ...getAllSubmitLetter } = useService(SubmitLetterService.getAll);
  const updateSubmitLetter = useService(SubmitLetterService.update);
  const deleteSubmitLetter = useService(SubmitLetterService.delete);
  const deleteBatchSubmitLetter = useService(SubmitLetterService.deleteBatch);
  const [selectedData, setSelectedData] = useState([]);

  const pagination = usePagination({ totalData: getAllSubmitLetter.totalData });

  const modal = useCrudModal();

  useEffect(() => {
    fetchSubmitLetter(token, pagination.page, pagination.per_page);
  }, [fetchSubmitLetter, pagination.page, pagination.per_page, token]);

  const submitLetter = getAllSubmitLetter.data ?? [];

  const Column = [
    {
      title: 'Token',
      dataIndex: 'token',
      sorter: (a, b) => a.token.length - b.token.length,
      searchable: true
    },
    {
      title: 'Nama Surat',
      dataIndex: ['letter_type', 'letter_name'],
      sorter: (a, b) => a.letter_type.letter_name.length - b.letter_type.letter_name.length,
      searchable: true
    },
    {
      title: 'Pemohon',
      dataIndex: ['resident', 'full_name'],
      sorter: (a, b) => a.resident.full_name.length - b.resident.full_name.length,
      searchable: true
    },
    {
      title: 'Status',
      dataIndex: 'status',
      sorter: (a, b) => a.status.length - b.status.length,
      searchable: true,
      render: (record) => {
        switch (record) {
          case 'selesai':
            return <Tag color="blue">Selesai</Tag>;
          case 'verifikasi':
            return <Tag color="green">Verifikasi</Tag>;
          case 'menunggu':
            return <Tag color="yellow">Menunggu</Tag>;
          default:
            return <Tag color="error">Undifined</Tag>;
        }
      }
    }
  ];

  if (user && user.eitherCan([UPDATE, SubmitLetterModel], [DELETE, SubmitLetterModel])) {
    Column.push({
      title: 'Aksi',
      render: (_, record) => (
        <Space size="small">
          <Edit
            title={`Edit ${Modul.LETTER_SUBMIT}`}
            model={SubmitLetterModel}
            onClick={() => {
              modal.edit({
                title: `Edit ${Modul.LETTER_SUBMIT}`,
                data: record,
                formFields: submitLetterFormFields,
                onSubmit: async (values) => {
                  const { message, isSuccess } = await updateSubmitLetter.execute(record.id, { ...values, _method: 'PUT' }, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchSubmitLetter(token);
                  } else {
                    error('Gagal', message);
                  }
                  return isSuccess;
                }
              });
            }}
          />
          <Detail
            title={`Detail ${Modul.LETTER_SUBMIT}`}
            model={SubmitLetterModel}
            onClick={() => {
              modal.show.description({
                title: 'Detail data permohonan surat',
                data: [
                  {
                    key: 'Token Surat',
                    label: `Token ${Modul.LETTER_SUBMIT}`,
                    children: record.token
                  },
                  {
                    key: 'status',
                    label: `Status `,
                    children: (() => {
                      let statusTag;
                      switch (record.status) {
                        case 'selesai':
                          statusTag = <Tag color="blue">Selesai</Tag>;
                          break;
                        case 'verifikasi':
                          statusTag = <Tag color="green">Verifikasi</Tag>;
                          break;
                        case 'menunggu':
                          statusTag = <Tag color="yellow">Menunggu</Tag>;
                          break;
                        default:
                          statusTag = <Tag color="error">Undefined</Tag>;
                      }
                      return statusTag;
                    })()
                  },
                  {
                    key: 'Nama Surat',
                    label: `Nama Surat`,
                    children: record.letter_type.letter_name
                  },
                  {
                    key: 'Kode Surat',
                    label: `Kode Surat`,
                    children: record.letter_type.letter_code
                  },
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
                    label: `Jenis Kelamin `,
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
                  },
                  {
                    key: 'Atribut Surat',
                    label: 'Atribut Surat',
                    children: (
                      <List
                        dataSource={record.letter_attribute}
                        renderItem={(item) => (
                          <List.Item>
                            <List.Item.Meta title={item.attribute_name} description={item.content} />
                          </List.Item>
                        )}
                      />
                    )
                  }
                ]
              });
            }}
          />
          <Delete
            title={`Delete ${Modul.LETTER_SUBMIT}`}
            model={SubmitLetterModel}
            onClick={() => {
              modal.delete.default({
                title: `Delete ${Modul.LETTER_SUBMIT}`,
                data: record,
                formFields: submitLetterFormFields,
                onSubmit: async () => {
                  const { isSuccess, message } = await deleteSubmitLetter.execute(record.id, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchSubmitLetter(token);
                  } else {
                    error('Gagal', message);
                  }
                  return isSuccess;
                }
              });
            }}
          />
          {record.status === 'selesai' && <Button icon={<DownloadOutlined />} onClick={() => window.open(record.download_link, '_blank')} />}
        </Space>
      )
    });
  }

  const onDeleteBatch = () => {
    modal.delete.batch({
      title: `Hapus ${selectedData.length} ${Modul.LETTER_SUBMIT} Yang Dipilih ? `,
      formFields: letterTypeFormFields,
      onSubmit: async () => {
        const ids = selectedData.map((item) => item.id);
        const { message, isSuccess } = await deleteBatchSubmitLetter.execute(ids, token);
        if (isSuccess) {
          success('Berhasil', message);
          fetchSubmitLetter(token);
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  return (
    <div>
      {getAllSubmitLetter.isLoading ? (
        <DataLoader type="datatable" />
      ) : (
        <Card>
          <DataTableHeader model={SubmitLetterModel} modul={Modul.LETTER_SUBMIT} onDeleteBatch={onDeleteBatch} selectedData={selectedData} />
          <div className="w-full max-w-full overflow-x-auto">
            <DataTable
              data={submitLetter}
              columns={Column}
              pagination={pagination}
              loading={getAllSubmitLetter.isLoading}
              map={(legalProducts) => ({ key: legalProducts.id, ...legalProducts })}
              handleSelectedData={(_, selectedRows) => setSelectedData(selectedRows)}
            />
          </div>
        </Card>
      )}
    </div>
  );
};

export default SubmitLetter;
