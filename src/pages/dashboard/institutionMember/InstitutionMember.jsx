import { DataLoader, DataTable } from '@/components';
import Modul from '@/constants/Modul';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import { EmploymentService, InstitutionMemberService, ResidentService, VillageInstitutionService } from '@/services';
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Image, Space, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { institutionMemberFormFields } from './FormFields';
import { useParams } from 'react-router-dom';

const InstitutionMember = () => {
  const { token } = useAuth();
  const { success, error } = useNotification();
  const { id } = useParams();
  const { execute: fetchInstitutionMember, ...getAllInstitutionMember } = useService(InstitutionMemberService.getAll);
  const { execute: fetchVillageInstitutionById, ...getAllVillageInstitutionById } = useService(VillageInstitutionService.getAll);
  const { execute: fetchResident, ...getAllResident } = useService(ResidentService.getAll);
  const { execute: fetchEmployment, ...getAllEmployment } = useService(EmploymentService.getAll);
  const storeInstitutionMember = useService(InstitutionMemberService.store);
  const updateInstitutionMember = useService(InstitutionMemberService.update);
  const deleteInstitutionMember = useService(InstitutionMemberService.delete);
  const deleteBatchInstitutionMember = useService(InstitutionMemberService.deleteBatch);
  const [selectedInstitutionMember, setSelectedInstitutionMember] = useState([]);

  const modal = useCrudModal();

  const pagination = usePagination({ totalData: getAllInstitutionMember.totalData });

  useEffect(() => {
    fetchInstitutionMember(token, id, pagination.page, pagination.perPage);
    fetchResident(token);
    fetchEmployment(token);
    fetchVillageInstitutionById(token, id);
  }, [fetchEmployment, fetchInstitutionMember, fetchResident, fetchVillageInstitutionById, id, pagination.page, pagination.perPage, token]);

  const institutionMember = getAllInstitutionMember.data ?? [];
  const villageInstitutionById = getAllVillageInstitutionById.data ?? [];
  const resident = getAllResident.data ?? [];
  const employment = getAllEmployment.data ?? [];

  const villagePotentialColumn = [
    {
      title: 'Lembaga',
      dataIndex: ['village_institution', 'institution_name'],
      sorter: (a, b) => a.village_institution.institution_name.length - b.village_institution.institution_name.length,
      searchable: true
    },
    {
      title: 'Nama Anggota',
      dataIndex: ['resident', 'full_name'],
      sorter: (a, b) => a.resident.full_name.length - b.resident.full_name.length,
      searchable: true
    },
    {
      title: 'Jabatan',
      dataIndex: ['employment', 'employment_name'],
      sorter: (a, b) => a.employment.employment_name.length - b.employment.employment_name.length,
      searchable: true
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
                title: `Edit ${Modul.VILLAGE_POTENTIALS}`,
                data: { ...record, village_institution: record.village_institution.id, employment: record.employment.id, resident: record.resident.id },
                formFields: institutionMemberFormFields({ options: { employment, resident } }),
                onSubmit: async (values) => {
                  const { message, isSuccess } = await updateInstitutionMember.execute(record.id, { ...values, village_institution: villageInstitutionById.id, _method: 'PUT' }, token, values.foto.file);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchInstitutionMember(token);
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
                title: record.resident.full_name,
                data: [
                  {
                    key: 'full_name',
                    label: `Nama ${Modul.INSTITUTION_MEMBER}`,
                    children: record.resident.full_name
                  },
                  {
                    key: 'employment',
                    label: `Jabatan ${Modul.INSTITUTION_MEMBER}`,
                    children: record.employment.employment_name
                  },
                  {
                    key: 'Lembaga',
                    label: `Lembaga`,
                    children: record.village_institution.institution_name
                  },
                  {
                    key: 'foto',
                    label: `Foto`,
                    children: <Image src={record.foto} />
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
                title: `Delete ${Modul.VILLAGE_POTENTIALS}`,
                data: { ...record, village_institution: record.village_institution.id, employment: record.employment.id, resident: record.resident.id },
                formFields: institutionMemberFormFields({ options: { employment, resident } }),
                onSubmit: async () => {
                  const { isSuccess, message } = await deleteInstitutionMember.execute(record.id, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchInstitutionMember(token);
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
    <>
      {getAllInstitutionMember.isLoading ? (
        <DataLoader type="datatable" />
      ) : (
        <div className="grid w-full grid-cols-12 gap-4">
          <Card className="col-span-12">
            <div className="mb-6 flex items-center justify-between">
              <Typography.Title level={5}>Data {Modul.INSTITUTION_MEMBER}</Typography.Title>
              <div className="inline-flex items-center gap-2">
                <Button
                  variant="outlined"
                  color="danger"
                  disabled={selectedInstitutionMember.length <= 0}
                  icon={<DeleteOutlined />}
                  onClick={() => {
                    modal.delete.batch({
                      title: `Hapus ${selectedInstitutionMember.length} ${Modul.VILLAGE_POTENTIALS} Yang Dipilih ? `,
                      onSubmit: async () => {
                        const ids = selectedInstitutionMember.map((item) => item.id);
                        const { message, isSuccess } = await deleteBatchInstitutionMember.execute(ids, token);
                        if (isSuccess) {
                          success('Berhasil', message);
                          fetchInstitutionMember(token);
                        } else {
                          error('Gagal', message);
                        }
                        return isSuccess;
                      }
                    });
                  }}
                >
                  {Modul.INSTITUTION_MEMBER}
                </Button>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    modal.create({
                      title: `Tambah ${Modul.VILLAGE_POTENTIALS}`,
                      formFields: institutionMemberFormFields({ options: { employment, resident } }),
                      onSubmit: async (values) => {
                        const { message, isSuccess } = await storeInstitutionMember.execute({ ...values, village_institution: villageInstitutionById.id }, token, values.foto.file);
                        if (isSuccess) {
                          success('Berhasil', message);
                          fetchInstitutionMember(token);
                        } else {
                          error('Gagal', message);
                        }
                        return isSuccess;
                      }
                    });
                  }}
                >
                  {Modul.INSTITUTION_MEMBER}
                </Button>
              </div>
            </div>
            <div className="w-full max-w-full overflow-x-auto">
              <DataTable
                data={institutionMember}
                columns={villagePotentialColumn}
                loading={getAllInstitutionMember.isLoading}
                map={(institutionMember) => ({ key: institutionMember.id, ...institutionMember })}
                pagination={pagination}
                handleSelectedData={(_, selectedRows) => setSelectedInstitutionMember(selectedRows)}
              />
            </div>
          </Card>
        </div>
      )}
    </>
  );
};

export default InstitutionMember;
