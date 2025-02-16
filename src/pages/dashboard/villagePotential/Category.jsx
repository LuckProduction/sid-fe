import Modul from '@/constants/Modul';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import { CategoryService } from '@/services';
import { Card, Space } from 'antd';
import { useEffect, useState } from 'react';
import { categoryFormFields } from './FormFields';
import { DataTable, DataTableHeader } from '@/components';
import { Delete, Edit } from '@/components/dashboard/button';
import { Action } from '@/constants';
import { Category as CategoryModel } from '@/models';

const { DELETE, UPDATE } = Action;

const Category = () => {
  const { token, user } = useAuth();
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
    fetchCategory(token, 'potensi', pagination.page, pagination.perPage);
  }, [fetchCategory, pagination.page, pagination.perPage, token]);

  const category = getAllCategory.data ?? [];

  const categoryColumn = [
    {
      title: 'Nama',
      dataIndex: 'category_name',
      sorter: (a, b) => a.category_name.length - b.category_name.length,
      searchable: true
    }
  ];

  if (user && user.eitherCan([UPDATE, CategoryModel], [DELETE, CategoryModel])) {
    categoryColumn.push({
      title: 'Aksi',
      render: (_, record) => (
        <Space size="small">
          <Edit
            title={`Edit ${Modul.CATEGORY}`}
            model={CategoryModel}
            onClick={() => {
              modal.edit({
                title: `Edit ${Modul.CATEGORY}`,
                data: record,
                formFields: categoryFormFields,
                onSubmit: async (values) => {
                  const { message, isSuccess } = await updateCategory.execute(record.id, { ...values, type: 'potensi' }, token);
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
          <Delete
            title={`Delete ${Modul.CATEGORY}`}
            model={CategoryModel}
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
    });
  }

  const onDeleteBatch = () => {
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
  };

  const onCreate = () => {
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
  };

  return (
    <Card className="col-span-4">
      <DataTableHeader model={CategoryModel} modul={Modul.CATEGORY} onStore={onCreate} onDeleteBatch={onDeleteBatch} selectedData={selectedCategory} />
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
