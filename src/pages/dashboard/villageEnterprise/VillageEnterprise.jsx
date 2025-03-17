import { DataTable, DataTableHeader } from '@/components';
import { Action } from '@/constants';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import { Button, Card, Descriptions, Image, Result, Space } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { ResidentService, VillageEnterpriseService } from '@/services';
import { VillageEnterprise as VillageEnterpriseModel } from '@/models';
import Modul from '@/constants/Modul';
import { Delete, Detail, Edit } from '@/components/dashboard/button';
import { DatabaseOutlined } from '@ant-design/icons';
import { formFields } from './FormFields';
import timeFormatter from '@/utils/timeFormatter';
import dayjs from 'dayjs';

const { DELETE, UPDATE, READ } = Action;

const VillageEnterprise = () => {
  const { token, user } = useAuth();
  const { success, error } = useNotification();
  const modal = useCrudModal();
  const { execute, ...getAllVillageEnterprise } = useService(VillageEnterpriseService.getAll);
  const { execute: fetchDetailEnterprise, data: enterpriseData } = useService(VillageEnterpriseService.getById);
  const { execute: fetchResident } = useService(ResidentService.getAll);

  const storeVillageEnterprise = useService(VillageEnterpriseService.store);
  const updateVillageEnterprise = useService(VillageEnterpriseService.update);
  const deleteVillageEnterprise = useService(VillageEnterpriseService.delete);
  const deleteBatchVillageEnterprise = useService(VillageEnterpriseService.deleteBatch);
  const [enterpriseMenu, setEnterpriseMenu] = useState(null);
  const [selectedData, setSelectedData] = useState([]);
  const [filterValues, setFilterValues] = useState({ search: '' });
  const pagination = usePagination({ totalData: getAllVillageEnterprise.totalData });

  const fetchVillageEnterprise = useCallback(() => {
    execute({
      token: token,
      page: pagination.page,
      per_page: pagination.per_page,
      search: filterValues.search
    });
  }, [execute, filterValues.search, pagination.page, pagination.per_page, token]);

  useEffect(() => {
    fetchVillageEnterprise();
    fetchResident({ token: token });
  }, [fetchResident, fetchVillageEnterprise, token]);

  const showEnterpriseModal = useCallback(
    (data) => {
      modal.show.paragraph({
        title: 'Menu Lapak BUMDes',
        data: {
          content: (
            <div className="flex flex-col gap-y-2">
              {data?.enterprise_menu?.length ? (
                data.enterprise_menu.map((item, index) => (
                  <Descriptions key={index} title={item.menu_name} bordered column={1} className="mt-2">
                    <Descriptions.Item label="Foto Menu">
                      <Image width={120} src={item.foto} />
                    </Descriptions.Item>
                    <Descriptions.Item label="Harga">{item.price}</Descriptions.Item>
                    <Descriptions.Item label="Status">{item.status}</Descriptions.Item>
                    <Descriptions.Item label="Dilihat">{item.seen}</Descriptions.Item>
                  </Descriptions>
                ))
              ) : (
                <Result status="warning" title="Data Tidak Ditemukan" subTitle="Menu pada lapak ini belum tersedia" />
              )}
            </div>
          )
        }
      });
    },
    [modal.show]
  );

  useEffect(() => {
    if (enterpriseData) {
      setEnterpriseMenu(enterpriseData);
      showEnterpriseModal(enterpriseMenu);
    }
  }, [enterpriseData, enterpriseMenu, showEnterpriseModal]);

  const villageEnterprise = getAllVillageEnterprise.data ?? [];

  const Column = [
    {
      title: 'Nama Lapak BUMDes',
      dataIndex: 'enterprise_name',
      sorter: (a, b) => a.enterprise_name.length - b.enterprise_name.length,
      searchable: true
    },
    {
      title: 'Pemilik',
      dataIndex: ['resident', 'full_name'],
      sorter: (a, b) => a.resident.full_name.length - b.resident.full_name.length,
      searchable: true
    },
    {
      title: 'Jam Operasional',
      dataIndex: 'operational_time',
      sorter: (a, b) => a.operational_time.length - b.operational_time.length,
      searchable: true
    }
  ];

  if (user && user.eitherCan([UPDATE, VillageEnterpriseModel], [DELETE, VillageEnterpriseModel], [READ, VillageEnterpriseModel])) {
    Column.push({
      title: 'Aksi',
      render: (_, record) => (
        <Space size="small">
          <Edit
            title={`Edit ${Modul.VILLAGE_ENTERPRISE}`}
            model={VillageEnterpriseModel}
            onClick={() => {
              const coordinates = record?.coordinate;
              const [longitude = '', latitude = ''] = coordinates.split(',').map((coord) => coord.trim());
              modal.edit({
                title: `Edit ${Modul.VILLAGE_ENTERPRISE}`,
                data: { ...record, operational_time: record.operational_time.split(',').map((time) => dayjs(time, 'HH-mm')), longitude: longitude, latitude: latitude },
                formFields: formFields({ fetchResident }),
                onSubmit: async (values) => {
                  const { message, isSuccess } = await updateVillageEnterprise.execute(
                    record.id,
                    { ...values, operational_time: values.operational_time.map(timeFormatter), coordinate: `${values.longitude}, ${values.latitude}`, _method: 'PUT' },
                    token,
                    values.foto.file
                  );
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchVillageEnterprise({ token: token, page: pagination.page, per_page: pagination.per_page });
                  } else {
                    error('Gagal', message);
                  }
                  return isSuccess;
                }
              });
            }}
          />
          <Detail
            title={`Detail ${Modul.VILLAGE_ENTERPRISE}`}
            model={VillageEnterpriseModel}
            onClick={() => {
              modal.show.description({
                title: record.institution_name,
                data: [
                  {
                    key: 'enterprise_name',
                    label: `Nama ${Modul.VILLAGE_ENTERPRISE}`,
                    children: record.enterprise_name
                  },
                  {
                    key: 'desc',
                    label: `Deskripsi `,
                    children: record.desc
                  },
                  {
                    key: 'foto',
                    label: `Foto `,
                    children: <Image width={120} src={record.foto} />
                  },
                  {
                    key: 'nama_pemilik',
                    label: `Nama Pemilik `,
                    children: record.resident.full_name
                  },
                  {
                    key: 'nik_pemilik',
                    label: `NIK Pemilik `,
                    children: record.resident.nik
                  },
                  {
                    key: 'coordinate',
                    label: `Koordinat`,
                    children: record.coordinate
                  },
                  {
                    key: 'contact',
                    label: `Kontak`,
                    children: record.contact
                  }
                ]
              });
            }}
          />
          <Delete
            title={`Delete ${Modul.VILLAGE_ENTERPRISE}`}
            model={VillageEnterpriseModel}
            onClick={() => {
              const coordinates = record?.coordinate;
              const [longitude = '', latitude = ''] = coordinates.split(',').map((coord) => coord.trim());
              modal.delete.default({
                title: `Delete ${Modul.VILLAGE_ENTERPRISE}`,
                data: { ...record, operational_time: record.operational_time.split(',').map((time) => dayjs(time, 'HH-mm')), longitude: longitude, latitude: latitude },
                formFields: formFields({ fetchResident }),
                onSubmit: async () => {
                  const { isSuccess, message } = await deleteVillageEnterprise.execute(record.id, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchVillageEnterprise({ token: token, page: pagination.page, per_page: pagination.per_page });
                  } else {
                    error('Gagal', message);
                  }
                  return isSuccess;
                }
              });
            }}
          />
          <Button
            icon={<DatabaseOutlined />}
            variant="solid"
            color="geekblue"
            onClick={() => {
              fetchDetailEnterprise({ token: token, id: record.id });
            }}
          />
        </Space>
      )
    });
  }

  const onDeleteBatch = () => {
    modal.delete.batch({
      title: `Hapus ${selectedData.length} ${Modul.VILLAGE_ENTERPRISE} Yang Dipilih ? `,
      formFields: formFields,
      onSubmit: async () => {
        const ids = selectedData.map((item) => item.id);
        const { message, isSuccess } = await deleteBatchVillageEnterprise.execute(ids, token);
        if (isSuccess) {
          success('Berhasil', message);
          fetchVillageEnterprise({ token: token, page: pagination.page, per_page: pagination.per_page });
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  const onCreate = () => {
    modal.edit({
      title: `Tambah ${Modul.VILLAGE_ENTERPRISE}`,
      formFields: formFields({ fetchResident }),
      onSubmit: async (values) => {
        const { message, isSuccess } = await storeVillageEnterprise.execute({ ...values, operational_time: values.operational_time.map(timeFormatter), coordinate: `${values.longitude}, ${values.latitude}` }, token, values.foto.file);
        if (isSuccess) {
          success('Berhasil', message);
          fetchVillageEnterprise({ token: token, page: pagination.page, per_page: pagination.per_page });
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
        <DataTableHeader model={VillageEnterpriseModel} modul={Modul.VILLAGE_ENTERPRISE} onStore={onCreate} onDeleteBatch={onDeleteBatch} selectedData={selectedData} onSearch={(values) => setFilterValues({ ...filterValues, search: values })} />
        <div className="w-full max-w-full overflow-x-auto">
          <DataTable
            data={villageEnterprise}
            columns={Column}
            loading={getAllVillageEnterprise.isLoading}
            map={(category) => ({ key: category.id, ...category })}
            handleSelectedData={(_, selectedRows) => setSelectedData(selectedRows)}
            pagination={pagination}
          />
        </div>
      </Card>
    </div>
  );
};

export default VillageEnterprise;
