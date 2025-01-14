import { DataTable } from '@/components';
import { InputType } from '@/constants';
import { useAuth, useCrudModal, useNotification, useService } from '@/hooks';
import { ArticleService, CategoryService } from '@/services';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Space, Typography } from 'antd';
import { useEffect, useState } from 'react';

const Article = () => {
  const modul = 'Artikel';
  const { token } = useAuth();
  const { success, error } = useNotification();
  const { execute: fetchArticle, ...getAllArticle } = useService(ArticleService.getAll);
  const { execute: fetchCategory, ...getAllCategory } = useService(CategoryService.getAll);
  const storeArticle = useService(ArticleService.store);
  const storeCategory = useService(CategoryService.store);
  const updateArticle = useService(ArticleService.update);
  const deleteArticle = useService(ArticleService.delete);
  const deleteBatchArticle = useService(ArticleService.deleteBatch);
  const [selectedData, setSelectedData] = useState([]);

  const modal = useCrudModal();

  useEffect(() => {
    fetchArticle(token);
    fetchCategory(token);
  }, [fetchArticle, fetchCategory, token]);

  const article = getAllArticle.data ?? [];
  const category = getAllCategory.data ?? [];

  const Column = [
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
      title: 'Aksi',
      width: '40%',
      render: (_, record) => (
        <Space size="small">
          {/* FIXME: directing to article editor page */}
          <Button
            icon={<EditOutlined />}
            variant="outlined"
            color="primary"
            onClick={() => {
              modal.edit({
                title: `Edit ${modul}`,
                data: { ...record, category: record.category.map((item) => item.id) },
                formFields: formFields,
                onSubmit: async (values) => {
                  const { message, isSuccess } = await updateArticle.execute(record.id, values, token, values.image.file);
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
          <Button
            icon={<DeleteOutlined />}
            variant="outlined"
            color="danger"
            onClick={() => {
              modal.delete.default({
                title: `Delete ${modul}`,
                data: { ...record, category: record.category.map((item) => item.id) },
                formFields: formFields,
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

  const formFields = [
    {
      label: `Judul ${modul}`,
      name: 'title',
      type: InputType.TEXT,
      rules: [
        {
          required: true,
          message: `Judul ${modul} harus diisi`
        }
      ]
    },
    {
      label: `Konten ${modul}`,
      name: 'content',
      type: InputType.TEXT,
      rules: [
        {
          required: true,
          message: `Konten ${modul} harus diisi`
        }
      ]
    },
    {
      label: `Kategori ${modul}`,
      name: 'category',
      type: InputType.SELECT,
      mode: 'multiple',
      rules: [
        {
          required: true,
          message: `Kategori ${modul} harus diisi`
        }
      ],
      options: category.map((item) => ({
        label: item.category_name,
        value: item.id
      }))
    },
    {
      label: `Gambar ${modul}`,
      name: 'image',
      type: InputType.UPLOAD,
      max: 1,
      beforeUpload: () => {
        return false;
      },
      getFileList: (data) => {
        return [
          {
            url: data?.image,
            name: data?.name
          }
        ];
      },
      accept: ['.png', '.jpg', '.jpeg', 'webp'],
      rules: [{ required: true, message: 'Logo harus diisi' }]
    },
    {
      label: `Tag ${modul}`,
      name: 'tag',
      type: InputType.TEXT,
      rules: [
        {
          required: true,
          message: `Tag ${modul} harus diisi`
        }
      ]
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
    },
    {
      label: `Tipe Kategori`,
      name: 'type',
      type: InputType.TEXT,
      rules: [
        {
          required: true,
          message: `Tipe Kategori harus diisi`
        }
      ]
    }
  ];

  return (
    <div>
      <Card>
        <div className="mb-6 flex items-center justify-between">
          <Typography.Title level={5}>Data {modul}</Typography.Title>
          <div className="inline-flex items-center gap-2">
            <Button
              variant="outlined"
              color="danger"
              disabled={selectedData.length <= 0}
              icon={<DeleteOutlined />}
              onClick={() => {
                modal.delete.batch({
                  title: `Hapus ${selectedData.length} ${modul} Yang Dipilih ? `,
                  formFields: formFields,
                  onSubmit: async () => {
                    const ids = selectedData.map((item) => item.id);
                    const { message, isSuccess } = await deleteBatchArticle.execute(ids, token);
                    if (isSuccess) {
                      success('Berhasil', message);
                      fetchCategory(token);
                    } else {
                      error('Gagal', message);
                    }
                    return isSuccess;
                  }
                });
              }}
            >
              {modul}
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
                    const { message, isSuccess } = await storeCategory.execute(values, token);
                    if (isSuccess) {
                      success('Berhasil', message);
                      fetchCategory(token);
                    } else {
                      error('Gagal', message);
                    }
                    return isSuccess;
                  }
                });
              }}
            >
              Kategori
            </Button>
            {/* FIXME: directing to article editor page */}
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                modal.create({
                  title: `Tambah ${modul}`,
                  formFields: formFields,
                  onSubmit: async (values) => {
                    const { message, isSuccess } = await storeArticle.execute(values, token, values.image.file);
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
              {modul}
            </Button>
          </div>
        </div>
        <div className="w-full max-w-full overflow-x-auto">
          <DataTable data={article} columns={Column} loading={getAllArticle.isLoading} map={(article) => ({ key: article.id, ...article })} handleSelectedData={(_, selectedRows) => setSelectedData(selectedRows)} />
        </div>
      </Card>
    </div>
  );
};

export default Article;
