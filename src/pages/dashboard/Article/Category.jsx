import Modul from '@/constants/Modul';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import { CategoryService } from '@/services';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Space, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { categoryFormFields } from './FormFields';
import { DataTable } from '@/components';

const Category = () => {
  const { token } = useAuth();
  const { success, error } = useNotification();
  const { execute: fetchCategory, ...getAllCategory } = useService(CategoryService.getByType);
  const updateCategory = useService(CategoryService.update);
  const deleteCategory = useService(CategoryService.delete);
  const storeCategory = useService(CategoryService.store);
  const deleteBatchCategory = useService(CategoryService.deleteBatch);
  const [selectedCategory, setSelectedCategory] = useState([]);

  const pagination = usePagination({ totalData: getAllCategory.totalData });

  const modal = useCrudModal();

  useEffect(() => {
    fetchCategory(token, 'artikel', pagination.page, pagination.perPage);
  }, [fetchCategory, pagination.page, pagination.perPage, token]);

  const category = getAllCategory.data ?? [];

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

  return (
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
        <DataTable
          data={category}
          columns={categoryColumn}
          loading={getAllCategory.isLoading}
          map={(category) => ({ key: category.id, ...category })}
          handleSelectedData={(_, selectedRows) => setSelectedCategory(selectedRows)}
          pagination={pagination}
        />
      </div>
    </Card>
  );
};

export default Category;
