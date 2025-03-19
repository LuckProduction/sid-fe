import { Reveal } from '@/components';
import { useCrudModal, usePagination, useService } from '@/hooks';
import { LandingService } from '@/services';
import { CaretRightOutlined, PushpinOutlined, WhatsAppOutlined } from '@ant-design/icons';
import { Button, Card, Collapse, Descriptions, Empty, Image, Input, Pagination, Skeleton, theme } from 'antd';
import { useCallback, useEffect, useState } from 'react';

const VillageEnterprise = () => {
  const modal = useCrudModal();
  const { execute: fetchEnterprise, ...getAllEnterprise } = useService(LandingService.getAllEnterprise);
  const [searchValue, setSearchValue] = useState('');
  const pagination = usePagination({ totalData: getAllEnterprise.totalData });
  const fetchData = useCallback(() => {
    fetchEnterprise({
      page: pagination.page,
      per_page: pagination.per_page,
      search: searchValue
    });
  }, [fetchEnterprise, pagination.page, pagination.per_page, searchValue]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const enterprise = getAllEnterprise.data ?? [];

  const onSearch = (value) => {
    setSearchValue(value);
  };

  const { token } = theme.useToken();
  const panelStyle = {
    marginBottom: 24,
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: 'none'
  };

  const itemCollapsed = (panelStyle, data) => {
    let item = [
      {
        key: 'pemilik',
        label: 'Data Pemilik Lapak',
        children: (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Nama Pemilik">{data.resident.full_name}</Descriptions.Item>
            <Descriptions.Item label="NIK Pemilik">{data.resident.nik}</Descriptions.Item>
            <Descriptions.Item label="Jenis Kelamin">{data.resident.gender}</Descriptions.Item>
          </Descriptions>
        ),
        style: panelStyle
      }
    ];
    if (data && data.enterprise_menu) {
      item = [
        ...item,
        ...data.enterprise_menu.map((item) => ({
          key: item.id,
          label: item.menu_name,
          children: (
            <Descriptions bordered column={1} className="mt-2">
              <Descriptions.Item label="Foto Menu">
                <Image width={120} src={item.foto} />
              </Descriptions.Item>
              <Descriptions.Item label="Harga">{item.price}</Descriptions.Item>
              <Descriptions.Item label="Status">{item.status}</Descriptions.Item>
              <Descriptions.Item label="Dilihat">{item.seen}</Descriptions.Item>
            </Descriptions>
          ),
          style: panelStyle
        }))
      ];
    }
    return item;
  };

  return (
    <section className="mx-auto flex w-full max-w-screen-xl flex-col gap-y-6 px-4 py-20">
      <div className="flex flex-col items-end justify-between gap-y-6 md:flex-row">
        <div className="flex w-full flex-col gap-y-2">
          <Reveal>
            <p className="text-xl font-semibold">Semua Berita:</p>
          </Reveal>
        </div>
        <div className="inline-flex w-full gap-x-2">
          <Input.Search placeholder="Cari Berita" size="large" className="w-full" onSearch={onSearch} />
        </div>
      </div>
      {getAllEnterprise.isLoading ? (
        <div className="grid grid-cols-10 gap-4">
          {Array.from({ length: 5 }, (_, i) => i).map((index) => (
            <Card className="col-span-10 md:col-span-5 lg:col-span-2" key={index}>
              <Skeleton active />
            </Card>
          ))}
        </div>
      ) : enterprise.length === 0 ? (
        <div className="flex w-full justify-center py-12">
          <Empty />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-10 gap-4">
            {enterprise.map((item, index) => (
              <Card
                onClick={() => {
                  modal.show.paragraph({
                    title: `${item.enterprise_name}`,
                    data: {
                      content: (
                        <div className="w-full flex-col gap-y-2">
                          <Descriptions bordered column={1}>
                            <Descriptions.Item label="Nama Lapak BUMDes">{item.enterprise_name}</Descriptions.Item>
                            <Descriptions.Item label="Deskripsi">{item.desc}</Descriptions.Item>
                            <Descriptions.Item label="Foto Lapak BUMDes">
                              <Image width={120} src={item.foto} />
                            </Descriptions.Item>
                            <Descriptions.Item label="Kontak (WA)">
                              <Button icon={<WhatsAppOutlined />} variant="outlined" color="green" onClick={() => window.open(`https://wa.me/${item.contact}`, '_blank')}>
                                WhatsApp
                              </Button>
                            </Descriptions.Item>
                            <Descriptions.Item label="Lokasi (GMAPS)">
                              {item.coordinate &&
                                (() => {
                                  const [longitude, latitude] = item.coordinate.split(',').map((coord) => coord.trim());
                                  return (
                                    <Button icon={<PushpinOutlined />} variant="outlined" color="red" onClick={() => window.open(`https://www.google.com/maps?q=${latitude},${longitude}`, '_blank', 'noopener,noreferrer')}>
                                      Google Maps
                                    </Button>
                                  );
                                })()}
                            </Descriptions.Item>
                          </Descriptions>
                          <Collapse
                            className="mt-4"
                            bordered={false}
                            expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                            style={{
                              background: token.colorBgContainer
                            }}
                            items={itemCollapsed(panelStyle, item)}
                          />
                        </div>
                      )
                    }
                  });
                }}
                key={index}
                className="col-span-10 w-full md:col-span-5 lg:col-span-2"
                hoverable
                cover={<img alt="example" style={{ height: '180px', objectFit: 'cover' }} src={item.foto} />}
              >
                <Reveal>
                  <b className="news-text">{item.enterprise_name}</b>
                </Reveal>
                <Reveal>
                  <small>{item.operational_time}</small>
                </Reveal>
              </Card>
            ))}
          </div>
          <Pagination current={pagination.page} total={pagination.totalData} onChange={pagination.onChange} pageSize={pagination.per_page} />
        </>
      )}
    </section>
  );
};

export default VillageEnterprise;
