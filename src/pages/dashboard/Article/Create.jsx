import { Crud } from '@/components';
import Modul from '@/constants/Modul';
import { useAuth, useNotification, useService } from '@/hooks';
import { ArticleService, CategoryService } from '@/services';
import { Card, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formFields } from './FormFields';

const Create = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [submitLoading, setSubmitLoading] = useState(false);
  const { success, error } = useNotification();
  const { execute: fetchCategory, ...getAllCategory } = useService(CategoryService.getByType);
  const storeArticle = useService(ArticleService.store);

  useEffect(() => {
    fetchCategory(token, 'artikel');
  }, [fetchCategory, token]);

  const category = getAllCategory.data ?? [];

  return (
    <div>
      <Card>
        <div className="mb-6 flex items-center justify-between">
          <Typography.Title level={5}>Tambah {Modul.ARTICLE}</Typography.Title>
        </div>
        <Crud
          formFields={formFields({ options: { category } })}
          onSubmit={async (values) => {
            setSubmitLoading(true);
            const { message, isSuccess } = await storeArticle.execute({ ...values, user_id: 1 }, token, values.image.file);
            if (isSuccess) {
              success('Berhasil', message);
              navigate(-1);
            } else {
              error('Gagal', message);
            }
            setSubmitLoading(false);
            return isSuccess;
          }}
          type="create"
          isLoading={submitLoading}
        />
      </Card>
    </div>
  );
};

export default Create;
