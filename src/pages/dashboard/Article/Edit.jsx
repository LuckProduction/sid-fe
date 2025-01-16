import { Crud, DataLoader } from '@/components';
import { Card, Typography } from 'antd';
import { formFields } from './FormFields';
import Modul from '@/constants/Modul';
import { useAuth, useNotification, useService } from '@/hooks';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArticleService, CategoryService } from '@/services';

const Edit = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [submitLoading, setSubmitLoading] = useState(false);
  const { success, error } = useNotification();
  const { execute: fetchCategory, ...getAllCategory } = useService(CategoryService.getAll);
  const { execute: fetchArticle, ...getAllArticle } = useService(ArticleService.getById);
  const updateArticle = useService(ArticleService.update);

  useEffect(() => {
    fetchCategory(token);
    fetchArticle(token, id);
  }, [fetchArticle, fetchCategory, id, token]);

  const category = getAllCategory.data ?? [];
  const article = getAllArticle.data ?? [];

  return (
    <div>
      {getAllArticle.data === 0 ? (
        <DataLoader type="datatable" />
      ) : (
        <Card>
          <div className="mb-6 flex items-center justify-between">
            <Typography.Title level={5}>Tambah {Modul.ARTICLE}</Typography.Title>
          </div>
          <Crud
            initialData={{ ...article, category: article?.category?.map((item) => item.id) }}
            formFields={formFields({ options: { category } })}
            onSubmit={async (values) => {
              setSubmitLoading(true);
              const { message, isSuccess } = await updateArticle.execute(id, values, token, values.image.file);
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
      )}
    </div>
  );
};

export default Edit;
