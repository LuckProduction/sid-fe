import { DataLoader, DataTable, DataTableHeader } from '@/components';
import Modul from '@/constants/Modul';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import { BeneficiaryService, PublicAssistanceService, ResidentService, VillageInstitutionService } from '@/services';
import { Card, Descriptions, Empty, Space, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { institutionFormFields, residentFormFields } from './FormFields';
import { useParams } from 'react-router-dom';
import { Delete, Detail, Edit } from '@/components/dashboard/button';
import { Action, InputType } from '@/constants';
import { Beneficiary as BeneficiaryModel } from '@/models';

const { DELETE, UPDATE, READ } = Action;

const Beneficiary = () => {
  const { token, user } = useAuth();
  const { success, error } = useNotification();
  const { id } = useParams();
  const { execute: fetchBeneficiary, ...getAllBeneficiary } = useService(BeneficiaryService.getAll);
  const { execute: fetchResident, ...getAllResident } = useService(ResidentService.getAll);
  const { execute: fetchPublicAssistanceById, ...getAllPublicAssistanceById } = useService(PublicAssistanceService.getById);
  const { execute: fetchVillageInstitution, ...getAllVillageInstitution } = useService(VillageInstitutionService.getAll);
  const { execute: fetchPublicAssistance, ...getAllPublicAssistance } = useService(PublicAssistanceService.getAll);
  const storeBeneficiary = useService(BeneficiaryService.store);
  const updateBeneficiary = useService(BeneficiaryService.update);
  const deleteBeneficiary = useService(BeneficiaryService.delete);
  const deleteBatchBeneficiary = useService(BeneficiaryService.deleteBatch);
  const importBeneficiary = useService(BeneficiaryService.import);
  const [selectedData, setSelectedData] = useState([]);

  const pagination = usePagination({ totalData: getAllBeneficiary.totalData });
  const modal = useCrudModal();

  useEffect(() => {
    fetchBeneficiary(token, id, pagination.page, pagination.per_page);
    fetchResident({ token: token });
    fetchVillageInstitution({ token: token });
    fetchPublicAssistance(token);
    fetchPublicAssistanceById(token, id);
  }, [fetchBeneficiary, fetchPublicAssistance, fetchPublicAssistanceById, fetchResident, fetchVillageInstitution, id, pagination.page, pagination.per_page, token]);

  const beneficiary = getAllBeneficiary.data ?? [];
  const resident = getAllResident.data ?? [];
  const villageInstitution = getAllVillageInstitution.data ?? [];
  const publicAssistance = getAllPublicAssistance.data ?? [];
  const publicAssistanceById = getAllPublicAssistanceById.data ?? [];

  const exportBeneficiary = () => {
    fetch(`http://desa1.api-example.govillage.id/api/peserta-bantuan/export?bantuan_id=${id}`, {
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
        a.download = 'peserta_bantuan.xlsx';
        document.body.appendChild(a);
        a.click();
        a.remove();
      })
      .catch((error) => console.error('Export failed:', error));
  };

  const Column = [];

  if (publicAssistanceById?.program_target === 'penduduk' || publicAssistanceById?.program_target === 'kartu keluarga') {
    Column.push(
      {
        title: 'Nama Penerima',
        dataIndex: ['beneficiary', 'full_name'],
        sorter: (a, b) => a.beneficiary.full_name.length - b.beneficiary.full_name.length,
        searchable: true
      },
      {
        title: 'Huubunga Keluarga',
        dataIndex: ['beneficiary', 'family_relation'],
        sorter: (a, b) => a.beneficiary.family_relation.length - b.beneficiary.family_relation.length,
        searchable: true
      },
      {
        title: 'Jenis Kelamin',
        dataIndex: ['beneficiary', 'gender'],
        sorter: (a, b) => a.beneficiary.gender.length - b.beneficiary.gender.length,
        searchable: true
      },
      {
        title: 'Status Pernikahan',
        dataIndex: ['beneficiary', 'marital_status'],
        sorter: (a, b) => a.beneficiary.marital_status.length - b.beneficiary.marital_status.length,
        searchable: true
      },
      {
        title: 'Status Penduduk',
        dataIndex: ['beneficiary', 'resident_status'],
        sorter: (a, b) => a.beneficiary.resident_status.length - b.beneficiary.resident_status.length,
        searchable: true
      }
    );

    if (user && user.eitherCan([UPDATE, BeneficiaryModel], [DELETE, BeneficiaryModel], [READ, BeneficiaryModel])) {
      Column.push({
        title: 'Aksi',
        render: (_, record) => (
          <Space size="small">
            <Edit
              title={`Edit ${Modul.BENEFICIARY}`}
              model={BeneficiaryModel}
              onClick={() => {
                modal.edit({
                  title: `Edit ${Modul.BENEFICIARY}`,
                  data: { ...record, beneficiary: record.beneficiary.id, public_assistance: record.public_assistance.id },
                  formFields: residentFormFields({ fetchResident }),
                  onSubmit: async (values) => {
                    const { message, isSuccess } = await updateBeneficiary.execute(record.id, { ...values, public_assistance: publicAssistanceById?.id }, token);
                    if (isSuccess) {
                      success('Berhasil', message);
                      fetchBeneficiary(token, id, pagination.page, pagination.per_page);
                    } else {
                      error('Gagal', message);
                    }
                    return isSuccess;
                  }
                });
              }}
            />
            <Detail
              title={`Detail ${Modul.BENEFICIARY}`}
              model={BeneficiaryModel}
              onClick={() => {
                modal.show.description({
                  title: record.beneficiary.full_name,
                  data: [
                    {
                      key: 'beneficiary.full_name',
                      label: `Nama ${Modul.BENEFICIARY}`,
                      children: record.beneficiary.full_name
                    },
                    {
                      key: 'beneficiary.nik',
                      label: `NIK`,
                      children: record.beneficiary.nik
                    },
                    {
                      key: 'beneficiary.family_relation',
                      label: `Hubungan Keluarga`,
                      children: record.beneficiary.family_relation
                    },
                    {
                      key: 'beneficiary.resident_status',
                      label: `Status Penduduk`,
                      children: record.beneficiary.resident_status
                    },
                    {
                      key: 'beneficiary.marital_status',
                      label: `Status Perkawinan`,
                      children: record.beneficiary.marital_status
                    },
                    {
                      key: 'beneficiary.kk_number',
                      label: `KK`,
                      children: record.beneficiary.kk_number
                    },
                    {
                      key: 'beneficiary.gender',
                      label: `Jenis Kelamin`,
                      children: record.beneficiary.gender
                    },
                    {
                      key: 'beneficiary.religion',
                      label: `Agama`,
                      children: record.beneficiary.religion
                    }
                  ]
                });
              }}
            />
            <Delete
              title={`Delete ${Modul.BENEFICIARY}`}
              model={BeneficiaryModel}
              onClick={() => {
                modal.delete.default({
                  title: `Delete ${Modul.BENEFICIARY}`,
                  formFields: residentFormFields({ options: { resident, publicAssistance } }),
                  data: { ...record, beneficiary: record.beneficiary.id, public_assistance: record.public_assistance.id },
                  onSubmit: async () => {
                    const { isSuccess, message } = await deleteBeneficiary.execute(record.id, token);
                    if (isSuccess) {
                      success('Berhasil', message);
                      fetchBeneficiary(token, id, pagination.page, pagination.per_page);
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
  }

  if (publicAssistanceById?.program_target === 'lembaga') {
    Column.push(
      {
        title: 'Nama Lembaga',
        dataIndex: ['beneficiary', 'institution_name'],
        sorter: (a, b) => a.beneficiary.institution_name.length - b.beneficiary.institution_name.length,
        searchable: true
      },
      {
        title: 'Kode Lembaga',
        dataIndex: ['beneficiary', 'institution_code'],
        sorter: (a, b) => a.beneficiary.institution_code.length - b.beneficiary.institution_code.length,
        searchable: true
      }
    );

    if (user && user.eitherCan([UPDATE, BeneficiaryModel], [DELETE, BeneficiaryModel], [READ, BeneficiaryModel])) {
      Column.push({
        title: 'Aksi',
        render: (_, record) => (
          <Space size="small">
            <Edit
              title={`Edit ${Modul.BENEFICIARY}`}
              model={BeneficiaryModel}
              onClick={() => {
                modal.edit({
                  title: `Edit ${Modul.PUBLIC_ASSISTANCE}`,
                  data: { ...record, beneficiary: record.beneficiary.id, public_assistance: record.public_assistance.id },
                  formFields: institutionFormFields({ options: { villageInstitution, publicAssistance } }),
                  onSubmit: async (values) => {
                    const { message, isSuccess } = await updateBeneficiary.execute(record.id, { ...values, public_assistance: publicAssistanceById?.id }, token);
                    if (isSuccess) {
                      success('Berhasil', message);
                      fetchBeneficiary(token, id, pagination.page, pagination.per_page);
                    } else {
                      error('Gagal', message);
                    }
                    return isSuccess;
                  }
                });
              }}
            />
            <Detail
              title={`Detail ${Modul.BENEFICIARY}`}
              model={BeneficiaryModel}
              onClick={() => {
                modal.show.description({
                  title: record.beneficiary.institution_name,
                  data: [
                    {
                      key: 'beneficiary.institution_name',
                      label: `Nama Lembaga ${Modul.BENEFICIARY}`,
                      children: record.beneficiary.institution_name
                    },
                    {
                      key: 'beneficiary.institution_code',
                      label: `Kode Lembaga ${Modul.BENEFICIARY}`,
                      children: record.beneficiary.institution_code
                    },
                    {
                      key: 'beneficiary.status',
                      label: `Status Lembaga ${Modul.BENEFICIARY}`,
                      children: (() => {
                        let statusTag;
                        switch (record.beneficiary.status) {
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
                    }
                  ]
                });
              }}
            />
            <Delete
              title={`Delete ${Modul.BENEFICIARY}`}
              model={BeneficiaryModel}
              onClick={() => {
                modal.delete.default({
                  title: `Delete ${Modul.BENEFICIARY}`,
                  formFields: institutionFormFields({ options: { villageInstitution, publicAssistance } }),
                  data: { ...record, beneficiary: record.beneficiary.id, public_assistance: record.public_assistance.id },
                  onSubmit: async () => {
                    const { isSuccess, message } = await deleteBeneficiary.execute(record.id, token);
                    if (isSuccess) {
                      success('Berhasil', message);
                      fetchBeneficiary(token, id, pagination.page, pagination.per_page);
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
  }

  const onDeleteBatch = () => {
    modal.delete.batch({
      title: `Hapus ${selectedData.length} ${Modul.BENEFICIARY} Yang Dipilih ? `,
      onSubmit: async () => {
        const ids = selectedData.map((item) => item.id);
        const { message, isSuccess } = await deleteBatchBeneficiary.execute(ids, token);
        if (isSuccess) {
          success('Berhasil', message);
          fetchBeneficiary(token, id, pagination.page, pagination.per_page);
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
          label: `File ${Modul.BENEFICIARY} `,
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
      title: `Import ${Modul.BENEFICIARY} `,
      onSubmit: async (values) => {
        const { message, isSuccess } = await importBeneficiary.execute({ ...values, bantuan_id: id }, token, values.file.file);
        if (isSuccess) {
          success('Berhasil', message);
          fetchBeneficiary(token, id, pagination.page, pagination.per_page);
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  const onCreate = () => {
    modal.create({
      title: `Tambah ${Modul.BENEFICIARY}`,
      formFields: publicAssistanceById?.program_target === 'penduduk' || publicAssistanceById?.program_target === 'kartu keluarga' ? residentFormFields({ fetchResident }) : institutionFormFields({ options: { villageInstitution, publicAssistance } }),
      onSubmit: async (values) => {
        const { message, isSuccess } = await storeBeneficiary.execute({ ...values, public_assistance: publicAssistanceById?.id }, token);
        if (isSuccess) {
          success('Berhasil', message);
          fetchBeneficiary(token, id, pagination.page, pagination.per_page);
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  return (
    <div>
      {getAllBeneficiary.isLoading ? (
        <DataLoader type="datatable" />
      ) : (
        <div className="grid grid-cols-12 gap-6">
          <Card className="col-span-12">
            <Descriptions bordered>
              <Descriptions.Item label="Nama Bantuan">{publicAssistanceById.public_assistance_name}</Descriptions.Item>
              <Descriptions.Item label="Target Bantuan">{publicAssistanceById.program_target}</Descriptions.Item>
              <Descriptions.Item label="Sumber Dana">{publicAssistanceById.source_funding}</Descriptions.Item>
              <Descriptions.Item label="Status">
                {(() => {
                  switch (publicAssistanceById.status) {
                    case 'aktif':
                      return <Tag color="blue">Aktif</Tag>;
                    case 'nonaktif':
                      return <Tag color="warning">Non-Aktif</Tag>;
                    default:
                      return <Tag color="error">Undefined</Tag>;
                  }
                })()}
              </Descriptions.Item>
            </Descriptions>
          </Card>
          <Card className="col-span-12">
            <DataTableHeader
              model={BeneficiaryModel}
              modul={Modul.BENEFICIARY}
              onStore={onCreate}
              onDeleteBatch={onDeleteBatch}
              selectedData={selectedData}
              onExport={exportBeneficiary}
              onImport={
                publicAssistanceById?.program_target === 'penduduk'
                  ? {
                      templateFile: 'peserta_bantuan_penduduk.xlsx',
                      importHandler: onImport
                    }
                  : undefined
              }
            />
            <div className="w-full max-w-full overflow-x-auto">
              {getAllBeneficiary?.data?.length === 0 ? (
                <Empty className="mb-4" />
              ) : (
                <DataTable
                  data={beneficiary}
                  pagination={pagination}
                  columns={Column}
                  loading={getAllBeneficiary.isLoading}
                  map={(legalProducts) => ({ key: legalProducts.id, ...legalProducts })}
                  handleSelectedData={(_, selectedRows) => setSelectedData(selectedRows)}
                />
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Beneficiary;
