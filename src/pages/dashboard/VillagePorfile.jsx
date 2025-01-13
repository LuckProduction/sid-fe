import { DataLoader } from '@/components';
import { InputType } from '@/constants';
import { useAuth, useCrudModal, useService } from '@/hooks';
import { VillageProfilService } from '@/services';
import { EditOutlined } from '@ant-design/icons';
import { Button, Card, Descriptions, Image, Typography } from 'antd';
import { useEffect } from 'react';

const VillagePorfile = () => {
  const { token } = useAuth();
  const modal = useCrudModal();
  const { execute: fetchVillageProfile, ...getAll } = useService(VillageProfilService.getAll);

  useEffect(() => {
    fetchVillageProfile(token);
  }, [fetchVillageProfile, token]);

  const villageProfile = getAll.data ?? [];

  console.log('from view', getAll.data);

  const formFields = [
    {
      label: 'Nama Desa',
      name: 'village_name',
      type: InputType.TEXT,
      rules: [
        {
          required: true,
          message: 'Nama desa harus diisi'
        }
      ]
    },
    {
      label: 'Kode Desa',
      name: 'village_code',
      type: InputType.TEXT,
      rules: [
        {
          required: true,
          message: 'Kode desa harus diisi'
        }
      ]
    },
    {
      label: 'Kode Pos',
      name: 'postal_code',
      type: InputType.TEXT,
      rules: [
        {
          required: true,
          message: 'Kode pos harus diisi'
        }
      ]
    },
    {
      label: 'Alamat Kantor',
      name: 'office_address',
      type: InputType.TEXT,
      rules: [
        {
          required: true,
          message: 'Alamat kantor harus diisi'
        }
      ]
    },
    {
      label: 'Email Desa',
      name: 'village_email',
      type: InputType.TEXT,
      rules: [
        {
          required: true,
          message: 'Email desa harus diisi'
        },
        {
          tyoe: 'email',
          message: 'Field harus berupa email'
        }
      ]
    },
    {
      label: 'Nama Kecamatan',
      name: 'district_name',
      type: InputType.TEXT,
      rules: [
        {
          required: true,
          message: 'Nama kecamatan desa harus diisi'
        }
      ]
    },
    {
      label: 'Kode Kecamatan',
      name: 'district_code',
      type: InputType.TEXT,
      rules: [
        {
          required: true,
          message: 'Kode kecamatan desa harus diisi'
        }
      ]
    },
    {
      label: 'Nama Camat',
      name: 'districthead_name',
      type: InputType.TEXT,
      rules: [
        {
          required: true,
          message: 'Nama camat desa harus diisi'
        }
      ]
    },
    {
      label: 'Nama Kabupaten',
      name: 'regency_name',
      type: InputType.TEXT,
      rules: [
        {
          required: true,
          message: 'Nama kabupaten desa harus diisi'
        }
      ]
    },
    {
      label: 'Kode Kabupaten',
      name: 'regency_code',
      type: InputType.TEXT,
      rules: [
        {
          required: true,
          message: 'Kode kabupaten desa harus diisi'
        }
      ]
    },
    {
      label: 'Nama Bupate',
      name: 'regencyhead_name',
      type: InputType.TEXT,
      rules: [
        {
          required: true,
          message: 'Nama bupati desa harus diisi'
        }
      ]
    }
  ];

  return (
    <div>
      {getAll.isLoading ? (
        <DataLoader type="datatable" />
      ) : (
        <Card>
          <div className="mb-6 flex items-center justify-between">
            <Typography.Title level={5}>Data Profil Desa</Typography.Title>
            <div className="inline-flex items-center">
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() =>
                  modal.edit({
                    title: 'Edit Data Profil Desa',
                    data: villageProfile,
                    formFields: formFields,
                    onsubmit: (values) => {
                      console.log('formValues', values);
                    }
                  })
                }
              >
                Ubah Data Desa
              </Button>
            </div>
          </div>
          <Descriptions column={1} bordered className="mb-6">
            <Descriptions.Item label="Nama Desa">
              <Typography.Title level={5} className="m-0">
                {villageProfile.village_name}
              </Typography.Title>
            </Descriptions.Item>
            <Descriptions.Item label="Kode Desa">{villageProfile.village_code}</Descriptions.Item>
            <Descriptions.Item label="Alamat Kantor">{villageProfile.office_address}</Descriptions.Item>
            <Descriptions.Item label="Email Desa">{villageProfile.village_email}</Descriptions.Item>
            <Descriptions.Item label="Kode Pos Desa">{villageProfile.postal_code}</Descriptions.Item>
            <Descriptions.Item label="Profil Desa">
              <Image width={200} src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" />
            </Descriptions.Item>
          </Descriptions>
          <Descriptions column={1} bordered className="mb-6">
            <Descriptions.Item label="Nama Kecamatan">
              <Typography.Title level={5} className="m-0">
                {villageProfile.district_name}
              </Typography.Title>
            </Descriptions.Item>
            <Descriptions.Item label="Camat">{villageProfile.districthead_name}</Descriptions.Item>
            <Descriptions.Item label="Nama Kabupaten">
              <Typography.Title level={5} className="m-0">
                {villageProfile.regency_name}
              </Typography.Title>
            </Descriptions.Item>
            <Descriptions.Item label="Bupati">{villageProfile.regencyhead_name}</Descriptions.Item>
          </Descriptions>
        </Card>
      )}
    </div>
  );
};

export default VillagePorfile;
