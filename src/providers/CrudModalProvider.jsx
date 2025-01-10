import { CrudModal, ReadModal } from '@/components';
import { CrudModalType, ReadModalType } from '@/constants';
import isInEnum from '@/utils/isInEnum';
import PropTypes from 'prop-types';

import { createContext, useCallback, useMemo, useState } from 'react';

/**
 * @type {React.Context<{
 *  create: (params: { title: string, formFields: { label: string, name: string, type: string, rules: object[] }[], onSubmit: (values: object) => Promise<any>, onChange: (changedValues: object) => void }) => void;
 *  show: {
 *   default: (params: { title: string, data: object, formFields: { label: string, name: string, type: string, rules: object[] }[] }) => void;
 *   paragraph: (params: { title: string, data: string[] }) => void;
 *   list: (params: { title: string, data: string[] }) => void;
 *   table: (params: { title: string, data: object[], columns: import('antd').TableProps['columns'] }) => void;
 *   description: (params: { title: string, data: import('antd').DescriptionsProps['items'] }) => void;
 *  }
 *  edit: (params: { title: string, data: object, formFields: { label: string, name: string, type: string, rules: object[] }[], onSubmit: (values: object) => Promise<any>, onChange: (changedValues: object) => void }) => void;
 *  delete: {
 *   default: (params: { title: string, data: object, formFields: { label: string, name: string, type: string, rules: object[] }[], onSubmit: (values: object) => Promise<any>, onChange: (changedValues: object) => void }) => void;
 *   batch: (params: { title: string, onSubmit: () => Promise<any> }) => void;
 *   confirm: (params: { title: string, onSubmit: () => Promise<any> }) => void;
 *  }
 *  close: () => void;
 *  setIsLoading: (value: boolean) => void;
 *  setFormFields: React.Dispatch<React.SetStateAction<import('@/types/FormField').default[]>>;
 * }>}
 */
export const CrudModalContext = createContext({
    create: () => { },
    show: {
        default: () => { },
        paragraph: () => { },
        list: () => { },
        table: () => { }
    },
    edit: () => { },
    delete: {
        default: () => { },
        batch: () => { },
        confirm: () => { }
    },
    close: () => { },
    setIsLoading: () => { },
    setFormFields: () => { }
});

export default function CrudModalProvider({ children }) {
    const [isOpen, setIsOpen] = useState(false);
    const [data, setData] = useState(null);
    const [title, setTitle] = useState('');
    /**
     * @type {[CrudModalType | ReadModalType, React.Dispatch<React.SetStateAction<CrudModalType | ReadModalType>>]}
     */
    const [type, setType] = useState();
    /**
     * @type {[() => Promise<any>, React.Dispatch<React.SetStateAction<() => Promise<any>>>]}
     */
    const [onSubmit, setOnSubmit] = useState(() => () => { });
    const [onChange, setOnChange] = useState(() => { });
    const [isLoading, setIsLoading] = useState(false);
    const [formFields, setFormFields] = useState([]);
    const [columns, setColumns] = useState([]);

    const open = useCallback(({ type, title = '', data = null, formFields = [], onSubmit = () => { }, onChange = () => { }, columns = [] }) => {
        setTitle(title);
        setData(data);
        setType(type);
        setFormFields(formFields);
        setOnSubmit(() => onSubmit);
        setOnChange(() => onChange);
        setIsOpen(true);
        setColumns(columns);
    }, []);

    const methods = useMemo(
        () => ({
            create: ({ title, formFields, onSubmit, onChange }) => open({ type: CrudModalType.CREATE, title, formFields, onSubmit, onChange }),
            show: {
                default: ({ title, data, formFields }) => open({ type: CrudModalType.SHOW, title, data, formFields }),
                paragraph: ({ title, data }) => open({ type: ReadModalType.PARAGRAPH, title, data }),
                list: ({ title, data }) => open({ type: ReadModalType.LIST, title, data }),
                table: ({ title, data, columns }) => open({ type: ReadModalType.TABLE, title, data, columns }),
                description: ({ title, data }) => open({ type: ReadModalType.DESCRIPTION, title, data })
            },
            edit: ({ title, data, formFields, onSubmit, onChange }) => open({ type: CrudModalType.EDIT, title, data, formFields, onSubmit, onChange }),
            delete: {
                default: ({ title, data, formFields, onSubmit, onChange }) => open({ type: CrudModalType.DELETE, title, data, formFields, onSubmit, onChange }),
                batch: ({ title, onSubmit, onChange }) => open({ type: CrudModalType.CONFIRM_DELETE, title, onSubmit, onChange }),
                confirm: ({ title, onSubmit, onChange }) => open({ type: CrudModalType.CONFIRM_DELETE, title, onSubmit, onChange })
            }
        }),
        [open]
    );

    const close = useCallback(() => {
        setIsOpen(false);
        setIsLoading(false);
    }, []);

    return (
        <CrudModalContext.Provider value={{ ...methods, close, setIsLoading, setFormFields }}>
            {children}

            {isInEnum(type, CrudModalType) && (
                <CrudModal
                    isModalOpen={isOpen}
                    formFields={formFields}
                    data={data}
                    close={close}
                    onSubmit={async (...params) => {
                        setIsLoading(true);
                        const closeTheModal = await onSubmit(...params);
                        setIsLoading(false);
                        if (closeTheModal) {
                            setIsOpen(false);
                        }
                    }}
                    onChange={onChange}
                    title={title}
                    type={type}
                    isLoading={isLoading}
                />
            )}
            {isInEnum(type, ReadModalType) && <ReadModal isModalOpen={isOpen} data={data} close={close} title={title} type={type} columns={columns} />}
        </CrudModalContext.Provider>
    );
}

CrudModalProvider.propTypes = {
    children: PropTypes.node.isRequired
};
