import { DataLoader } from '@/components';
import { useAuth, useService } from '@/hooks';
import { ResidentService } from '@/services';
import { BookOutlined, GiftOutlined, GroupOutlined, PushpinOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons';
import { Card, Descriptions, Empty, Image, Menu, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const Detail = () => {
  const { token } = useAuth();
  const [activeMenu, setActiveMenu] = useState('data_diri');
  const { id } = useParams();
  const { execute: fetchResident, ...getAllResident } = useService(ResidentService.getById);

  useEffect(() => {
    fetchResident(token, id);
  }, [fetchResident, id, token]);

  const resident = getAllResident.data ?? {};

  return (
    <div className="grid w-full grid-cols-12 gap-4">
      {getAllResident.isLoading ? (
        <DataLoader type="profil" />
      ) : (
        <>
          <div className="col-span-4 flex w-full flex-col gap-y-4">
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
              </Menu>
            </Card>
          </div>
          <div className="col-span-8">
            {activeMenu === 'data_diri' ? (
              <Card className="w-full" title="Data diri penduduk">
                <Descriptions column={1} bordered>
                  <Descriptions.Item label="NIK">{resident?.nik}</Descriptions.Item>
                  <Descriptions.Item label="Nomor KK">{resident?.kk_number}</Descriptions.Item>
                  <Descriptions.Item label="Nama Lengkap">{resident?.full_name}</Descriptions.Item>
                  <Descriptions.Item label="Hubungan Keluarga">{resident?.family_relation}</Descriptions.Item>
                  <Descriptions.Item label="Status Kependudukan">{resident?.resident_status}</Descriptions.Item>
                  <Descriptions.Item label="Status Pernikahan">{resident?.marital_status}</Descriptions.Item>
                  <Descriptions.Item label="Jenis Kelamin">{resident?.gender}</Descriptions.Item>
                  <Descriptions.Item label="Agama">{resident?.religion}</Descriptions.Item>
                </Descriptions>
              </Card>
            ) : activeMenu === 'alamat' ? (
              <Card className="w-full" title="Alamat">
                <Descriptions column={1} bordered>
                  <Descriptions.Item label="Alamat Sesuai KK">{resident?.address?.address_kk}</Descriptions.Item>
                  <Descriptions.Item label="Dusun">{resident?.address?.hamlet_id}</Descriptions.Item>
                  <Descriptions.Item label="RT">{resident?.address?.rt}</Descriptions.Item>
                  <Descriptions.Item label="RW">{resident?.address?.rw}</Descriptions.Item>
                  <Descriptions.Item label="Alamat Terakhir">{resident?.address?.last_address}</Descriptions.Item>
                  <Descriptions.Item label="Nomor Telepon">{resident?.address?.telp}</Descriptions.Item>
                  <Descriptions.Item label="Email">{resident?.address?.email}</Descriptions.Item>
                </Descriptions>
              </Card>
            ) : activeMenu === 'kelahiran' ? (
              <Card className="w-full" title="Kelahiran">
                <Descriptions column={1} bordered>
                  <Descriptions.Item label="Tanggal Lahir">{resident?.birth?.birth_date}</Descriptions.Item>
                  <Descriptions.Item label="Tempat Lahir">{resident?.birth?.birth_place}</Descriptions.Item>
                  <Descriptions.Item label="Nomor Akta Kelahiran">{resident?.birth?.akta_kelahiran_number}</Descriptions.Item>
                </Descriptions>
              </Card>
            ) : activeMenu === 'orang_tua' ? (
              <Card className="w-full" title="Orang Tua">
                <Descriptions column={1} bordered>
                  <Descriptions.Item label="Nama Ayah">{resident?.parents?.father_name}</Descriptions.Item>
                  <Descriptions.Item label="Nama Ibu">{resident?.parents?.mother_name}</Descriptions.Item>
                  <Descriptions.Item label="NIK Ayah">{resident?.parents?.father_nik}</Descriptions.Item>
                  <Descriptions.Item label="NIK Ibu">{resident?.parents?.mother_nik}</Descriptions.Item>
                </Descriptions>
              </Card>
            ) : activeMenu === 'pekerjaan_pendidikan' ? (
              <Card className="w-full" title="Pekerjaan dan Pendidikan">
                <Descriptions column={1} bordered>
                  <Descriptions.Item label="Pendidikan Terakhir">{resident?.education_career?.education_kk}</Descriptions.Item>
                  <Descriptions.Item label="Pekerjaan">{resident?.education_career?.career}</Descriptions.Item>
                  <Descriptions.Item label="Pendidikan Sedang Ditempuh">{resident?.education_career?.education_in_progress}</Descriptions.Item>
                </Descriptions>
              </Card>
            ) : activeMenu === 'bantuan' ? (
              resident?.public_assistance?.length === 0 ? (
                <Card>
                  <Empty />
                </Card>
              ) : (
                <div className="flex flex-col gap-y-2">
                  {resident?.public_assistance?.map((item, index) => (
                    <Card key={index} className="w-full" title={item.public_assistance_name}>
                      <Descriptions column={1} bordered>
                        <Descriptions.Item label="Sumber Dana Bantuan">{item.source_funding}</Descriptions.Item>
                        <Descriptions.Item label="Target Program Bantuan">{item.program_target}</Descriptions.Item>
                        <Descriptions.Item label="Status Bantuan">{item.status}</Descriptions.Item>
                      </Descriptions>
                    </Card>
                  ))}
                </div>
              )
            ) : (
              <div>null</div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Detail;
