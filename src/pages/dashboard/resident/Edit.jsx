import { Crud } from '@/components';
import { Card, Tabs } from 'antd';
import { addressFormField, biodataFormFields, brithFormField, educationCareerFormFields, parentFormFields } from './FormFields';
import { useAuth, useNotification, useService } from '@/hooks';
import { HamletService, ResidentService } from '@/services';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import dateFormatter from '@/utils/dateFormatter';
import dayjs from 'dayjs';

const Edit = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { success, error } = useNotification();
  const { id } = useParams();
  const { execute: fetchResident, ...getAllResident } = useService(ResidentService.getById);
  const { execute: fetchHamlet, ...getAllHamlet } = useService(HamletService.getAll);
  const editResident = useService(ResidentService.update);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    fetchResident(token, id);
    fetchHamlet(token);
  }, [fetchHamlet, fetchResident, id, token]);

  const resident = getAllResident.data ?? [];
  const hamlet = getAllHamlet.data ?? [];

  return (
    <div>
      <Card>
        <Tabs>
          <Tabs.TabPane tab="Data Diri" key={1}>
            <Crud
              initialData={resident}
              formFields={biodataFormFields()}
              onSubmit={async (values) => {
                setSubmitLoading(true);
                const { message, isSuccess } = await editResident.execute(id, { ...values, _method: 'PUT' }, token, values.image_profile.file);
                if (isSuccess) {
                  success('Berhasil', message);
                  navigate(-1);
                } else {
                  error('Gagal', message);
                }
                setSubmitLoading(false);
                return isSuccess;
              }}
              isLoading={submitLoading}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Alamat" key={2}>
            <Crud
              initialData={resident.address}
              formFields={addressFormField({ options: { hamlet } })}
              onSubmit={async (values) => {
                setSubmitLoading(true);
                const { message, isSuccess } = await editResident.execute(id, { ...values, address: { ...values }, _method: 'PUT' }, token);
                if (isSuccess) {
                  success('Berhasil', message);
                  navigate(-1);
                } else {
                  error('Gagal', message);
                }
                setSubmitLoading(false);
                return isSuccess;
              }}
              isLoading={submitLoading}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Kelahiran" key={3}>
            <Crud
              initialData={{ ...resident?.birth, birth_date: resident?.birth?.birth_date ? dayjs(resident?.birth?.birth_date) : undefined }}
              formFields={brithFormField()}
              onSubmit={async (values) => {
                setSubmitLoading(true);
                const { message, isSuccess } = await editResident.execute(id, { ...values, _method: 'PUT', birth: { ...values, birth_date: dateFormatter(values.birth_date) } }, token);
                if (isSuccess) {
                  success('Berhasil', message);
                  navigate(-1);
                } else {
                  error('Gagal', message);
                }
                setSubmitLoading(false);
                return isSuccess;
              }}
              isLoading={submitLoading}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Orang Tua" key={4}>
            <Crud
              initialData={resident.parents}
              formFields={parentFormFields()}
              onSubmit={async (values) => {
                setSubmitLoading(true);
                const { message, isSuccess } = await editResident.execute(id, { ...values, parents: values, _method: 'PUT' }, token);
                if (isSuccess) {
                  success('Berhasil', message);
                  navigate(-1);
                } else {
                  error('Gagal', message);
                }
                setSubmitLoading(false);
                return isSuccess;
              }}
              isLoading={submitLoading}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Pekerjaan dan Pendidikan" key={5}>
            <Crud
              initialData={resident.education_career}
              formFields={educationCareerFormFields()}
              onSubmit={async (values) => {
                setSubmitLoading(true);
                const { message, isSuccess } = await editResident.execute(id, { ...values, education_career: values, _method: 'PUT' }, token);
                if (isSuccess) {
                  success('Berhasil', message);
                  navigate(-1);
                } else {
                  error('Gagal', message);
                }
                setSubmitLoading(false);
                return isSuccess;
              }}
              isLoading={submitLoading}
            />
          </Tabs.TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default Edit;
