import { DataLoader, DataTable } from '@/components';
import { InputType } from '@/constants';
import { useAuth, useCrudModal, useNotification, useService } from '@/hooks';
import { ArticleService, CategoryService } from '@/services';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Space, Tag, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formFields } from './FormFields';
import Modul from '@/constants/Modul';

const Article = () => {
  const modul = 'Artikel';
  const navigate = useNavigate();
  const { token } = useAuth();
  const { success, error } = useNotification();
  const { execute: fetchArticle, ...getAllArticle } = useService(ArticleService.getAll);
  const { execute: fetchCategory, ...getAllCategory } = useService(CategoryService.getByType);
  const updateCategory = useService(CategoryService.update);
  const deleteCategory = useService(CategoryService.delete);
  const storeCategory = useService(CategoryService.store);
  const deleteBatchCategory = useService(CategoryService.deleteBatch);
  const deleteArticle = useService(ArticleService.delete);
  const deleteBatchArticle = useService(ArticleService.deleteBatch);
  const [selectedArticle, setSelectedArticle] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);

  const modal = useCrudModal();

  useEffect(() => {
    fetchArticle(token);
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
            return <Tag color="error">Undifined</Tag>;
        }
      }
    },
    {
      title: 'Aksi',
      width: '40%',
      render: (_, record) => (
        <Space size="small">
          <Button
            icon={<EditOutlined />}
            variant="outlined"
            color="primary"
            onClick={() => {
              navigate(window.location.pathname + '/edit/' + record.id);
            }}
          />
          <Button
            icon={<DeleteOutlined />}
            variant="outlined"
            color="danger"
            onClick={() => {
              modal.delete.default({
                title: `Delete ${modul}`,
                data: { ...record, category: record.category.map((item) => item.id) },
                formFields: formFields({ options: { category } }).filter((field) => field.name !== 'content'),
                onSubmit: async () => {
                  const { isSuccess, message } = await deleteArticle.execute(record.id, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchArticle(token);
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
    }
  ];

  const categoryColumn = [
    {
      title: 'Nama',
      dataIndex: 'category_name',
      sorter: (a, b) => a.category_name.length - b.category_name.length,
      searchable: true
    },
    {
      title: 'Aksi',
      width: '40%',
      render: (_, record) => (
        <Space size="small">
          <Button
            icon={<EditOutlined />}
            variant="outlined"
            color="primary"
            onClick={() => {
              modal.edit({
                title: `Edit ${Modul.CATEGORY}`,
                data: record,
                formFields: categoryFormFields,
                onSubmit: async (values) => {
                  const { message, isSuccess } = await updateCategory.execute(record.id, { ...values, type: 'artikel' }, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchCategory(token, 'artikel');
                  } else {
                    error('Gagal', message);
                  }
                  return isSuccess;
                }
              });
            }}
          />
          <Button
            icon={<DeleteOutlined />}
            variant="outlined"
            color="danger"
            onClick={() => {
              modal.delete.default({
                title: `Delete ${Modul.CATEGORY}`,
                data: record,
                formFields: categoryFormFields,
                onSubmit: async () => {
                  const { isSuccess, message } = await deleteCategory.execute(record.id, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchCategory(token, 'artikel');
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
    }
  ];

  const categoryFormFields = [
    {
      label: `Nama Kategori`,
      name: 'category_name',
      type: InputType.TEXT,
      rules: [
        {
          required: true,
          message: `Nama Kategori harus diisi`
        }
      ]
    }
  ];

  return (
    <div>
      {getAllArticle.isLoading ? (
        <DataLoader type="datatable" />
      ) : (
        <div className="grid w-full grid-cols-12 gap-4">
          <Card className="col-span-8">
            <div className="mb-6 flex items-center justify-between">
              <Typography.Title level={5}>Data {Modul.ARTICLE}</Typography.Title>
              <div className="inline-flex items-center gap-2">
                <Button
                  variant="outlined"
                  color="danger"
                  disabled={selectedArticle.length <= 0}
                  icon={<DeleteOutlined />}
                  onClick={() => {
                    modal.delete.batch({
                      title: `Hapus ${selectedArticle.length} ${Modul.ARTICLE} Yang Dipilih ? `,
                      formFields: formFields,
                      onSubmit: async () => {
                        const ids = selectedArticle.map((item) => item.id);
                        const { message, isSuccess } = await deleteBatchArticle.execute(ids, token);
                        if (isSuccess) {
                          success('Berhasil', message);
                          fetchArticle(token);
                        } else {
                          error('Gagal', message);
                        }
                        return isSuccess;
                      }
                    });
                  }}
                >
                  {Modul.ARTICLE}
                </Button>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    navigate(window.location.pathname + '/create');
                  }}
                >
                  {Modul.ARTICLE}
                </Button>
              </div>
            </div>
            <div className="w-full max-w-full overflow-x-auto">
              <DataTable data={article} columns={articleColumn} loading={getAllArticle.isLoading} map={(article) => ({ key: article.id, ...article })} handleSelectedData={(_, selectedRows) => setSelectedArticle(selectedRows)} />
            </div>
          </Card>
          <Card className="col-span-4">
            <div className="mb-6 flex items-center justify-between">
              <Typography.Title level={5}>
                Data {Modul.ARTICLE} {Modul.CATEGORY}
              </Typography.Title>
              <div className="inline-flex items-center gap-2">
                <Button
                  variant="outlined"
                  color="danger"
                  disabled={selectedCategory.length <= 0}
                  icon={<DeleteOutlined />}
                  onClick={() => {
                    modal.delete.batch({
                      title: `Hapus ${selectedCategory.length} ${Modul.CATEGORY} ${Modul.ARTICLE} Yang Dipilih ? `,
                      onSubmit: async () => {
                        const ids = selectedCategory.map((item) => item.id);
                        const { message, isSuccess } = await deleteBatchCategory.execute(ids, token);
                        if (isSuccess) {
                          success('Berhasil', message);
                          fetchCategory(token, 'artikel');
                        } else {
                          error('Gagal', message);
                        }
                        return isSuccess;
                      }
                    });
                  }}
                >
                  {Modul.ARTICLE}
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    modal.create({
                      title: `Tambah Kategori`,
                      formFields: categoryFormFields,
                      onSubmit: async (values) => {
                        const { message, isSuccess } = await storeCategory.execute({ ...values, type: 'artikel' }, token);
                        if (isSuccess) {
                          success('Berhasil', message);
                          fetchCategory(token, 'artikel');
                        } else {
                          error('Gagal', message);
                        }
                        return isSuccess;
                      }
                    });
                  }}
                >
                  {Modul.CATEGORY}
                </Button>
              </div>
            </div>
            <div className="w-full max-w-full overflow-x-auto">
              <DataTable data={category} columns={categoryColumn} loading={getAllCategory.isLoading} map={(category) => ({ key: category.id, ...category })} handleSelectedData={(_, selectedRows) => setSelectedCategory(selectedRows)} />
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Article;
