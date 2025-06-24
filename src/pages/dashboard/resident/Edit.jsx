import { Crud, DataLoader } from '@/components';
import { Card, Image, Menu, Typography } from 'antd';
import { addressFormField, biodataFormFields, brithFormField, educationCareerFormFields, fotoProfilFormField, parentFormFields } from './FormFields';
import { useAuth, useNotification, useService } from '@/hooks';
import { HamletService, ResidentService } from '@/services';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import dateFormatter from '@/utils/dateFormatter';
import dayjs from 'dayjs';
import { BookOutlined, DollarOutlined, GiftOutlined, GroupOutlined, PictureOutlined, PushpinOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons';

const Edit = () => {
  const { token } = useAuth();
  const { success, error } = useNotification();
  const { id } = useParams();
  const { execute: fetchResident, ...getAllResident } = useService(ResidentService.getById);
  const { execute: fetchHamlet, ...getAllHamlet } = useService(HamletService.getAll);
  const editResident = useService(ResidentService.updateWithImage);
  const editResidentData = useService(ResidentService.update);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [activeMenu, setActiveMenu] = useState('data_diri');

  useEffect(() => {
    fetchResident(token, id);
    fetchHamlet({ token: token });
  }, [fetchHamlet, fetchResident, id, token]);

  const resident = getAllResident.data ?? [];
  const hamlet = getAllHamlet.data ?? [];

  return (
    <div className="grid w-full grid-cols-12 gap-4">
      {Object.keys(getAllResident.data ?? {}).length === 0 ? (
        <DataLoader type="profil" />
      ) : (
        <>
          <div className="col-span-12 flex w-full flex-col gap-y-4 lg:col-span-4">
            <Card className="w-full" cover={<img src="/image_asset/card_background.png" />}>
              <div className="relative px-4">
                <div className="absolute -top-16">
                  <div className="rounded-md bg-white p-3 shadow-md">
                    <Image width={64} height={64} src={resident?.image_profile} />
                  </div>
                </div>
              </div>
              <div className="mt-12 px-4">
                <Typography.Title level={5}>{resident?.full_name}</Typography.Title>
                <Typography.Text>{resident?.nik}</Typography.Text>
              </div>
            </Card>
            <Card className="w-full">
              <Menu onClick={(e) => setActiveMenu(e.key)} mode="vertical" defaultSelectedKeys={[activeMenu]}>
                <Menu.Item key="data_diri" icon={<UserOutlined />}>
                  Data diri
                </Menu.Item>
                <Menu.Item key="foto_profil" icon={<PictureOutlined />}>
                  Foto Profil
                </Menu.Item>
                <Menu.Item key="alamat" icon={<PushpinOutlined />}>
                  Alamat
                </Menu.Item>
                <Menu.Item key="kelahiran" icon={<SearchOutlined />}>
                  Kelahiran
                </Menu.Item>
                <Menu.Item key="orang_tua" icon={<GroupOutlined />}>
                  Orang Tua
                </Menu.Item>
                <Menu.Item key="pekerjaan_pendidikan" icon={<BookOutlined />}>
                  Pekerjaan dan pendidikan
                </Menu.Item>
                <Menu.Item key="bantuan" icon={<GiftOutlined />}>
                  Bantuan
                </Menu.Item>
                <Menu.Item key="wajib_pajak" icon={<DollarOutlined />}>
                  Wajib Pajak
                </Menu.Item>
              </Menu>
            </Card>
          </div>
          <div className="col-span-12 lg:col-span-8">
            {activeMenu === 'data_diri' ? (
              <Card className="w-full" title="Data diri penduduk">
                <Crud
                  initialData={resident}
                  formFields={biodataFormFields()}
                  onSubmit={async (values) => {
                    setSubmitLoading(true);
                    const { message, isSuccess } = await editResident.execute(id, { ...values, _method: 'PUT' }, token, values.image_profile.file);
                    if (isSuccess) {
                      success('Berhasil', message);
                      fetchResident(token, id);
                    } else {
                      error('Gagal', message);
                    }
                    setSubmitLoading(false);
                    return isSuccess;
                  }}
                  isLoading={submitLoading}
                />
              </Card>
            ) : activeMenu === 'foto_profil' ? (
              <Card className="w-full" title="Data diri penduduk">
                <Crud
                  initialData={resident}
                  formFields={fotoProfilFormField()}
                  onSubmit={async (values) => {
                    setSubmitLoading(true);
                    const { message, isSuccess } = await editResident.execute(id, { ...values, _method: 'PUT' }, token, values.image_profile.file);
                    if (isSuccess) {
                      success('Berhasil', message);
                      fetchResident(token, id);
                    } else {
                      error('Gagal', message);
                    }
                    setSubmitLoading(false);
                    return isSuccess;
                  }}
                  isLoading={submitLoading}
                />
              </Card>
            ) : activeMenu === 'alamat' ? (
              <Card className="w-full" title="Alamat">
                <Crud
                  initialData={resident.address}
                  formFields={addressFormField({ options: { hamlet } })}
                  onSubmit={async (values) => {
                    setSubmitLoading(true);
                    const { message, isSuccess } = await editResidentData.execute(id, { ...values, address: { ...values }, gender: resident.gender }, token);
                    if (isSuccess) {
                      success('Berhasil', message);
                      fetchResident(token, id);
                    } else {
                      error('Gagal', message);
                    }
                    setSubmitLoading(false);
                    return isSuccess;
                  }}
                  isLoading={submitLoading}
                />
              </Card>
            ) : activeMenu === 'kelahiran' ? (
              <Card className="w-full" title="Kelahiran">
                <Crud
                  initialData={{ ...resident?.birth, birth_date: resident?.birth?.birth_date ? dayjs(resident?.birth?.birth_date) : undefined }}
                  formFields={brithFormField()}
                  onSubmit={async (values) => {
                    setSubmitLoading(true);
                    const { message, isSuccess } = await editResidentData.execute(id, { ...values, birth: { ...values, birth_date: dateFormatter(values.birth_date) } }, token);
                    if (isSuccess) {
                      success('Berhasil', message);
                      fetchResident(token, id);
                    } else {
                      error('Gagal', message);
                    }
                    setSubmitLoading(false);
                    return isSuccess;
                  }}
                  isLoading={submitLoading}
                />
              </Card>
            ) : activeMenu === 'orang_tua' ? (
              <Card className="w-full" title="Orang Tua">
                <Crud
                  initialData={resident.parents}
                  formFields={parentFormFields()}
                  onSubmit={async (values) => {
                    setSubmitLoading(true);
                    const { message, isSuccess } = await editResidentData.execute(id, { ...values, parents: values }, token);
                    if (isSuccess) {
                      success('Berhasil', message);
                    } else {
                      error('Gagal', message);
                    }
                    setSubmitLoading(false);
                    return isSuccess;
                  }}
                  isLoading={submitLoading}
                />
              </Card>
            ) : activeMenu === 'pekerjaan_pendidikan' ? (
              <Card className="w-full" title="Pekerjaan dan Pendidikan">
                <Crud
                  initialData={resident.education_career}
                  formFields={educationCareerFormFields()}
                  onSubmit={async (values) => {
                    setSubmitLoading(true);
                    const { message, isSuccess } = await editResidentData.execute(id, { ...values, education_career: values }, token);
                    if (isSuccess) {
                      success('Berhasil', message);
                      fetchResident(token, id);
                    } else {
                      error('Gagal', message);
                    }
                    setSubmitLoading(false);
                    return isSuccess;
                  }}
                  isLoading={submitLoading}
                />
              </Card>
            ) : (
              <div>null</div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Edit;
