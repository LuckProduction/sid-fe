import { useKioskAuth } from '@/context/KiosAuth';
import { useCrudModal, useService } from '@/hooks';
import { KioskService } from '@/services';
import { DollarOutlined, HeartOutlined, LeftOutlined } from '@ant-design/icons';
import { Descriptions, Skeleton, Tag, Typography } from 'antd';
import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PublicService = () => {
  const navigate = useNavigate();
  const { execute: executePublicAssistance, ...getAllPublicAssistance } = useService(KioskService.kioskBrowsePublicAssistance);
  const { execute: executeTax, ...getAllTax } = useService(KioskService.kioskBrowseTax);
  const { user } = useKioskAuth();
  const modal = useCrudModal();

  const fetchPublicAssistance = useCallback(() => {
    executePublicAssistance({
      master_penduduk_id: user.id
    });
  }, [executePublicAssistance, user.id]);

  const fetchTax = useCallback(() => {
    executeTax({
      master_penduduk_id: user.id
    });
  }, [executeTax, user.id]);

  useEffect(() => {
    fetchPublicAssistance();
    fetchTax();
  }, [fetchPublicAssistance, fetchTax]);

  const publicAssistance = getAllPublicAssistance.data ?? [];
  const tax = getAllTax.data ?? [];

  return (
    <section className="relative flex h-full w-full">
      <div className="flex h-full w-full flex-[2] items-center justify-center pb-60">
        <div className="flex flex-col px-24">
          <button className="mb-6 inline-flex items-center gap-x-2 text-sm" onClick={() => navigate(-1)}>
            <LeftOutlined />
            kembali
          </button>
          <Typography.Title level={1} style={{ marginTop: 0 }}>
            Lapor Penduduk
          </Typography.Title>
        </div>
      </div>
      <div className="flex h-full w-full flex-[4] items-center justify-center bg-blue-500">
        <div className="grid max-w-xl grid-cols-2 gap-6">
          <button
            onClick={() => {
              executePublicAssistance({ master_penduduk_id: user.id });
              modal.show.paragraph({
                width: 700,
                title: 'Data Bantuan',
                data: {
                  content: (
                    <>
                      {getAllPublicAssistance.isLoading ? (
                        <Skeleton active />
                      ) : (
                        <>
                          {!publicAssistance.length ? (
                            <Skeleton active />
                          ) : (
                            <>
                              {publicAssistance.map((item, index) => (
                                <Descriptions size="default" bordered column={1} title={item.bantuan_id.nama_bantuan} key={index}>
                                  <Descriptions.Item label="Sasaran Program">{item.bantuan_id.sasaran_program}</Descriptions.Item>
                                  <Descriptions.Item label="Keterangan">{item.bantuan_id.keterangan}</Descriptions.Item>
                                  <Descriptions.Item label="Asal Dana">{item.bantuan_id.asal_dana}</Descriptions.Item>
                                </Descriptions>
                              ))}
                            </>
                          )}
                        </>
                      )}
                    </>
                  )
                }
              });
            }}
            className="col-span-1 flex flex-col items-center justify-center gap-y-4 rounded-md bg-white p-16 text-blue-500 transition-all duration-300 hover:-translate-y-2"
          >
            <HeartOutlined className="text-6xl" />
            Cek Bantuan Sosial
          </button>
          <button
            onClick={() => {
              executePublicAssistance({ master_penduduk_id: user.id });
              modal.show.paragraph({
                width: 700,
                title: 'Data Bantuan',
                data: {
                  content: (
                    <>
                      {getAllTax.isLoading ? (
                        <Skeleton active />
                      ) : (
                        <>
                          {!tax.length ? (
                            <Skeleton active />
                          ) : (
                            <>
                              {tax.map((item, index) => (
                                <Descriptions size="default" bordered column={1} title={item.periode_pajak_id.nama_pajak} key={index}>
                                  <Descriptions.Item label="Tahun Pajak">{item.periode_pajak_id.tahun}</Descriptions.Item>
                                  <Descriptions.Item label="Status Pajak">{item.periode_pajak_id.status}</Descriptions.Item>
                                  <Descriptions.Item label="Status Pelunasan">
                                    {(() => {
                                      switch (item.status) {
                                        case 'lunas':
                                          return <Tag color="blue">Lunas</Tag>;
                                        case 'belum bayar':
                                          return <Tag color="warning">Belum Lunas</Tag>;
                                        default:
                                          return <Tag color="error">Undefined</Tag>;
                                      }
                                    })()}
                                  </Descriptions.Item>
                                </Descriptions>
                              ))}
                            </>
                          )}
                        </>
                      )}
                    </>
                  )
                }
              });
            }}
            className="col-span-1 flex flex-col items-center justify-center gap-y-4 rounded-md bg-white p-16 text-blue-500 transition-all duration-300 hover:-translate-y-2"
          >
            <DollarOutlined className="text-6xl" />
            Cek Pajak
          </button>
        </div>
      </div>
      <div className="absolute bottom-0 w-[20rem]">
        <img src="/illustration/woman.png" />
      </div>
    </section>
  );
};

export default PublicService;
