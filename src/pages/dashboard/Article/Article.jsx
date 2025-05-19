import { DataTable, DataTableHeader } from '@/components';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import { ArticleService, CategoryService } from '@/services';
import { Card, Space, Tabs, Tag } from 'antd';
import { useCallback, useEffect, useState } from 'react';
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
  const { execute, ...getAllArticle } = useService(ArticleService.getAll);
  const { execute: fetchCategory, ...getAllCategory } = useService(CategoryService.getByType);
  const deleteArticle = useService(ArticleService.delete);
  const deleteBatchArticle = useService(ArticleService.deleteBatch);
  const [selectedArticle, setSelectedArticle] = useState([]);
  const [filterValues, setFilterValues] = useState({ search: '' });

  const pagination = usePagination({ totalData: getAllArticle.totalData });

  const fetchArticle = useCallback(() => {
    execute({
      token: token,
      page: pagination.page,
      per_page: pagination.per_page,
      search: filterValues.search
    });
  }, [execute, filterValues.search, pagination.page, pagination.per_page, token]);

  useEffect(() => {
    fetchArticle();
    fetchCategory(token, 'artikel');
  }, [fetchArticle, fetchCategory, token]);

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
            return <Tag color="error">{record}</Tag>;
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
                    fetchArticle({ token: token, page: pagination.page, per_page: pagination.per_page });
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
          fetchArticle({ token: token, page: pagination.page, per_page: pagination.per_page });
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
    <Card className="">
      <Tabs type="card">
        <Tabs.TabPane tab="Artikel Desa" key="article">
          <DataTableHeader onSearch={(values) => setFilterValues({ ...filterValues, search: values })} model={ArticleModel} modul={Modul.ARTICLE} onStore={onCreate} onDeleteBatch={onDeleteBatch} selectedData={selectedArticle} />
          <div className="w-full max-w-full overflow-x-auto">
            <DataTable data={article} columns={articleColumn} loading={getAllArticle.isLoading} map={(article) => ({ key: article.id, ...article })} handleSelectedData={(_, selectedRows) => setSelectedArticle(selectedRows)} />
          </div>
        </Tabs.TabPane>
        <Tabs.TabPane tab="Kategori Artikel" key="categoryz">
          <Category />
        </Tabs.TabPane>
      </Tabs>
    </Card>
  );
};

export default Article;
