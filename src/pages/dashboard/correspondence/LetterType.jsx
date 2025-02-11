import { DataLoader, DataTable } from '@/components';
import Modul from '@/constants/Modul';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import { LetterTypeService } from '@/services';
import { DatabaseFilled, DatabaseOutlined, DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Space, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { letterTypeFormFields } from './FormFields';
import { expiredTimeFormat } from '@/utils/expiredTimeFormat';

const LetterType = () => {
    const { token } = useAuth();
    const { success, error } = useNotification();
    const { execute: fetchLetterType, ...getAllLetterType } = useService(LetterTypeService.getAll);
    const storeLetterType = useService(LetterTypeService.store);
    const updateLetterType = useService(LetterTypeService.update);
    const deleteLetterType = useService(LetterTypeService.delete);
    const deleteBatchLetterType = useService(LetterTypeService.deleteBatch);
    const [selectedData, setSelectedData] = useState([]);

    const pagination = usePagination({ totalData: getAllLetterType.totalData });

    const modal = useCrudModal();

    useEffect(() => {
        fetchLetterType(token, pagination.page, pagination.perPage);
    }, [fetchLetterType, pagination.page, pagination.perPage, token]);

    const legalProducts = getAllLetterType.data ?? [];

    const Column = [
        {
            title: 'Nama Surat',
            dataIndex: 'letter_name',
            sorter: (a, b) => a.letter_name.length - b.letter_name.length,
            searchable: true
        },
        {
            title: 'Masa Berlaku',
            dataIndex: 'expired',
            sorter: (a, b) => a.expired.length - b.expired.length,
            searchable: true,
            render: (_, record) => expiredTimeFormat(record.expired)
        },
        {
            title: 'Keterangan Tanda Tangan',
            dataIndex: 'signature_desc',
            sorter: (a, b) => a.signature_desc.length - b.signature_desc.length,
            searchable: true,
        },
        {
            title: 'Aksi',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        icon={<EditOutlined />}
                        variant="outlined"
                        color="primary"
                        onClick={() => {
                            modal.edit({
                                title: `Edit ${Modul.LETTER_TYPE}`,
                                data: record,
                                formFields: letterTypeFormFields,
                                onSubmit: async (values) => {
                                    const { message, isSuccess } = await updateLetterType.execute(
                                        record.id,
                                        { ...values, _method: 'PUT' },
                                        token,
                                    );
                                    if (isSuccess) {
                                        success('Berhasil', message);
                                        fetchLetterType(token);
                                    } else {
                                        error('Gagal', message);
                                    }
                                    return isSuccess;
                                }
                            });
                        }}
                    />
                    <Button
                        icon={<EyeOutlined />}
                        variant="outlined"
                        color="green"
                        onClick={() => {
                            modal.show.description({
                                title: record.letter_name,
                                data: [
                                    {
                                        key: 'letter_name',
                                        label: `Nama Surat`,
                                        children: record.letter_name
                                    },
                                    {
                                        key: 'letter_code',
                                        label: `Kode Surat`,
                                        children: record.letter_code
                                    },
                                    {
                                        key: 'show_header',
                                        label: `Tampilkan Header`,
                                        children: record.show_header
                                    },
                                    {
                                        key: 'expired',
                                        label: `Masa Berlaku`,
                                        children: expiredTimeFormat(record.expired)
                                    },
                                    {
                                        key: 'signature_desc',
                                        label: `Keterangan Tanda Tangan`,
                                        children: record.signature_desc
                                    },
                                ]
                            });
                        }}
                    />
                    <Button
                        icon={<DeleteOutlined />}
                        variant="outlined"
                        color="danger"
                        onClick={() => {
                            modal.delete.default({
                                title: `Delete ${Modul.LETTER_TYPE}`,
                                data: record,
                                formFields: letterTypeFormFields,
                                onSubmit: async () => {
                                    const { isSuccess, message } = await deleteLetterType.execute(record.id, token);
                                    if (isSuccess) {
                                        success('Berhasil', message);
                                        fetchLetterType(token);
                                    } else {
                                        error('Gagal', message);
                                    }
                                    return isSuccess;
                                }
                            });
                        }}
                    />
                    <Button icon={<DatabaseOutlined />} />
                </Space>
            )
        }
    ];


    return (
        <div>
            {getAllLetterType.isLoading ? (
                <DataLoader type="datatable" />
            ) : (
                <Card>
                    <div className="mb-6 flex items-center justify-between">
                        <Typography.Title level={5}>Data {Modul.LETTER_TYPE}</Typography.Title>
                        <div className="inline-flex items-center gap-2">
                            <Button
                                variant="outlined"
                                color="danger"
                                disabled={selectedData.length <= 0}
                                icon={<DeleteOutlined />}
                                onClick={() => {
                                    modal.delete.batch({
                                        title: `Hapus ${selectedData.length} ${Modul.LETTER_TYPE} Yang Dipilih ? `,
                                        formFields: letterTypeFormFields,
                                        onSubmit: async () => {
                                            const ids = selectedData.map((item) => item.id);
                                            const { message, isSuccess } = await deleteBatchLetterType.execute(ids, token);
                                            if (isSuccess) {
                                                success('Berhasil', message);
                                                fetchLetterType(token);
                                            } else {
                                                error('Gagal', message);
                                            }
                                            return isSuccess;
                                        }
                                    });
                                }}
                            >
                                {Modul.LETTER_TYPE}
                            </Button>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => {
                                    modal.create({
                                        title: `Tambah ${Modul.LETTER_TYPE}`,
                                        formFields: letterTypeFormFields,
                                        onSubmit: async (values) => {
                                            const { message, isSuccess } = await storeLetterType.execute(values, token);
                                            if (isSuccess) {
                                                success('Berhasil', message);
                                                fetchLetterType(token);
                                            } else {
                                                error('Gagal', message);
                                            }
                                            return isSuccess;
                                        }
                                    });
                                }}
                            >
                                {Modul.LETTER_TYPE}
                            </Button>
                        </div>
                    </div>
                    <div className="w-full max-w-full overflow-x-auto">
                        <DataTable
                            data={legalProducts}
                            columns={Column}
                            pagination={pagination}
                            loading={getAllLetterType.isLoading}
                            map={(legalProducts) => ({ key: legalProducts.id, ...legalProducts })}
                            handleSelectedData={(_, selectedRows) => setSelectedData(selectedRows)}
                        />
                    </div>
                </Card>
            )}
        </div>
    );
};

export default LetterType;
