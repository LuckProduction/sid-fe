import { DataLoader, DataTable, DataTableHeader } from '@/components';
import Modul from '@/constants/Modul';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import { EmploymentService, InstitutionMemberService, ResidentService, VillageInstitutionService } from '@/services';
import { Card, Image, Space } from 'antd';
import { useEffect, useState } from 'react';
import { institutionMemberFormFields } from './FormFields';
import { useParams } from 'react-router-dom';
import { Delete, Detail, Edit } from '@/components/dashboard/button';
import { Action } from '@/constants';
import { InstitutionMember as InstitutionMemberModel } from '@/models';

const { DELETE, UPDATE, READ } = Action;

const InstitutionMember = () => {
  const { token, user } = useAuth();
  const { success, error } = useNotification();
  const { id } = useParams();
  const { execute: fetchInstitutionMember, ...getAllInstitutionMember } = useService(InstitutionMemberService.getAll);
  const { execute: fetchVillageInstitutionById, ...getAllVillageInstitutionById } = useService(VillageInstitutionService.getById);
  const { execute: fetchResident } = useService(ResidentService.getAll);
  const { execute: fetchEmployment, ...getAllEmployment } = useService(EmploymentService.getAll);
  const storeInstitutionMember = useService(InstitutionMemberService.store);
  const updateInstitutionMember = useService(InstitutionMemberService.update);
  const deleteInstitutionMember = useService(InstitutionMemberService.delete);
  const deleteBatchInstitutionMember = useService(InstitutionMemberService.deleteBatch);
  const [selectedInstitutionMember, setSelectedInstitutionMember] = useState([]);

  const modal = useCrudModal();

  const pagination = usePagination({ totalData: getAllInstitutionMember.totalData });

  useEffect(() => {
    fetchInstitutionMember({ token: token, lembaga: id, page: pagination.page, per_page: pagination.per_page });
    fetchResident({ token: token });
    fetchEmployment({ token: token });
    fetchVillageInstitutionById(token, id);
  }, [fetchEmployment, fetchInstitutionMember, fetchResident, fetchVillageInstitutionById, id, pagination.page, pagination.per_page, token]);

  const institutionMember = getAllInstitutionMember.data ?? [];
  const villageInstitutionById = getAllVillageInstitutionById.data ?? [];
  const employment = getAllEmployment.data ?? [];

  const column = [
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
    }
  ];

  if (user && user.eitherCan([UPDATE, InstitutionMemberModel], [DELETE, InstitutionMemberModel], [READ, InstitutionMemberModel])) {
    column.push({
      title: 'Aksi',
      render: (_, record) => (
        <Space size="small">
          <Edit
            title={`Edit ${Modul.INSTITUTION_MEMBER}`}
            model={InstitutionMemberModel}
            onClick={() => {
              modal.edit({
                title: `Edit ${Modul.INSTITUTION_MEMBER}`,
                data: { ...record, village_institution: record.village_institution.id, employment: record.employment.id, resident: record.resident.id },
                formFields: institutionMemberFormFields({ options: { employment }, fetchResident }),
                onSubmit: async (values) => {
                  const { message, isSuccess } = await updateInstitutionMember.execute(record.id, { ...values, village_institution: villageInstitutionById.id, _method: 'PUT' }, token, values.foto.file);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchInstitutionMember({ token: token, lembaga: id, page: pagination.page, per_page: pagination.per_page });
                  } else {
                    error('Gagal', message);
                  }
                  return isSuccess;
                }
              });
            }}
          />
          <Detail
            title={`Detail ${Modul.INSTITUTION_MEMBER}`}
            model={InstitutionMemberModel}
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
          <Delete
            title={`Delete ${Modul.INSTITUTION_MEMBER}`}
            model={InstitutionMemberModel}
            onClick={() => {
              modal.delete.default({
                title: `Delete ${Modul.INSTITUTION_MEMBER}`,
                onSubmit: async () => {
                  const { isSuccess, message } = await deleteInstitutionMember.execute(record.id, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchInstitutionMember({ token: token, lembaga: id, page: pagination.page, per_page: pagination.per_page });
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
      title: `Hapus ${selectedInstitutionMember.length} ${Modul.INSTITUTION_MEMBER} Yang Dipilih ? `,
      onSubmit: async () => {
        const ids = selectedInstitutionMember.map((item) => item.id);
        const { message, isSuccess } = await deleteBatchInstitutionMember.execute(ids, token);
        if (isSuccess) {
          success('Berhasil', message);
          fetchInstitutionMember({ token: token, lembaga: id, page: pagination.page, per_page: pagination.per_page });
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  const onCreate = () => {
    modal.create({
      title: `Tambah ${Modul.INSTITUTION_MEMBER}`,
      formFields: institutionMemberFormFields({ options: { employment }, fetchResident }),
      onSubmit: async (values) => {
        const { message, isSuccess } = await storeInstitutionMember.execute({ ...values, village_institution: id }, token, values?.foto?.file ?? null);
        if (isSuccess) {
          success('Berhasil', message);
          fetchInstitutionMember({ token: token, lembaga: id, page: pagination.page, per_page: pagination.per_page });
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  return (
    <>
      {getAllInstitutionMember.isLoading ? (
        <DataLoader type="datatable" />
      ) : (
        <div className="grid w-full grid-cols-12 gap-4">
          <Card className="col-span-12">
            <DataTableHeader model={InstitutionMemberModel} modul={Modul.INSTITUTION_MEMBER} onStore={onCreate} onDeleteBatch={onDeleteBatch} selectedData={selectedInstitutionMember} />
            <div className="w-full max-w-full overflow-x-auto">
              <DataTable
                data={institutionMember}
                columns={column}
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
