import { DataTable, DataTableHeader } from '@/components';
import Modul from '@/constants/Modul';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import { PublicTaxService, ResidentService, TaxPeriodService } from '@/services';
import { Card, Space, Tag } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { publicTaxFilterFields, publicTaxFormFields } from './FormFields';
import { PublicTax as PublicTaxModel } from '@/models';
import { useParams } from 'react-router-dom';
import { Action, InputType } from '@/constants';
import { Delete, Detail, Edit } from '@/components/dashboard/button';
import { BASE_URL } from '@/utils/api';

const { UPDATE, DELETE, READ } = Action;

const PublicTax = () => {
  const { token, user } = useAuth();
  const { success, error } = useNotification();
  const { id } = useParams();
  const { execute, ...getAllPublicTax } = useService(PublicTaxService.getAll);
  const { execute: fetchDetailTax, ...getDetailTax } = useService(TaxPeriodService.getById);
  const { execute: fetchResident } = useService(ResidentService.getAll);
  const storePublicTax = useService(PublicTaxService.store);
  const updatePublicTax = useService(PublicTaxService.update);
  const deletePublicTax = useService(PublicTaxService.delete);
  const deleteBatchPublicTax = useService(PublicTaxService.deleteBatch);
  const importPublicTax = useService(PublicTaxService.import);
  const [selectedData, setSelectedData] = useState([]);
  const pagination = usePagination({ totalData: getAllPublicTax.totalData });
  const modal = useCrudModal();
  const [filterValues, setFilterValues] = useState({ search: '', status: null });

  const fetchPublicTax = useCallback(() => {
    execute({
      token: token,
      page: pagination.page,
      per_page: pagination.per_page,
      search: filterValues.search,
      status: filterValues.status
    });
  }, [execute, filterValues.search, filterValues.status, pagination.page, pagination.per_page, token]);

  useEffect(() => {
    fetchPublicTax();
    fetchDetailTax(token, id);
  }, [fetchDetailTax, fetchPublicTax, id, token]);

  const publicTax = getAllPublicTax.data ?? [];
  const detailTax = getDetailTax.data ?? {};

  const exportPublicTax = () => {
    fetch(`${BASE_URL}/wajib-pajak/export?periode_pajak_id=${detailTax.id}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }
    })
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `wajib_pajak_(${detailTax.tax_name} - ${detailTax.year}).xlsx`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      })
      .catch((error) => console.error('Export failed:', error));
  };

  const Column = [
    {
      title: 'Nama Lengkap',
      dataIndex: ['resident', 'full_name'],
      sorter: (a, b) => a.resident.full_name.length - b.resident.full_name.length,
      searchable: true
    },
    {
      title: 'NIK Penduduk',
      dataIndex: ['resident', 'nik'],
      sorter: (a, b) => a.resident.nik.length - b.resident.nik.length,
      searchable: true
    },
    {
      title: 'Status',
      dataIndex: 'status',
      sorter: (a, b) => a.status.length - b.status.length,
      searchable: true,
      render: (_, record) => {
        switch (record.status) {
          case 'lunas':
            return <Tag color="blue">Lunas</Tag>;
          case 'belum bayar':
            return <Tag color="warning">Belum Lunas</Tag>;
          default:
            return <Tag color="error">{record.status}</Tag>;
        }
      }
    }
  ];

  if (user && user.eitherCan([UPDATE, PublicTaxModel], [DELETE, PublicTaxModel], [READ, PublicTaxModel])) {
    Column.push({
      title: 'Aksi',
      render: (_, record) => (
        <Space size="small">
          <Edit
            title={`Edit Peserta ${Modul.TAX}`}
            model={PublicTaxModel}
            onClick={() => {
              modal.edit({
                title: `Edit ${Modul.TAX}`,
                data: { ...record, resident: record.resident.id, tax_period: record.tax_period.id },
                formFields: publicTaxFormFields({ fetchResident }),
                onSubmit: async (values) => {
                  const { message, isSuccess } = await updatePublicTax.execute(
                    record.id,
                    {
                      ...values,
                      tax_period: id
                    },
                    token
                  );
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchPublicTax({ token: token, page: pagination.page, per_page: pagination.per_page });
                  } else {
                    error('Gagal', message);
                  }
                  return isSuccess;
                }
              });
            }}
          />
          <Detail
            title={`Detail Peserta ${Modul.TAX}`}
            model={PublicTaxModel}
            onClick={() => {
              modal.show.description({
                title: record.tax_name,
                data: [
                  {
                    key: 'full_name',
                    label: `Nama Penduduk ${Modul.TAX}`,
                    children: record.resident.full_name
                  },
                  {
                    key: 'nik',
                    label: `NIK`,
                    children: record.resident.nik
                  },
                  {
                    key: 'family_relation',
                    label: `Hubungan Keluarga`,
                    children: record.resident.family_relation
                  },
                  {
                    key: 'resident_status',
                    label: `Status Kependudukan`,
                    children: record.resident.resident_status
                  },
                  {
                    key: 'marital_status',
                    label: `Status Pernikahan`,
                    children: record.resident.marital_status
                  },
                  {
                    key: 'kk_number',
                    label: `Nomor KK`,
                    children: record.resident.kk_number
                  },
                  {
                    key: 'gender',
                    label: `Jenis Kelamin`,
                    children: record.resident.gender
                  },
                  {
                    key: 'religion',
                    label: `Agama`,
                    children: record.resident.religion
                  },
                  {
                    key: 'tax_name',
                    label: `Nama Pajak`,
                    children: record.tax_period.tax_name
                  },
                  {
                    key: 'year',
                    label: `Tahun Periode Pajak`,
                    children: record.tax_period.year
                  },
                  {
                    key: 'date_start',
                    label: `Tanggal Mulai Periode Pajak`,
                    children: record.tax_period.date_start
                  },
                  {
                    key: 'date_end',
                    label: `Tanggal Akhir Periode Pajak`,
                    children: record.tax_period.date_end
                  },
                  {
                    key: 'status',
                    label: `Status `,
                    children: (() => {
                      let statusTag;
                      switch (record.status) {
                        case 'lunas':
                          statusTag = <Tag color="blue">Lunas</Tag>;
                          break;
                        case 'belum bayar':
                          statusTag = <Tag color="warning">Belum Bayar</Tag>;
                          break;
                        default:
                          statusTag = <Tag color="error">Undefined</Tag>;
                      }
                      return statusTag;
                    })()
                  }
                ]
              });
            }}
          />
          <Delete
            title={`Delete Peserta ${Modul.TAX}`}
            model={PublicTaxModel}
            onClick={() => {
              modal.delete.default({
                title: `Delete ${Modul.TAX}`,
                onSubmit: async () => {
                  const { isSuccess, message } = await deletePublicTax.execute(record.id, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchPublicTax({ token: token, page: pagination.page, per_page: pagination.per_page });
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
      title: `Hapus ${selectedData.length} Peserta ${Modul.TAX} Yang Dipilih ? `,
      onSubmit: async () => {
        const ids = selectedData.map((item) => item.id);
        const { message, isSuccess } = await deleteBatchPublicTax.execute(ids, token);
        if (isSuccess) {
          success('Berhasil', message);
          fetchPublicTax({ token: token, page: pagination.page, per_page: pagination.per_page });
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  const onCreate = () => {
    modal.create({
      title: `Tambah Peserta ${Modul.TAX}`,
      formFields: publicTaxFormFields({ fetchResident }),
      onSubmit: async (values) => {
        const { message, isSuccess } = await storePublicTax.execute(
          {
            ...values,
            tax_period: id
          },
          token
        );
        if (isSuccess) {
          success('Berhasil', message);
          fetchPublicTax({ token: token, page: pagination.page, per_page: pagination.per_page });
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  const onImport = () => {
    modal.create({
      formFields: [
        {
          label: `File Peserta ${Modul.TAX} `,
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
      title: `Import Peserta ${Modul.TAX} `,
      onSubmit: async (values) => {
        const { message, isSuccess } = await importPublicTax.execute({ ...values, periode_pajak_id: id }, token, values.file.file);
        if (isSuccess) {
          success('Berhasil', message);
          fetchResident({ token: token, page: pagination.page, per_page: pagination.per_page });
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  const filter = {
    formFields: publicTaxFilterFields(),
    initialData: {
      status: filterValues.status
    },
    isLoading: getAllPublicTax.isLoading,
    onSubmit: (values) => {
      setFilterValues({
        status: values.status
      });
    }
  };

  return (
    <div>
      <Card>
        <DataTableHeader
          filter={filter}
          onSearch={(values) => setFilterValues({ ...filterValues, search: values })}
          model={PublicTaxModel}
          modul={`Detail ${detailTax.tax_name}`}
          onStore={onCreate}
          onDeleteBatch={onDeleteBatch}
          selectedData={selectedData}
          onExport={exportPublicTax}
          onImport={{ templateFile: 'wajib_pajak.xlsx', importHandler: onImport }}
        />
        <div className="w-full max-w-full overflow-x-auto">
          <DataTable
            data={publicTax}
            columns={Column}
            pagination={pagination}
            loading={getAllPublicTax.isLoading}
            map={(legalProducts) => ({ key: legalProducts.id, ...legalProducts })}
            handleSelectedData={(_, selectedRows) => setSelectedData(selectedRows)}
          />
        </div>
      </Card>
    </div>
  );
};

export default PublicTax;
