import { DataTable, DataTableHeader } from '@/components';
import Modul from '@/constants/Modul';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import { LetterAttributeService } from '@/services';
import { Skeleton, Space, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { letterAttributeFormFields, letterTypeFormFields } from './FormFields';
import { Delete, Edit } from '@/components/dashboard/button';
import { useParams } from 'react-router-dom';
import { Action } from '@/constants';
import { LetterAttribute as LetterAttributeModel } from '@/models';

const { DELETE, UPDATE, READ } = Action;

const LetterAttribute = () => {
  const { token, user } = useAuth();
  const { success, error } = useNotification();
  const { id } = useParams();
  const { execute: fetchLetterAttribute, ...getAllLetterAttribute } = useService(LetterAttributeService.getAllByType);
  const storeLetterAttribute = useService(LetterAttributeService.store);
  const updateLetterAttribute = useService(LetterAttributeService.update);
  const deleteLetterAttribute = useService(LetterAttributeService.delete);
  const deleteBatchLetterAttribute = useService(LetterAttributeService.deleteBatch);
  const [selectedData, setSelectedData] = useState([]);

  const pagination = usePagination({ totalData: getAllLetterAttribute.totalData });

  const modal = useCrudModal();

  useEffect(() => {
    fetchLetterAttribute({ token: token, page: pagination.page, per_page: pagination.per_page, type_id: id });
  }, [fetchLetterAttribute, id, pagination.page, pagination.per_page, token]);

  const letterAttribut = getAllLetterAttribute.data ?? [];

  const Column = [
    {
      title: 'Nama Atribut',
      dataIndex: 'attribute',
      sorter: (a, b) => a.attribute.length - b.attribute.length,
      searchable: true
    },
    {
      title: 'Tipe',
      dataIndex: 'type',
      sorter: (a, b) => a.type.length - b.type.length,
      searchable: true
    },
    {
      title: 'Label',
      dataIndex: 'label',
      sorter: (a, b) => a.label.length - b.label.length,
      searchable: true
    },
    {
      title: 'Placeholder',
      dataIndex: 'placeholder',
      sorter: (a, b) => a.placeholder.length - b.placeholder.length,
      searchable: true
    },
    {
      title: 'Wajib di isi',
      dataIndex: 'required',
      sorter: (a, b) => a.required.length - b.required.length,
      searchable: true,
      render: (record) => {
        switch (record) {
          case 'tidak':
            return <Tag color="blue">Tidak Wajib</Tag>;
          case 'ya':
            return <Tag color="green">Wajib</Tag>;
          default:
            return <Tag color="error">{record}</Tag>;
        }
      }
    }
  ];

  if (user && user.eitherCan([UPDATE, LetterAttributeModel], [DELETE, LetterAttributeModel], [READ, LetterAttributeModel])) {
    Column.push({
      title: 'Aksi',
      render: (_, record) => (
        <Space size="small">
          <Edit
            title={`Edit ${Modul.LETTER_TYPE}`}
            model={LetterAttributeModel}
            onClick={() => {
              modal.edit({
                title: `Edit ${Modul.LETTER_TYPE}`,
                data: record,
                formFields: letterAttributeFormFields,
                onSubmit: async (values) => {
                  const { message, isSuccess } = await updateLetterAttribute.execute(record.id, { ...values, letter_type: id, _method: 'PUT' }, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchLetterAttribute({ token: token, page: pagination.page, per_page: pagination.per_page, type_id: id });
                  } else {
                    error('Gagal', message);
                  }
                  return isSuccess;
                }
              });
            }}
          />
          <Delete
            title={`Delete ${Modul.LETTER_TYPE}`}
            model={LetterAttributeModel}
            onClick={() => {
              modal.delete.default({
                title: `Delete ${Modul.LETTER_TYPE}`,
                data: record,
                formFields: letterAttributeFormFields,
                onSubmit: async () => {
                  const { isSuccess, message } = await deleteLetterAttribute.execute(record.id, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchLetterAttribute({ token: token, page: pagination.page, per_page: pagination.per_page });
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
      title: `Hapus ${selectedData.length} ${Modul.LETTER_TYPE} Yang Dipilih ? `,
      formFields: letterTypeFormFields,
      onSubmit: async () => {
        const ids = selectedData.map((item) => item.id);
        const { message, isSuccess } = await deleteBatchLetterAttribute.execute(ids, token);
        if (isSuccess) {
          success('Berhasil', message);
          fetchLetterAttribute({ token: token, page: pagination.page, per_page: pagination.per_page });
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  const onCreate = () => {
    modal.create({
      title: `Tambah ${Modul.LETTER_TYPE}`,
      formFields: letterAttributeFormFields,
      onSubmit: async (values) => {
        const { message, isSuccess } = await storeLetterAttribute.execute({ ...values, letter_type: id }, token);
        if (isSuccess) {
          success('Berhasil', message);
          fetchLetterAttribute({ token: token, page: pagination.page, per_page: pagination.per_page, type_id: id });
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  return (
    <div className="mt-6">
      {getAllLetterAttribute.isLoading ? (
        <Skeleton active />
      ) : (
        <>
          <DataTableHeader model={LetterAttributeModel} modul={Modul.LETTER_ATTRIBUTE} onStore={onCreate} onDeleteBatch={onDeleteBatch} selectedData={selectedData} />
          <div className="w-full max-w-full overflow-x-auto">
            <DataTable
              data={letterAttribut}
              columns={Column}
              pagination={pagination}
              loading={getAllLetterAttribute.isLoading}
              map={(legalProducts) => ({ key: legalProducts.id, ...legalProducts })}
              handleSelectedData={(_, selectedRows) => setSelectedData(selectedRows)}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default LetterAttribute;
