import { DataLoader, DataTable, DataTableHeader } from '@/components';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import { ResidentService } from '@/services';
import { Button, Card, Descriptions, Space, Tag } from 'antd';
import { useCallback, useEffect } from 'react';
import Modul from '@/constants/Modul';
import { Resident as ResidentModel } from '@/models';
import { useNavigate, useParams } from 'react-router-dom';
import { PlusOutlined } from '@ant-design/icons';
import { FamilyDetailFormFields } from './FormFields';
import { Action } from '@/constants';
import { Delete, Edit } from '@/components/dashboard/button';

const { UPDATE, DELETE } = Action;

const FamilyDetail = () => {
  const { token, user } = useAuth();
  const { id } = useParams();
  const modal = useCrudModal();
  const navigate = useNavigate();
  const { success, error } = useNotification();
  const { execute, ...getAllFamilyDetail } = useService(ResidentService.getFamilyDetail);
  const storeResident = useService(ResidentService.store);
  const deleteResident = useService(ResidentService.delete);
  const pagination = usePagination({ totalData: getAllFamilyDetail.totalData });

  const fetchFamilyDetail = useCallback(() => {
    execute({ id: id, token: token, page: pagination.page, perPage: pagination.perPage });
  }, [execute, id, pagination.page, pagination.perPage, token]);

  useEffect(() => {
    fetchFamilyDetail();
  }, [fetchFamilyDetail]);

  const familyDetail = getAllFamilyDetail.data ?? [];

  const column = [
    {
      title: 'Nama Lengkap',
      dataIndex: 'full_name',
      sorter: (a, b) => a.full_name.length - b.full_name.length,
      searchable: true
    },
    {
      title: 'NIK',
      dataIndex: 'nik',
      sorter: (a, b) => a.nik.length - b.nik.length,
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
    }
  ];

  if (user && user.eitherCan([UPDATE, ResidentModel], [DELETE, ResidentModel])) {
    column.push({
      title: 'Aksi',
      render: (_, record) => (
        <Space size="small">
          <Edit
            model={ResidentModel}
            title={`Edit ${Modul.RESIDENTIAL}`}
            onClick={() => {
              navigate('/dashboard/residential' + '/edit/' + record.id);
            }}
          />
          <Delete
            model={ResidentModel}
            title={`Delete ${Modul.RESIDENTIAL}`}
            onClick={() => {
              modal.delete.default({
                title: `Delete ${Modul.RESIDENTIAL}`,
                data: record,
                formFields: FamilyDetailFormFields,
                onSubmit: async () => {
                  const { isSuccess, message } = await deleteResident.execute(record.id, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchFamilyDetail();
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

  return (
    <>
      {getAllFamilyDetail.isLoading ? (
        <DataLoader type="datatable" />
      ) : (
        <Card>
          <DataTableHeader modul={Modul.FAMILY_DETAIL} model={ResidentModel} />
          <div className="mb-6 w-full">
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Nomor Kartu Keluarga">{familyDetail.kk_number}</Descriptions.Item>
              <Descriptions.Item label="Kepala Keluarga">{familyDetail.full_name}</Descriptions.Item>
              <Descriptions.Item label="NIK Kepala Keluarga">{familyDetail.nik}</Descriptions.Item>
              <Descriptions.Item label="Aksi">
                <Button
                  icon={<PlusOutlined />}
                  onClick={() => {
                    modal.create({
                      title: `Tambah ${Modul.RESIDENTIAL} `,
                      formFields: FamilyDetailFormFields,
                      onSubmit: async (values) => {
                        const { message, isSuccess } = await storeResident.execute({ ...values, kk_number: familyDetail.kk_number }, token);
                        if (isSuccess) {
                          success('Berhasil', message);
                          fetchFamilyDetail();
                        } else {
                          error('Gagal', message);
                        }
                        return isSuccess;
                      }
                    });
                  }}
                >
                  Tambah Data Keluarga
                </Button>
              </Descriptions.Item>
            </Descriptions>
          </div>
          <div className="w-full max-w-full overflow-x-auto">
            <DataTable data={familyDetail.detail_family ?? []} columns={column} loading={getAllFamilyDetail.isLoading} map={(article) => ({ key: article.id, ...article })} pagination={pagination} />
          </div>
        </Card>
      )}
    </>
  );
};

export default FamilyDetail;
