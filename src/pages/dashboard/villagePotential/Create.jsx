import { MapPicker } from '@/components/dashboard/input';
import Modul from '@/constants/Modul';
import { useAuth, useNotification, useService } from '@/hooks';
import { CategoryService, VillagePotentialService } from '@/services';
import strings from '@/utils/strings';
import { InboxOutlined } from '@ant-design/icons';
import { Editor } from '@tinymce/tinymce-react';
import { Button, Card, Form, Input, Select, Typography } from 'antd';
import Dragger from 'antd/es/upload/Dragger';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Create = () => {
  const [form] = Form.useForm();
  const { token } = useAuth();
  const navigate = useNavigate();
  const { success, error } = useNotification();
  const storeVillagePotential = useService(VillagePotentialService.store);
  const { execute: fetchCategory, ...getAllCategory } = useService(CategoryService.getByType);
  const [realtimeData, setRealtimeData] = useState({});

  useEffect(() => {
    fetchCategory(token, 'potensi');
  }, [fetchCategory, token]);

  const category = getAllCategory.data ?? [];

  const handleEditorChange = (editor) => {
    const description = editor.getContent();
    form.setFieldsValue({ description });
  };

  const handleValuesChange = (changedValue) => {
    setRealtimeData((prevData) => ({ ...prevData, ...changedValue }));
  };

  return (
    <div>
      <Card className="mb-6 flex items-center justify-between">
        <Typography.Title level={5}>Tambah {Modul.VILLAGE_POTENTIALS}</Typography.Title>
      </Card>
      <Form
        form={form}
        className="grid w-full grid-cols-6 gap-2"
        onFinish={async (values) => {
          const { message, isSuccess } = await storeVillagePotential.execute({ ...values, coordinate: `${values.longitude}, ${values.latitude}` }, token, values.foto.file);
          if (isSuccess) {
            success('Berhasil', message);
            navigate(-1);
          } else {
            error('Gagal', message);
          }
          return isSuccess;
        }}
      >
        <Card className="col-span-6 lg:col-span-4">
          <Form.Item
            className="m-0"
            name="description"
            rules={[
              {
                required: true,
                message: 'Konten wajib diisi!'
              }
            ]}
          >
            <Editor
              apiKey="ltsdik9bjzzfm8i8g4ve5b32ii5sz0t7j6g2ag5khxm0bn1y"
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
              onEditorChange={(description) => {
                form.setFieldsValue({ description });
              }}
            />
          </Form.Item>
        </Card>
        <Card className="col-span-6 lg:col-span-2">
          <Form.Item
            className="mb-4"
            name="potential_name"
            rules={[
              {
                required: true,
                message: 'Nama potensi wajib diisi!'
              }
            ]}
          >
            <Input placeholder={`Nama ${Modul.VILLAGE_POTENTIALS}`} size="large" />
          </Form.Item>
          <Form.Item
            className="mb-4"
            name="location"
            rules={[
              {
                required: true,
                message: 'Lokasi potensi wajib diisi!'
              }
            ]}
          >
            <Input placeholder={`Lokasi ${Modul.VILLAGE_POTENTIALS}`} size="large" />
          </Form.Item>
          <Form.Item
            className="mb-4"
            name="category"
            rules={[
              {
                required: true,
                message: 'Kategori wajib diisi!'
              }
            ]}
          >
            <Select
              placeholder={`Kategori ${Modul.VILLAGE_POTENTIALS}`}
              size="large"
              options={category
                .filter((field) => field.name !== 'content')
                .map((item) => ({
                  label: item.category_name,
                  value: item.id
                }))}
            />
          </Form.Item>
          <Form.Item
            className="mb-4"
            name="foto"
            rules={[
              {
                required: true,
                message: 'Foto wajib diisi!'
              }
            ]}
          >
            <Dragger
              accept={['.png', '.jpg', '.jpeg', 'webp'].join(', ')}
              name={'image'}
              maxCount={1}
              beforeUpload={() => {
                return false;
              }}
              listType="picture"
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">{strings('click_or_drag_file_to_this_area_to_upload')}</p>
              <p className="ant-upload-hint">{strings('accepted_file_types_s', ['.png', '.jpg', '.jpeg', 'webp'].join(', '))}</p>
            </Dragger>
          </Form.Item>
          <Form.Item className="mb-4">
            <MapPicker form={form} handleValuesChange={handleValuesChange} realtimeData={realtimeData} />
          </Form.Item>
          <Form.Item
            className="mb-4"
            name="latitude"
            rules={[
              {
                required: true,
                message: 'Latitude wajib diisi!'
              }
            ]}
          >
            <Input placeholder={`Latitude`} size="large" />
          </Form.Item>
          <Form.Item
            className="mb-4"
            name="longitude"
            rules={[
              {
                required: true,
                message: 'Longitude wajib diisi!'
              }
            ]}
          >
            <Input placeholder={`Longitude`} size="large" />
          </Form.Item>
          <Form.Item className="mt-2">
            <div className="flex w-full items-center justify-end gap-x-2">
              <Button type="default" htmlType="reset" size="large">
                Reset
              </Button>
              <Button size="large" type="primary" htmlType="submit" loading={storeVillagePotential.isLoading}>
                Kirim
              </Button>
            </div>
          </Form.Item>
        </Card>
      </Form>
    </div>
  );
};

export default Create;
