import { DataLoader, DataTable } from '@/components';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import { ResidentService } from '@/services';
import { DeleteOutlined, EditOutlined, ExportOutlined, ImportOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Space, Tag, Typography } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modul from '@/constants/Modul';
import { InputType } from '@/constants';

const Resident = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const { success, error } = useNotification();
  const { execute, ...getAllResident } = useService(ResidentService.getAll);
  const storeResident = useService(ResidentService.store);
  const importResident = useService(ResidentService.import);
  const exportResident = useService(ResidentService.export);
  const deleteResident = useService(ResidentService.delete);
  const deleteBatchResident = useService(ResidentService.deleteBatch);
  const [selectedResident, setSelectedResident] = useState([]);
  const modal = useCrudModal();
  const pagination = usePagination({ totalData: getAllResident.totalData });

  const fetchResident = useCallback(() => {
    execute(token, pagination.page, pagination.perPage);
  }, [execute, pagination.page, pagination.perPage, token]);

  useEffect(() => {
    fetchResident();
  }, [fetchResident]);

  const resident = getAllResident.data ?? [];

  const column = [
    {
      title: 'Nama Lengkap',
      dataIndex: 'full_name',
      sorter: (a, b) => a.full_name.length - b.full_name.length,
      searchable: true
    },
    {
      title: 'Jenis Kelamin',
      dataIndex: 'gender',
      sorter: (a, b) => a.gender.length - b.gender.length,
      searchable: true
    },
    {
      title: 'Hubungan Keluarga',
      dataIndex: 'family_relation',
      sorter: (a, b) => a.family_relation.length - b.family_relation.length,
      searchable: true
    },
    {
      title: 'Status',
      dataIndex: 'resident_status',
      sorter: (a, b) => a.resident_status.length - b.resident_status.length,
      searchable: true,
      render: (record) => {
        switch (record) {
          case 'tetap':
            return <Tag color="blue">Tetap</Tag>;
          case 'tidak tetap':
            return <Tag color="green">Tidak Tetap</Tag>;
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
              navigate(window.location.pathname + '/edit/' + record.id);
            }}
          />
          <Button
            icon={<DeleteOutlined />}
            variant="outlined"
            color="danger"
            onClick={() => {
              modal.delete.default({
                title: `Delete ${Modul.RESIDENTIAL}`,
                data: record,
                formFields: formFields,
                onSubmit: async () => {
                  const { isSuccess, message } = await deleteResident.execute(record.id, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchResident(token);
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

  const formFields = [
    {
      label: `NIK`,
      name: 'nik',
      type: InputType.TEXT,
      rules: [
        {
          required: true,
          message: `NIK harus diisi`
        }
      ]
    },
    {
      label: `Nomor KK`,
      name: 'kk_number',
      type: InputType.TEXT,
      rules: [
        {
          required: true,
          message: `Nomor KK harus diisi`
        }
      ]
    },
    {
      label: `Nama Lengkap`,
      name: 'full_name',
      type: InputType.TEXT,
      rules: [
        {
          required: true,
          message: `Nama Lengkap harus diisi`
        }
      ]
    },
    {
      label: `Hubungan Keluarga`,
      name: 'family_relation',
      type: InputType.SELECT,
      rules: [
        {
          required: true,
          message: `Hubungan Keluarga harus diisi`
        }
      ],
      options: [
        {
          label: 'Kepala Keluarga',
          value: 'kepala keluarga'
        },
        {
          label: 'Suami',
          value: 'suami'
        },
        {
          label: 'Istri',
          value: 'istri'
        },
        {
          label: 'Anak',
          value: 'anak'
        },
        {
          label: 'Mantu',
          value: 'mantu'
        },
        {
          label: 'Cucu',
          value: 'cucu'
        }
      ]
    },
    {
      label: `Status Kependudukan`,
      name: 'resident_status',
      type: InputType.SELECT,
      rules: [
        {
          required: true,
          message: `Status Kependudukan harus diisi`
        }
      ],
      options: [
        {
          label: 'Tetap',
          value: 'tetap'
        },
        {
          label: 'Tidak Tetap',
          value: 'tidak tetap'
        }
      ]
    },
    {
      label: `Status Pernikahan`,
      name: 'marital_status',
      type: InputType.SELECT,
      rules: [
        {
          required: true,
          message: `Status Pernikahan harus diisi`
        }
      ],
      options: [
        {
          label: 'Menikah',
          value: 'telah menikah'
        },
        {
          label: 'Belum Menikah',
          value: 'belum menikah'
        },
        {
          label: 'Cerai Hidup',
          value: 'cerai hidup'
        },
        {
          label: 'Cerai Mati',
          value: 'cerai mati'
        }
      ]
    },

    {
      label: `Jenis Kelamin`,
      name: 'gender',
      type: InputType.SELECT,
      rules: [
        {
          required: true,
          message: `Jenis Kelamin harus diisi`
        }
      ],
      options: [
        {
          label: 'Laki Laki',
          value: 'L'
        },
        {
          label: 'Perempuan',
          value: 'P'
        }
      ]
    },
    {
      label: `Agama`,
      name: 'religion',
      type: InputType.TEXT,
      rules: [
        {
          required: true,
          message: `Agama harus diisi`
        }
      ]
    }
  ];

  return (
    <>
      {getAllResident.isLoading ? (
        <DataLoader type="datatable" />
      ) : (
        <Card>
          <div className="mb-6 flex items-center justify-between">
            <Typography.Title level={5}>Data {Modul.RESIDENTIAL}</Typography.Title>
            <div className="inline-flex items-center gap-2">
              <Button
                variant="outlined"
                color="danger"
                disabled={selectedResident.length <= 0}
                icon={<DeleteOutlined />}
                onClick={() => {
                  modal.delete.batch({
                    title: `Hapus ${selectedResident.length} ${Modul.RESIDENTIAL} Yang Dipilih ? `,
                    onSubmit: async () => {
                      const ids = selectedResident.map((item) => item.id);
                      const { message, isSuccess } = await deleteBatchResident.execute(ids, token);
                      if (isSuccess) {
                        success('Berhasil', message);
                        fetchResident(token);
                      } else {
                        error('Gagal', message);
                      }
                      return isSuccess;
                    }
                  });
                }}
              >
                {Modul.RESIDENTIAL}
              </Button>
              <Button
                variant="solid"
                icon={<ImportOutlined />}
                onClick={() => {
                  modal.create({
                    formFields: [
                      {
                        label: `File ${Modul.RESIDENTIAL}`,
                        name: 'file',
                        type: InputType.UPLOAD,
                        max: 1,
                        beforeUpload: () => {
                          return false;
                        },
                        getFileList: (data) => {
                          return [
                            {
                              url: data?.file,
                              name: data?.name
                            }
                          ];
                        },
                        accept: ['.xlsx'],
                        rules: [{ required: true, message: 'Logo harus diisi' }]
                      }
                    ],
                    title: `Import ${Modul.RESIDENTIAL} `,
                    onSubmit: async (values) => {
                      const { message, isSuccess } = await importResident.execute(values, token, values.file.file);
                      if (isSuccess) {
                        success('Berhasil', message);
                        fetchResident(token);
                      } else {
                        error('Gagal', message);
                      }
                      return isSuccess;
                    }
                  });
                }}
              >
                Import
              </Button>
              <Button
                variant="solid"
                loading={exportResident.isLoading}
                icon={<ExportOutlined />}
                onClick={async () => {
                  const { message, isSuccess } = await exportResident.execute(token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchResident(token);
                  } else {
                    error('Gagal', message);
                  }
                  return isSuccess;
                }}
              >
                Export
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  modal.create({
                    title: `Tambah ${Modul.RESIDENTIAL}`,
                    formFields: formFields,
                    onSubmit: async (values) => {
                      const { message, isSuccess } = await storeResident.execute(values, token);
                      if (isSuccess) {
                        success('Berhasil', message);
                        fetchResident(token);
                      } else {
                        error('Gagal', message);
                      }
                      return isSuccess;
                    }
                  });
                }}
              >
                {Modul.RESIDENTIAL}
              </Button>
            </div>
          </div>
          <div className="w-full max-w-full overflow-x-auto">
            <DataTable data={resident} columns={column} loading={getAllResident.isLoading} map={(article) => ({ key: article.id, ...article })} handleSelectedData={(_, selectedRows) => setSelectedResident(selectedRows)} pagination={pagination} />
          </div>
        </Card>
      )}
    </>
  );
};

export default Resident;
