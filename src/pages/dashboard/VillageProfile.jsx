import { DataLoader } from '@/components';
import { InputType } from '@/constants';
import { useAuth, useCrudModal, useNotification, useService } from '@/hooks';
import { SpeechService, VillageProfilService } from '@/services';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Descriptions, Image, Typography } from 'antd';
import { useEffect } from 'react';

const VillagePorfile = () => {
  const { token } = useAuth();
  const modal = useCrudModal();
  const { success, error } = useNotification();
  const { execute: fetchVillageProfile, ...getAll } = useService(VillageProfilService.getAll);
  const { execute: fetchSpeech, ...getAllSpeech } = useService(SpeechService.getAll);
  const updateVillageProfile = useService(VillageProfilService.update);
  const updateLogoVillageProfile = useService(VillageProfilService.updateLogo);
  const updateSpeech = useService(SpeechService.update);

  useEffect(() => {
    fetchVillageProfile(token);
    fetchSpeech(token);
  }, [fetchSpeech, fetchVillageProfile, token]);

  const villageProfile = getAll.data ?? [];
  const speech = getAllSpeech.data ?? [];

  const speechFormFields = [
    {
      label: 'Kata Sambutan',
      name: 'content',
      type: InputType.LONGTEXT,
      rules: [
        {
          required: true,
          message: 'Kata Sambutan harus diisi'
        }
      ]
    }
  ];

  const districtFormFields = [
    {
      label: 'Kode Kecamatan',
      name: 'district_code',
      type: InputType.TEXT,
      rules: [
        {
          required: true,
          message: 'Kode Kecamatan harus diisi'
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
          message: 'Nama Camat harus diisi'
        }
      ]
    }
  ];

  const regencyFormFields = [
    {
      label: 'Kode Kabupaten',
      name: 'regency_code',
      type: InputType.TEXT,
      rules: [
        {
          required: true,
          message: 'Kode Kabupaten harus diisi'
        }
      ]
    },
    {
      label: 'Nama Bupati',
      name: 'regencyhead_name',
      type: InputType.TEXT,
      rules: [
        {
          required: true,
          message: 'Nama Bupati harus diisi'
        }
      ]
    }
  ];

  const villageFormFields = [
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
    }
  ];

  const logoFormFields = [
    {
      label: `Logo Desa`,
      name: 'village_logo',
      type: InputType.UPLOAD,
      max: 1,
      beforeUpload: () => {
        return false;
      },
      getFileList: (data) => {
        return [
          {
            url: data?.village_logo,
            name: data?.name
          }
        ];
      },
      accept: ['.png', '.jpg', '.jpeg', 'webp'],
      rules: [{ required: true, message: 'Logo harus diisi' }]
    }
  ];

  return (
    <>
      {getAll.isLoading ? (
        <DataLoader type="datatable" />
      ) : (
        <div className="grid grid-cols-12 gap-4">
          <Card className="col-span-4 h-fit">
            <div className="flex w-full flex-col gap-y-4">
              <Image src={villageProfile.village_logo} alt={`Logo ${villageProfile.village_name}`} />
              <Button
                color="primary"
                variant="solid"
                size="large"
                icon={<EditOutlined />}
                onClick={() =>
                  modal.edit({
                    title: 'Perbaharui Logo Desa',
                    data: villageProfile,
                    formFields: logoFormFields,
                    onSubmit: async (values) => {
                      const { message, isSuccess } = await updateLogoVillageProfile.execute({ ...values, _method: 'PUT' }, token, values.village_logo.file);
                      if (isSuccess) {
                        success('Berhasil', message);
                        fetchVillageProfile(token);
                      } else {
                        error('Gagal', message);
                      }
                      return isSuccess;
                    }
                  })
                }
              >
                Perbaharui Logo Desa
              </Button>
            </div>
          </Card>
          <Card className="col-span-8">
            <div className="mb-6 flex items-center justify-between">
              <Typography.Title level={5}>Data Profil Desa</Typography.Title>
              <div className="inline-flex items-center gap-x-2">
                <Button
                  icon={<EditOutlined />}
                  onClick={() =>
                    modal.edit({
                      title: 'Edit Data Kecamatan',
                      data: villageProfile.district_profile,
                      formFields: districtFormFields,
                      onSubmit: async (values) => {
                        const { message, isSuccess } = await updateVillageProfile.execute({ ...values, district_profile: { ...values } }, token);
                        if (isSuccess) {
                          success('Berhasil', message);
                          fetchVillageProfile(token);
                        } else {
                          error('Gagal', message);
                        }
                        return isSuccess;
                      }
                    })
                  }
                >
                  Kecamatan
                </Button>
                <Button
                  icon={<EditOutlined />}
                  onClick={() =>
                    modal.edit({
                      title: 'Edit Data Kabupaten',
                      data: villageProfile.regency_profile,
                      formFields: regencyFormFields,
                      onSubmit: async (values) => {
                        const { message, isSuccess } = await updateVillageProfile.execute({ ...values, regency_profile: { ...values } }, token);
                        if (isSuccess) {
                          success('Berhasil', message);
                          fetchVillageProfile(token);
                        } else {
                          error('Gagal', message);
                        }
                        return isSuccess;
                      }
                    })
                  }
                >
                  Kabupaten
                </Button>
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() =>
                    modal.edit({
                      title: 'Edit Data Profil Desa',
                      data: villageProfile,
                      formFields: villageFormFields,
                      onSubmit: async (values) => {
                        const { message, isSuccess } = await updateVillageProfile.execute(values, token);
                        if (isSuccess) {
                          success('Berhasil', message);
                          fetchVillageProfile(token);
                        } else {
                          error('Gagal', message);
                        }
                        return isSuccess;
                      }
                    })
                  }
                >
                  Desa
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
            </Descriptions>
            <Descriptions column={1} bordered className="mb-6">
              <Descriptions.Item label="Nama Kecamatan">
                <Typography.Title level={5} className="m-0">
                  {villageProfile?.district_profile?.district_name}
                </Typography.Title>
              </Descriptions.Item>
              <Descriptions.Item label="Camat">{villageProfile?.district_profile?.districthead_name}</Descriptions.Item>
              <Descriptions.Item label="Kode Kecamatan">{villageProfile?.district_profile?.district_code}</Descriptions.Item>
              <Descriptions.Item label="Nama Kabupaten">
                <Typography.Title level={5} className="m-0">
                  {villageProfile?.regency_profile?.regency_name}
                </Typography.Title>
              </Descriptions.Item>
              <Descriptions.Item label="Bupati">{villageProfile?.regency_profile?.regencyhead_name}</Descriptions.Item>
              <Descriptions.Item label="Kode Kabupaten">{villageProfile?.regency_profile?.regency_code}</Descriptions.Item>
            </Descriptions>
            <Descriptions column={1} bordered className="mb-6">
              <Descriptions.Item label="Kata Sambutan">
                {speech.content}
                <Button
                  type="link"
                  icon={speech.length <= 0 ? <PlusOutlined /> : <EditOutlined />}
                  onClick={() =>
                    modal.edit({
                      title: 'Kata Sambutan',
                      data: speech,
                      formFields: speechFormFields,
                      onSubmit: async (values) => {
                        const { message, isSuccess } = await updateSpeech.execute(values, token);
                        if (isSuccess) {
                          success('Berhasil', message);
                          fetchSpeech(token);
                        } else {
                          error('Gagal', message);
                        }
                        return isSuccess;
                      }
                    })
                  }
                >
                  Kata Sambutan
                </Button>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </div>
      )}
    </>
  );
};

export default VillagePorfile;
