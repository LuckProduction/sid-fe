import { Action } from '@/constants';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import { AutomaticReplyService } from '@/services';
import { Space } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { AutomaticReply as AutomaticReplyModel } from '@/models';
import Modul from '@/constants/Modul';
import { automaticReplyFormFields } from './FormFields';
import { Delete, Edit } from '@/components/dashboard/button';
import { DataTable, DataTableHeader } from '@/components';

const { UPDATE, DELETE, READ } = Action;

const Replies = () => {
  const { token, user } = useAuth();
  const modal = useCrudModal();
  const { success, error } = useNotification();
  const { execute, ...getAllAutomaticReplies } = useService(AutomaticReplyService.getAll);
  const [filterValues, setFilterValues] = useState({ search: '', status: null, tipe_balasan: null });
  const pagination = usePagination({ totalData: getAllAutomaticReplies.totalData });
  const [selectedData, setSelectedData] = useState([]);
  const deleteBatchAutomaticReplies = useService(AutomaticReplyService.deleteBatch);
  const deleteAutomaticReply = useService(AutomaticReplyService.delete);
  const storeAutomaticReply = useService(AutomaticReplyService.store);
  const updateAutomaticReply = useService(AutomaticReplyService.update);

  const fetchAutomaticReplies = useCallback(() => {
    execute({
      token: token,
      page: pagination.page,
      per_page: pagination.per_page,
      search: filterValues.search
    });
  }, [execute, filterValues.search, pagination.page, pagination.per_page, token]);

  useEffect(() => {
    fetchAutomaticReplies();
  }, [fetchAutomaticReplies]);

  const autmaticReplies = getAllAutomaticReplies.data ?? [];

  const Column = [
    {
      title: 'Kata Kunci',
      dataIndex: 'keyword',
      sorter: (a, b) => a.keyword.length - b.keyword.length,
      searchable: true
    },
    {
      title: 'Balasan',
      dataIndex: 'reply',
      sorter: (a, b) => a.reply.length - b.reply.length,
      searchable: true,
      render: (_, record) => <div className="news-text">{record.reply}</div>
    }
  ];

  if (user && user.eitherCan([UPDATE, AutomaticReplyModel], [DELETE, AutomaticReplyModel], [READ, AutomaticReplyModel])) {
    Column.push({
      title: 'Aksi',
      render: (_, record) => (
        <Space size="small">
          <Edit
            model={AutomaticReplyModel}
            title={`Edit ${Modul.AUTOMATIC_REPLY}`}
            onClick={() => {
              modal.edit({
                title: `Edit ${Modul.AUTOMATIC_REPLY}`,
                data: record,
                formFields: automaticReplyFormFields,
                onSubmit: async (values) => {
                  const { message, isSuccess } = await updateAutomaticReply.execute(record.id, values, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchAutomaticReplies({ token: token, page: pagination.page, per_page: pagination.per_page });
                  } else {
                    error('Gagal', message);
                  }
                  return isSuccess;
                }
              });
            }}
          />
          <Delete
            title={`Delete ${Modul.AUTOMATIC_REPLY}`}
            model={AutomaticReplyModel}
            onClick={() => {
              modal.delete.default({
                title: `Delete ${Modul.AUTOMATIC_REPLY}`,
                data: record,
                onSubmit: async () => {
                  const { isSuccess, message } = await deleteAutomaticReply.execute(record.id, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchAutomaticReplies({ token: token, page: pagination.page, per_page: pagination.per_page });
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
      title: `Hapus ${selectedData.length} ${Modul.LEGAL_PRODUCTS} Yang Dipilih ? `,
      onSubmit: async () => {
        const ids = selectedData.map((item) => item.id);
        const { message, isSuccess } = await deleteBatchAutomaticReplies.execute(ids, token);
        if (isSuccess) {
          success('Berhasil', message);
          fetchAutomaticReplies({ token: token, page: pagination.page, per_page: pagination.per_page });
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  const onCreate = () => {
    modal.create({
      title: `Tambah ${Modul.AUTOMATIC_REPLY}`,
      formFields: automaticReplyFormFields,
      onSubmit: async (values) => {
        const { message, isSuccess } = await storeAutomaticReply.execute(values, token);
        if (isSuccess) {
          success('Berhasil', message);
          fetchAutomaticReplies({ token: token, page: pagination.page, per_page: pagination.per_page });
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  return (
    <>
      <DataTableHeader onStore={onCreate} onSearch={(values) => setFilterValues({ ...filterValues, search: values })} model={AutomaticReplyModel} modul={Modul.AUTOMATIC_REPLY} onDeleteBatch={onDeleteBatch} selectedData={selectedData} />
      <div className="w-full max-w-full overflow-x-auto">
        <DataTable
          data={autmaticReplies}
          columns={Column}
          pagination={pagination}
          loading={getAllAutomaticReplies.isLoading}
          map={(automaticReply) => ({ key: automaticReply.id, ...automaticReply })}
          handleSelectedData={(_, selectedRows) => setSelectedData(selectedRows)}
        />
      </div>
    </>
  );
};

export default Replies;
