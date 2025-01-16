import { InputType } from '@/constants';
import clientAsset from '@/utils/clientAsset';
import strings from '@/utils/strings';
import { InboxOutlined } from '@ant-design/icons';
import { Editor } from '@tinymce/tinymce-react';
import { Button, DatePicker, Form, Input, InputNumber, Select } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import Dragger from 'antd/es/upload/Dragger';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const Crud = ({ formFields, initialData, onSubmit = () => {}, type = '', isLoading }) => {
  const [form] = Form.useForm();
  const [realtimeData, setRealtimeData] = useState(initialData);

  const handleEditorChange = (editor) => {
    const content = editor.getContent();
    form.setFieldsValue({ content });
  };

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue(initialData ?? {});
    setRealtimeData(initialData ?? {});
  }, [initialData, form]);

  function handleValuesChange(changedValue) {
    setRealtimeData({ ...realtimeData, ...changedValue });
  }

  const renderFormInput = (field) => {
    field.readOnly = type === 'show' || type === 'delete';

    switch (field.type) {
      case InputType.TEXT:
        return <Input placeholder={`Masukan ${field.label}`} size="large" readOnly={field.readOnly} {...field.extra} />;

      case InputType.NUMBER:
        return <InputNumber placeholder={`Masukan ${field.label}`} min={field.min} max={field.max} className="w-full" size="large" readOnly={field.readOnly} {...field.extra} />;

      case InputType.LONGTEXT:
        return <TextArea placeholder={field.label} rows={4} readOnly={field.readOnly} size="large" {...field.extra} />;

      case InputType.DATE:
        return <DatePicker className="w-full" size="large" placeholder={`Pilih ${field.label}`} readOnly={field.readOnly} {...field.extra} />;

      case InputType.UPLOAD:
        return (
          // FIXME: if readOnly, then show only the file/image and not the drag and drop area
          <Dragger accept={field.accept.join(', ')} name={field.name} maxCount={field.max} beforeUpload={field.beforeUpload} listType="picture" {...field.extra} {...(initialData ? { defaultFileList: field.getFileList(initialData) } : {})}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">{strings('click_or_drag_file_to_this_area_to_upload')}</p>
            <p className="ant-upload-hint">{strings('accepted_file_types_s', field.accept.join(', '))}</p>
          </Dragger>
        );

      case InputType.SELECT:
        return <Select size="large" {...field} />;

      case InputType.SELECT_LOGO:
        return (
          <div className="grid grid-cols-12 gap-3">
            {field.options.map((option, index) => (
              <div key={index} className="col-span-3 flex w-full items-center justify-center">
                <input disabled={field.readOnly} type="radio" id={option.value} name="logo" value={option.value} className="peer hidden" defaultChecked={initialData?.logo === option.value} />
                <label htmlFor={option.value} className="peer-checked:border-color-primary-500 flex aspect-square h-full w-full items-center justify-center rounded-full border-4 border-gray-200">
                  <img src={clientAsset(option.value)} alt={option.name} className="w-full p-1.5" />
                </label>
              </div>
            ))}
          </div>
        );
      case InputType.CONTENT_EDITOR:
        return (
          <Editor
            apiKey="ltsdik9bjzzfm8i8g4ve5b32ii5sz0t7j6g2ag5khxm0bn1y"
            initialValue={initialData.content ?? ''}
            value={form.getFieldValue('content')}
            init={{
              referrer_policy: 'no-referrer',
              allow_script_urls: true,
              height: 500,
              menubar: false,
              plugins: ['advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview', 'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen', 'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'],
              toolbar: 'undo redo | blocks | ' + 'bold italic forecolor | alignleft aligncenter ' + 'alignright alignjustify | bullist numlist outdent indent | ' + 'removeformat | help',
              content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
            }}
            onInit={(evt, editor) => {
              editor.on('change', () => handleEditorChange(editor));
            }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Form layout="vertical" className="mt-6 flex flex-col gap-y-2" form={form} onFinish={onSubmit} onValuesChange={handleValuesChange}>
      {formFields.map(({ renderIf, ...field }, index) => {
        if (renderIf && !renderIf(realtimeData)) return null;
        return (
          <Form.Item key={index} label={field.label} name={field.name} className="m-0" rules={field.rules} dependencies={field.dependencies}>
            {renderFormInput(field)}
          </Form.Item>
        );
      })}
      {type !== 'show' && (
        <Form.Item className="mt-2">
          <div className="flex w-full items-center justify-end gap-x-2">
            <Button type="default" onClick={close}>
              Batal
            </Button>
            {type === 'delete' ? (
              <Button type="primary" danger htmlType="submit" loading={isLoading}>
                Hapus
              </Button>
            ) : (
              <Button type="primary" htmlType="submit" loading={isLoading}>
                Kirim
              </Button>
            )}
          </div>
        </Form.Item>
      )}
    </Form>
  );
};

export default Crud;

Crud.propTypes = {
  formFields: PropTypes.arrayOf(PropTypes.object).isRequired,
  onSubmit: PropTypes.func.isRequired,
  type: PropTypes.string,
  initialData: PropTypes.object,
  isLoading: PropTypes.bool
};
