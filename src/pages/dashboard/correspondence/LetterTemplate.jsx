import { useAuth, useCrudModal, useNotification, useService } from '@/hooks';
import { LetterTemplateService } from '@/services';
import { Button, Descriptions, Skeleton } from 'antd';
import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Crud } from '@/components';
import { staticTemplateAttr } from '@/data/dummyData';
import { defaultDocTemplate } from '@/utils/defaultDocTemplate';
import { CopyOutlined, TableOutlined } from '@ant-design/icons';
import { letterTempalteFormFields } from './FormFields';

const LetterTemplate = () => {
  const { token } = useAuth();
  const { id } = useParams();
  const { success, error } = useNotification();
  const { execute: fetchLetterTemplate, data, isLoading } = useService(LetterTemplateService.getAll);
  const storeLetterAttribute = useService(LetterTemplateService.store);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [content, setContent] = useState(null);

  const modal = useCrudModal();

  const fetchData = useCallback(() => {
    fetchLetterTemplate(token, id);
  }, [fetchLetterTemplate, token, id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (data) {
      setContent(data);
    }
  }, [data]);

  const onSubmit = async (values) => {
    setSubmitLoading(true);
    const { message, isSuccess } = await storeLetterAttribute.execute({ ...values, letter_type_id: id }, token);
    if (isSuccess) {
      success('Berhasil', message);
      fetchData();
    } else {
      error('Gagal', message);
    }
    setSubmitLoading(false);
    return isSuccess;
  };

  const handleCopyDefaultTemplate = () => {
    setContent((prev) => (prev ? { ...prev, content: defaultDocTemplate } : { content: defaultDocTemplate }));
  };

  return (
    <div>
      {isLoading ? (
        <Skeleton />
      ) : (
        <div className="grid w-full grid-cols-12 gap-4">
          <div className="col-span-12">
            <div className="flex items-center gap-x-2">
              <Button icon={<CopyOutlined />} onClick={handleCopyDefaultTemplate}>
                Salin Template Default
              </Button>
              <Button
                onClick={() =>
                  modal.show.paragraph({
                    title: 'Profil Desa',
                    data: {
                      content: (
                        <Descriptions bordered column={1}>
                          {staticTemplateAttr.map((key, index) => (
                            <Descriptions.Item key={index} label={key.replace(/_/g, ' ')}>
                              [{key}]
                            </Descriptions.Item>
                          ))}
                        </Descriptions>
                      )
                    }
                  })
                }
                icon={<TableOutlined />}
              >
                Lihat Atribut Template
              </Button>
            </div>
            {content && <Crud formFields={letterTempalteFormFields()} onSubmit={onSubmit} isLoading={submitLoading} type="create" initialData={content} />}
          </div>
        </div>
      )}
    </div>
  );
};

export default LetterTemplate;
