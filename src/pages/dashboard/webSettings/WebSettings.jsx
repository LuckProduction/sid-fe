import { Crud } from '@/components';
import { InputType } from '@/constants';
import { useAuth, useNotification, useService } from '@/hooks';
import { WebSettingsService } from '@/services';
import { Card, Menu, Result, Skeleton, Typography } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';

const WebSettings = () => {
  const { token } = useAuth();
  const { success, error } = useNotification();
  const { execute, ...getAllWebSettings } = useService(WebSettingsService.getAll);
  const storeWebSettings = useService(WebSettingsService.store);

  const fetchWebSettings = useCallback(() => {
    execute({ token });
  }, [execute, token]);

  useEffect(() => {
    fetchWebSettings();
  }, [fetchWebSettings]);

  const webSettings = useMemo(() => getAllWebSettings.data ?? [], [getAllWebSettings.data]);

  const [activeMenu, setActiveMenu] = useState();

  const activeItem = webSettings.find((item) => String(item.id) === activeMenu);

  const formFields = (() => {
    if (!activeItem) return [];
    const baseField = {
      name: `${activeItem.slug}`,
      label: activeItem.setting_name,
      rules: [{ required: true, message: 'Harus diisi' }],
      extra: {
        disabled: activeItem.editable !== 1
      }
    };

    switch (activeItem.type) {
      case 'file':
        return [
          {
            ...baseField,
            type: InputType.UPLOAD,
            max: 1,
            beforeUpload: () => false,
            getFileList: (data) => [
              {
                url: data?.[activeItem.slug],
                name: data?.name
              }
            ],
            accept: ['.png']
          }
        ];
      case 'boolean':
        return [
          {
            ...baseField,
            type: InputType.SELECT,
            options: [
              { label: 'Ya', value: 'true' },
              { label: 'Tidak', value: 'false' }
            ]
          }
        ];
      case 'text':
        return [
          {
            ...baseField,
            type: InputType.TEXT
          }
        ];
      default:
        return [];
    }
  })();

  const initialData = useMemo(() => {
    if (!activeItem) return {};
    return {
      [activeItem.slug]: activeItem.value
    };
  }, [activeItem]);

  async function readFileAsBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = (error) => reject(error);
    });
  }

  const handleSubmitWebSetting = async (values) => {
    const key = Object.keys(values)[0];
    let value = values[key];

    const fileObj = value?.fileList?.[0]?.originFileObj;

    if (fileObj instanceof File) {
      const base64 = await readFileAsBase64(fileObj);
      value = base64;
    }

    const requestBody = [
      {
        id: activeItem.id,
        value: value
      }
    ];

    const { message, isSuccess } = await storeWebSettings.execute(requestBody, token);
    if (isSuccess) {
      success('Berhasil', message);
    } else {
      error('Gagal', message);
    }

    fetchWebSettings({ token: token });

    return isSuccess;
  };

  return (
    <div className="grid w-full grid-cols-4 gap-2">
      {getAllWebSettings.isLoading ? (
        <>
          <Card className="col-span-1">
            <Skeleton active />
          </Card>
          <Card className="col-span-3">
            <Skeleton active />
          </Card>
        </>
      ) : (
        <>
          <Card className="col-span-1 h-fit">
            <Menu onClick={(e) => setActiveMenu(e.key)} mode="vertical" selectedKeys={activeMenu ? [activeMenu] : []}>
              {webSettings?.map((item) => (
                <Menu.Item key={item.id}>{item.setting_name}</Menu.Item>
              ))}
            </Menu>
          </Card>
          <Card className="col-span-3">
            {activeItem ? (
              <>
                <Typography.Title level={5}>{activeItem.setting_name}</Typography.Title>
                <Typography.Paragraph>{activeItem.desc}</Typography.Paragraph>
                <Crud isLoading={storeWebSettings.isLoading} formFields={formFields} onSubmit={handleSubmitWebSetting} initialData={initialData} />
              </>
            ) : (
              <Result title="Pilih Pengaturan" subTitle="Silahkan pilih pengaturan yang ada" />
            )}
          </Card>
        </>
      )}
    </div>
  );
};

export default WebSettings;
