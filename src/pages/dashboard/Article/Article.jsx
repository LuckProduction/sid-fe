import { DataLoader, DataTable, DataTableHeader } from '@/components';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import { ArticleService, CategoryService } from '@/services';
import { Card, Space, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formFields } from './FormFields';
import Modul from '@/constants/Modul';
import Category from './Category';
import { Delete, Edit } from '@/components/dashboard/button';
import { Action } from '@/constants';
import { Article as ArticleModel } from '@/models';

const { DELETE, UPDATE, READ } = Action;

const Article = () => {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const { success, error } = useNotification();
  const modal = useCrudModal();
  const { execute: executeArticleFetch, ...getAllArticle } = useService(ArticleService.getAll);
  const { execute: fetchCategory, ...getAllCategory } = useService(CategoryService.getByType);
  const deleteArticle = useService(ArticleService.delete);
  const deleteBatchArticle = useService(ArticleService.deleteBatch);
  const [selectedArticle, setSelectedArticle] = useState([]);

  const pagination = usePagination({ totalData: getAllArticle.totalData });

  useEffect(() => {
    executeArticleFetch(token, pagination.page, pagination.per_page);
    fetchCategory(token, 'artikel');
  }, [executeArticleFetch, fetchCategory, pagination.page, pagination.per_page, token]);

  const article = getAllArticle.data ?? [];
  const category = getAllCategory.data ?? [];

  const articleColumn = [
    {
      title: 'Judul',
      dataIndex: 'title',
      sorter: (a, b) => a.title.length - b.title.length,
      searchable: true
    },
    {
      title: 'Tag',
      dataIndex: 'tag',
      sorter: (a, b) => a.tag.length - b.tag.length,
      searchable: true
    },
    {
      title: 'Kateogri',
      dataIndex: 'category',
      sorter: (a, b) => a.category.length - b.category.length,
      searchable: true,
      render: (record) => record.map((item) => ` ${item.category_name} ,`)
    },
    {
      title: 'Status',
      dataIndex: 'status',
      sorter: (a, b) => a.status.length - b.status.length,
      searchable: true,
      render: (record) => {
        switch (record) {
          case 'draft':
            return <Tag color="blue">Draft</Tag>;
          case 'publish':
            return <Tag color="green">Publish</Tag>;
          default:
            return <Tag color="error">Undifined</Tag>;
        }
      }
    }
  ];

  if (user && user.eitherCan([UPDATE, ArticleModel], [DELETE, ArticleModel], [READ, ArticleModel])) {
    articleColumn.push({
      title: 'Aksi',
      render: (_, record) => (
        <Space size="small">
          <Edit
            title={`Edit ${Modul.ARTICLE}`}
            model={ArticleModel}
            onClick={() => {
              navigate(window.location.pathname + '/edit/' + record.id);
            }}
          />
          <Delete
            title={`Delete ${Modul.ARTICLE}`}
            model={ArticleModel}
            onClick={() => {
              modal.delete.default({
                title: `Delete ${Modul.ARTICLE}`,
                data: { ...record, category: record.category.map((item) => item.id) },
                formFields: formFields({ options: { category } }).filter((field) => field.name !== 'content'),
                onSubmit: async () => {
                  const { isSuccess, message } = await deleteArticle.execute(record.id, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    executeArticleFetch(token);
                  } else {
                    error('Gagal', message);
                  }
                  return isSuccess;
                }
              });
            }}
          />
        </Space>
      )
    });
  }

  const onDeleteBatch = () => {
    modal.delete.batch({
      title: `Hapus ${selectedArticle.length} ${Modul.ARTICLE} Yang Dipilih ? `,
      onSubmit: async () => {
        const ids = selectedArticle.map((item) => item.id);
        const { message, isSuccess } = await deleteBatchArticle.execute(ids, token);
        if (isSuccess) {
          success('Berhasil', message);
          executeArticleFetch(token);
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  const onCreate = () => {
    navigate(window.location.pathname + '/create');
  };

  return (
    <>
      {getAllArticle.isLoading ? (
        <DataLoader type="datatable" />
      ) : (
        <div className="grid w-full grid-cols-12 gap-4">
          <Card className="col-span-8">
            <DataTableHeader model={ArticleModel} modul={Modul.ARTICLE} onStore={onCreate} onDeleteBatch={onDeleteBatch} selectedData={selectedArticle} />
            <div className="w-full max-w-full overflow-x-auto">
              <DataTable data={article} columns={articleColumn} loading={getAllArticle.isLoading} map={(article) => ({ key: article.id, ...article })} handleSelectedData={(_, selectedRows) => setSelectedArticle(selectedRows)} />
            </div>
          </Card>
          <Category />
        </div>
      )}
    </>
  );
};

export default Article;
