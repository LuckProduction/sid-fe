import { DataLoader } from '@/components';
import { useAuth, useCrudModal, useNotification, useService } from '@/hooks';
import { SpeechService, VillageBoundariesService, VillageProfilService } from '@/services';
import { DownloadOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Descriptions, Image, Typography } from 'antd';
import { useEffect } from 'react';
import { districtFormFields, logoFormFields, regencyFormFields, speechFormFields, VillageBoundariesFormFields, villageFormFields } from './FormFields';

const VillagePorfile = () => {
  const { token } = useAuth();
  const modal = useCrudModal();
  const { success, error } = useNotification();
  const { execute: fetchVillageProfile, ...getAll } = useService(VillageProfilService.getAll);
  const { execute: fetchSpeech, ...getAllSpeech } = useService(SpeechService.getAll);
  const { execute: fetchVillageBoundaries, ...getAllVillageBoundaries } = useService(VillageBoundariesService.getAll);
  const updateVillageProfile = useService(VillageProfilService.update);
  const updateLogoVillageProfile = useService(VillageProfilService.updateLogo);
  const updateSpeech = useService(SpeechService.update);
  const udpateVillageBoundaries = useService(VillageBoundariesService.update);

  useEffect(() => {
    fetchVillageProfile(token);
    fetchSpeech(token);
    fetchVillageBoundaries(token)
  }, [fetchSpeech, fetchVillageBoundaries, fetchVillageProfile, token]);

  const villageProfile = getAll.data ?? [];
  const speech = getAllSpeech.data ?? [];
  const VillageBoundaries = getAllVillageBoundaries.data ?? {};

  const handleEditVillageBoundaries = () => {
    const coordinates = VillageBoundaries?.headvillage_coordinate ?? ''; 
    const [longitude = '', latitude = ''] = coordinates.split(',').map((coord) => coord.trim());
    modal.edit({
      title: 'Perbaharui Batas Desa',
      data: { ...VillageBoundaries, longitude: longitude, latitude: latitude },
      formFields: VillageBoundariesFormFields,
      onSubmit: async (values) => {
        const { message, isSuccess } = await udpateVillageBoundaries.execute({ ...values, headvillage_coordinate: `${values.longitude}, ${values.latitude}` }, token, values.adiministrative_file.file);
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
                      data: villageProfile?.district_profile,
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
                      data: villageProfile?.district_profile?.regency_profile,
                      formFields: regencyFormFields,
                      onSubmit: async (values) => {
                        const { message, isSuccess } = await updateVillageProfile.execute({ ...values, district_profile: { regency_profile: { ...values } } }, token);
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
                  {villageProfile?.district_profile?.regency_profile?.regency_name}
                </Typography.Title>
              </Descriptions.Item>
              <Descriptions.Item label="Bupati">{villageProfile?.district_profile?.regency_profile?.regencyhead_name}</Descriptions.Item>
              <Descriptions.Item label="Kode Kabupaten">{villageProfile?.district_profile?.regency_profile?.regency_code}</Descriptions.Item>
            </Descriptions>
            <Descriptions column={1} bordered className="mb-6">
              <Descriptions.Item label="Batas Utara">{VillageBoundaries?.north}</Descriptions.Item>
              <Descriptions.Item label="Batas Selatan">{VillageBoundaries?.south}</Descriptions.Item>
              <Descriptions.Item label="Batas Timur">{VillageBoundaries?.east}</Descriptions.Item>
              <Descriptions.Item label="Batas Barat">{VillageBoundaries?.west}</Descriptions.Item>
              <Descriptions.Item label="File Batas Desa">
                {
                  !VillageBoundaries?.adiministrative_file?.length ?
                    'File Batas Desa Belum Tersedia' :
                    (
                      <Button icon={<DownloadOutlined />} onClick={() => window.open(VillageBoundaries.adiministrative_file, '_blank')}>
                        Download Sumber
                      </Button>
                    )
                }
              </Descriptions.Item>
              <Descriptions.Item label="Luas Wilayah">{VillageBoundaries?.area}</Descriptions.Item>
              <Descriptions.Item label="Edit Batas Desa"><Button icon={<EditOutlined />} onClick={handleEditVillageBoundaries}>Edit</Button></Descriptions.Item>
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
