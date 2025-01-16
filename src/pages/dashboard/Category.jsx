import { DataLoader, DataTable } from '@/components';
import { InputType } from '@/constants';
import { useAuth, useCrudModal, useNotification, useService } from '@/hooks';
import { CategoryService } from '@/services';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Space, Typography } from 'antd';
import { useEffect, useState } from 'react';

const Category = () => {
  const modul = 'Kategori';
  const { token } = useAuth();
  const { success, error } = useNotification();
  const { execute: fetchCategory, ...getAllCategory } = useService(CategoryService.getAll);
  const storeCategory = useService(CategoryService.store);
  const updateCategory = useService(CategoryService.update);
  const deleteCategory = useService(CategoryService.delete);
  const deleteBatchCategory = useService(CategoryService.deleteBatch);
  const [selectedData, setSelectedData] = useState([]);

  const modal = useCrudModal();

  useEffect(() => {
    fetchCategory(token);
  }, [fetchCategory, token]);

  const category = getAllCategory.data ?? [];

  const Column = [
    {
      title: 'Nama',
      dataIndex: 'category_name',
      sorter: (a, b) => a.category_name.length - b.category_name.length,
      searchable: true
    },
    {
      title: 'Tipe',
      dataIndex: 'type',
      sorter: (a, b) => a.type.length - b.type.length,
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
                title: `Edit ${modul}`,
                data: record,
                formFields: formFields,
                onSubmit: async (values) => {
                  const { message, isSuccess } = await updateCategory.execute(record.id, values, token);
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
          />
          <Button
            icon={<DeleteOutlined />}
            variant="outlined"
            color="danger"
            onClick={() => {
              modal.delete.default({
                title: `Delete ${modul}`,
                data: record,
                formFields: formFields,
                onSubmit: async () => {
                  const { isSuccess, message } = await deleteCategory.execute(record.id, token);
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
          />
        </Space>
      )
    }
  ];

  const formFields = [
    {
      label: `Nama ${modul}`,
      name: 'category_name',
      type: InputType.TEXT,
      rules: [
        {
          required: true,
          message: `Nama ${modul} harus diisi`
        }
      ]
    },
    {
      label: `Tipe ${modul}`,
      name: 'type',
      type: InputType.TEXT,
      rules: [
        {
          required: true,
          message: `Tipe ${modul} harus diisi`
        }
      ]
    }
  ];

  return (
    <div>
      {getAllCategory.isLoading ? (
        <DataLoader type="datatable" />
      ) : (
        <Card>
          <div className="mb-6 flex items-center justify-between">
            <Typography.Title level={5}>Data {modul}</Typography.Title>
            <div className="inline-flex items-center gap-2">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  modal.create({
                    title: `Tambah ${modul}`,
                    formFields: formFields,
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
                {modul}
              </Button>
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
                      const { message, isSuccess } = await deleteBatchCategory.execute(ids, token);
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
            </div>
          </div>
          <div className="w-full max-w-full overflow-x-auto">
            <DataTable data={category} columns={Column} loading={getAllCategory.isLoading} map={(category) => ({ key: category.id, ...category })} handleSelectedData={(_, selectedRows) => setSelectedData(selectedRows)} />
          </div>
        </Card>
      )}
    </div>
  );
};

export default Category;
