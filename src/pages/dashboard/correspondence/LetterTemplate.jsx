import { useAuth, useNotification, useService } from '@/hooks';
import { LetterTemplateService } from '@/services';
import { Skeleton } from 'antd';
import { useEffect, useState } from 'react';
import { letterTempalteFormFields } from './FormFields';
import { useParams } from 'react-router-dom';
import { Crud } from '@/components';

const LetterTemplate = () => {
  const { token } = useAuth();
  const { id } = useParams();
  const { success, error } = useNotification();
  const { execute: fetchLetterTemplate, ...getAllLetterTemplate } = useService(LetterTemplateService.getAll);
  const storeLetterAttribute = useService(LetterTemplateService.store);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    fetchLetterTemplate(token, id);
  }, [fetchLetterTemplate, id, token]);

  const letterTemplate = getAllLetterTemplate.data ?? {};

  const onSubmit = async (values) => {
    setSubmitLoading(true);
    const { message, isSuccess } = await storeLetterAttribute.execute({ ...values, letter_type_id: id }, token);
    if (isSuccess) {
      success('Berhasil', message);
      fetchLetterTemplate(token, id);
    } else {
      error('Gagal', message);
    }
    setSubmitLoading(false);
    return isSuccess;
  };

  return (
    <div>
      {getAllLetterTemplate.isLoading ? (
        <Skeleton />
      ) : (
        <div className="grid w-full grid-cols-12 gap-4">
          <div className="col-span-12">
            <Crud formFields={letterTempalteFormFields()} onSubmit={onSubmit} isLoading={submitLoading} type="create" initialData={letterTemplate} />
          </div>
        </div>
      )}
    </div>
  );
};

export default LetterTemplate;
