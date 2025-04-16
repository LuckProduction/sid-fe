import { Crud, Reveal } from '@/components';
import { useNotification, useService } from '@/hooks';
import { LandingService } from '@/services';
import { BASE_URL } from '@/utils/api';
import { copyToClipboard } from '@/utils/clipBoard';
import dateFormatter from '@/utils/dateFormatter';
import helperJsonApi from '@/utils/helperJsonApi';
import { mapAttributesToFormFields } from '@/utils/attributToForm';
import { CopyOutlined, LeftOutlined } from '@ant-design/icons';
import { Button, Card, DatePicker, Form, Input, Modal, Result, Select, Tabs, Tooltip, Typography } from 'antd';
import { useReducer, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const initialState = {
  isModalOpen: false,
  submitLoading: false,
  formData: {},
  modalStatus: 'initial',
  isSubmitted: false,
  villageReportDetail: {}
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_MODAL_OPEN':
      return { ...state, isModalOpen: action.payload };
    case 'SET_SUBMIT_LOADING':
      return { ...state, submitLoading: action.payload };
    case 'SET_FORM_DATA':
      return { ...state, formData: action.payload };
    case 'SET_MODAL_STATUS':
      return { ...state, modalStatus: action.payload };
    case 'SET_IS_SUBMITTED':
      return { ...state, isSubmitted: action.payload };
    case 'SET_REPORT_DETAIL':
      return { ...state, villageReportDetail: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
};

const SubmitReport = () => {
  const navigate = useNavigate();
  const { error, success } = useNotification();
  const [nikForm, noNIkForm] = Form.useForm();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [activeKey, setActiveKey] = useState('no-nik');
  const { execute: fetchVillageReport, ...getAllVillageReport } = useService(LandingService.getAllVillageReport);
  const { execute: fetchVillageReportDetail, ...getVillageReportDetail } = useService(LandingService.getVillageReportDetail);
  const searchResident = useService(LandingService.getResident);

  useEffect(() => {
    fetchVillageReport();
  }, [fetchVillageReport]);

  const villageReport = getAllVillageReport.data ?? [];

  const reportWithNikRequired = villageReport.filter((report) => ['ubah', 'keluar'].includes(report.type));
  const reportWithoutNikRequired = villageReport.filter((report) => ['masuk', 'meninggal', 'lahir'].includes(report.type));

  useEffect(() => {
    dispatch({ type: 'SET_REPORT_DETAIL', payload: getVillageReportDetail.data ?? {} });
  }, [getVillageReportDetail.data]);

  const handleReportFetch = async (values, isNik) => {
    try {
      const requestData = isNik ? { ...values, tanggal_lahir: dateFormatter(values.tanggal_lahir) } : { nama_laporan: values.nama_laporan };

      const { data, isSuccess } = isNik ? await searchResident.execute(requestData) : await fetchVillageReportDetail(requestData.nama_laporan);

      if (isSuccess) {
        dispatch({
          type: 'SET_FORM_DATA',
          payload: isSuccess && data ? { ...data, nama_laporan: values.nama_laporan, report_type: values.report_type } : {}
        });

        dispatch({ type: 'SET_MODAL_STATUS', payload: 'initial' });
        dispatch({ type: 'SET_MODAL_OPEN', payload: isNik ? true : false });
      } else {
        dispatch({ type: 'SET_MODAL_STATUS', payload: 'error' });
        dispatch({ type: 'SET_MODAL_OPEN', payload: isNik ? true : false });
      }
    } catch (err) {
      console.error('Error fetching report data:', err);
    }
  };

  async function readFileAsBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = (error) => reject(error);
    });
  }

  const handleSubmitLetter = async (values) => {
    dispatch({ type: 'SET_SUBMIT_LOADING', payload: true });

    try {
      const formattedData = {
        nik: state.formData.nik ?? null,
        master_laporan_id: state.villageReportDetail.id,
        tipe_pelapor: state.formData.report_type,
        atribut_laporan_penduduk: (
          await Promise.all(
            state.villageReportDetail.report_attribute.flatMap(async (attr) => {
              const content = values[attr.attribute];

              if (content?.fileList?.length > 0) {
                return Promise.all(
                  content.fileList.map(async (file) => {
                    const base64String = await readFileAsBase64(file.originFileObj);
                    return {
                      atribut_master_laporan_id: attr.id,
                      konten: base64String ?? '-'
                    };
                  })
                );
              }

              return {
                atribut_master_laporan_id: attr.id,
                konten: values[attr.attribute] ?? '-'
              };
            })
          )
        ).flat()
      };

      const response = await helperJsonApi(BASE_URL + '/lapor-penduduk', formattedData);

      if (response.status) {
        success('Berhasil', response.message);
        dispatch({ type: 'SET_FORM_DATA', payload: { ...state.formData, token: response.data.token } });
        dispatch({ type: 'SET_MODAL_STATUS', payload: 'success' });
        dispatch({ type: 'SET_IS_SUBMITTED', payload: true });
      } else {
        error('Gagal', response.message);
        dispatch({ type: 'SET_MODAL_STATUS', payload: 'error' });
        dispatch({ type: 'SET_IS_SUBMITTED', payload: true });
      }
    } finally {
      dispatch({ type: 'SET_SUBMIT_LOADING', payload: false });
      dispatch({ type: 'SET_MODAL_OPEN', payload: true });
    }
  };

  const handleModalClose = () => {
    dispatch({ type: 'RESET' });
    nikForm.resetFields();
    noNIkForm.resetFields();
  };

  const handleTabChange = (key) => {
    dispatch({ type: 'RESET' });
    setActiveKey(key);
    if (key === 'no-nik') {
      nikForm.resetFields();
    } else {
      noNIkForm.resetFields();
    }
  };

  return (
    <>
      <section className="relative w-full bg-blue-500 text-white">
        <div className="relative z-10 mx-auto max-w-screen-xl px-6 py-24">
          <button className="mb-12 inline-flex items-center gap-x-2 text-sm" onClick={() => navigate(-1)}>
            <LeftOutlined />
            kembali
          </button>
          <Reveal>
            <Typography.Title style={{ color: '#fff' }}>Laporan Penduduk</Typography.Title>
          </Reveal>
          <Reveal>
            <div className="max-w-lg">
              <small>Ajukan Laporan sesuai kebutuhan Anda dalam hitungan menit. Isi detail yang diperlukan, dan biarkan sistem kami mengurus sisanya dengan cepat dan efisien!</small>
            </div>
          </Reveal>
        </div>
        <img src="/illustration/city_sillhoute_transparent.png" className="absolute bottom-0 left-0 z-0 w-full" />
      </section>
      <section className="min-h-screen w-full bg-white">
        <div className="mx-auto flex max-w-screen-lg flex-col gap-y-6 px-6 py-12">
          <Card className="w-full">
            <Tabs activeKey={activeKey} onChange={handleTabChange}>
              <Tabs.TabPane tab="Laporan Tanpa NIK Terdaftar" key="no-nik">
                <Form form={noNIkForm} className="mt-4 flex w-full flex-col items-center gap-2 lg:flex-row" onFinish={(values) => handleReportFetch(values, false)}>
                  <Form.Item
                    className="col-span-4 m-0 w-full"
                    name="nama_laporan"
                    rules={[
                      {
                        required: true,
                        message: 'Nama laporan wajib diisi!'
                      }
                    ]}
                  >
                    <Select className="w-full" size="large" placeholder="Pilih Laporan">
                      {reportWithoutNikRequired?.map((item) => (
                        <Select.Option key={item.id} value={item.id}>
                          {item.report_name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    className="col-span-4 m-0 w-full"
                    name="report_type"
                    rules={[
                      {
                        required: true,
                        message: 'Tipe Laporan wajib diisi!'
                      }
                    ]}
                  >
                    <Select className="w-full" size="large" placeholder="Pilih Tipe Laporan">
                      <Select.Option value="diri sendiri">Diri Sendiri</Select.Option>
                      <Select.Option value="keluarga">Keluarga</Select.Option>
                      <Select.Option value="lainnya">Lainnya</Select.Option>
                    </Select>
                  </Form.Item>
                  <Button className="w-full lg:w-fit" loading={getVillageReportDetail.isLoading} variant="solid" color="primary" size="large" htmlType="submit">
                    Proses
                  </Button>
                </Form>
              </Tabs.TabPane>
              <Tabs.TabPane tab="Laporan Dengan NIK Terdaftar" key="withnik">
                <Form form={noNIkForm} className="mt-4 flex w-full flex-col items-center gap-2 lg:flex-row" onFinish={(values) => handleReportFetch(values, true)}>
                  <Form.Item
                    className="col-span-4 m-0 w-full"
                    name="nik"
                    rules={[
                      {
                        required: true,
                        message: 'NIK wajib diisi!'
                      },
                      {
                        pattern: /^[0-9]+$/,
                        message: 'NIK harus berupa angka !'
                      }
                    ]}
                  >
                    <Input className="w-full" size="large" placeholder="Masukan NIK" />
                  </Form.Item>
                  <Form.Item
                    className="col-span-4 m-0 w-full"
                    name="tanggal_lahir"
                    rules={[
                      {
                        required: true,
                        message: 'Tanggal lahir wajib diisi!'
                      }
                    ]}
                  >
                    <DatePicker className="w-full" size="large" placeholder="Masukan Tanggal Lahir" />
                  </Form.Item>
                  <Form.Item
                    className="col-span-4 m-0 w-full"
                    name="nama_laporan"
                    rules={[
                      {
                        required: true,
                        message: 'Nama laporan wajib diisi!'
                      }
                    ]}
                  >
                    <Select className="w-full" size="large" placeholder="Pilih Laporan">
                      {reportWithNikRequired?.map((item) => (
                        <Select.Option key={item.id} value={item.id}>
                          {item.report_name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    className="col-span-4 m-0 w-full"
                    name="report_type"
                    rules={[
                      {
                        required: true,
                        message: 'Tipe Laporan wajib diisi!'
                      }
                    ]}
                  >
                    <Select className="w-full" size="large" placeholder="Pilih Tipe Laporan">
                      <Select.Option value="diri sendiri">Diri Sendiri</Select.Option>
                      <Select.Option value="keluarga">Keluarga</Select.Option>
                      <Select.Option value="lainnya">Lainnya</Select.Option>
                    </Select>
                  </Form.Item>
                  <Button className="w-full lg:w-fit" loading={searchResident.isLoading} variant="solid" color="primary" size="large" htmlType="submit">
                    Proses
                  </Button>
                </Form>
              </Tabs.TabPane>
            </Tabs>
          </Card>
          {!state.isSubmitted && Object.keys(state.villageReportDetail).length > 0 && (
            <Card>
              <Typography.Title level={5}>{state.villageReportDetail.letter_name}</Typography.Title>
              {mapAttributesToFormFields(state.villageReportDetail.report_attribute).length === 0 ? (
                <Result
                  status="info"
                  title="Kirim Laporan!"
                  subTitle="Laporan yang dipilih tidak memiliki atribut, silahkan klik tombol kirim untuk melanjutkan"
                  extra={
                    <Button type="primary" onClick={handleSubmitLetter}>
                      Kirim Laporan
                    </Button>
                  }
                />
              ) : (
                <Crud formFields={mapAttributesToFormFields(state.villageReportDetail.report_attribute)} type="create" onSubmit={handleSubmitLetter} isLoading={state.submitLoading} />
              )}
            </Card>
          )}
        </div>
      </section>

      <Modal width={700} open={state.isModalOpen} onCancel={handleModalClose} footer={null}>
        {state.modalStatus === 'success' ? (
          <Result status="success" title="Laporan Berhasil!" subTitle="Laporan Anda telah berhasil dibuat dan diproses.">
            <div className="flex flex-col items-center justify-center gap-y-4">
              <div className="desc inline-flex w-full items-center justify-center gap-x-6">
                <b className="text-5xl text-gray-500">{state.formData.token}</b>
                <Tooltip title="Salin Ke Clipboard">
                  <button onClick={() => copyToClipboard(state.formData.token)} className="flex h-12 w-12 items-center justify-center rounded-md border-2 border-gray-300 text-gray-400">
                    <CopyOutlined />
                  </button>
                </Tooltip>
              </div>
            </div>
          </Result>
        ) : state.modalStatus === 'error' ? (
          <Result
            status="error"
            title="Laporan Gagal!"
            subTitle="Terjadi kesalahan dalam proses pengajuan Laporan. Coba lagi."
            extra={
              <Button type="primary" onClick={handleModalClose}>
                Coba Lagi
              </Button>
            }
          />
        ) : (
          state.isModalOpen &&
          state.formData.nik &&
          state.modalStatus === 'initial' && (
            <Result
              status="success"
              title="Lanjutkan Membuat Laporan"
              subTitle="Anda terdaftar dalam database kependudukan desa. Silakan lanjutkan."
              extra={
                <Button
                  type="primary"
                  onClick={() => {
                    fetchVillageReportDetail(state.formData.nama_laporan);
                    dispatch({ type: 'SET_MODAL_OPEN', payload: false });
                  }}
                >
                  Lanjutkan
                </Button>
              }
            />
          )
        )}
      </Modal>
    </>
  );
};

export default SubmitReport;
