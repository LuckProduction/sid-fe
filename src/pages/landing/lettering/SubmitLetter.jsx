import { Crud, Reveal } from '@/components';
import { useNotification, useService } from '@/hooks';
import { LandingService } from '@/services';
import { BASE_URL } from '@/utils/api';
import { copyToClipboard } from '@/utils/clipBoard';
import dateFormatter from '@/utils/dateFormatter';
import helperJsonApi from '@/utils/helperJsonApi';
import { mapLetterAttributesToFormFields } from '@/utils/letterAttributToForm';
import { CopyOutlined, LeftOutlined } from '@ant-design/icons';
import { Button, Card, DatePicker, Form, Input, Modal, Result, Select, Tooltip, Typography } from 'antd';
import { useEffect, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';

const initialState = {
  isModalOpen: false,
  submitLoading: false,
  formData: {},
  modalStatus: 'initial',
  isSubmitted: false,
  letterTypeDetail: {}
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
    case 'SET_LETTER_TYPE_DETAIL':
      return { ...state, letterTypeDetail: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
};

const SubmitLetter = () => {
  const navigate = useNavigate();
  const { error, success } = useNotification();
  const [form] = Form.useForm();
  const [state, dispatch] = useReducer(reducer, initialState);

  const { execute: fetchLetterType, ...getAllLetterType } = useService(LandingService.getAllLetterType);
  const { execute: fetchLetterTypeDetail, ...getLetterTypeDetail } = useService(LandingService.getLetterTypeDetail);
  const searchResident = useService(LandingService.getResident);

  useEffect(() => {
    fetchLetterType();
  }, [fetchLetterType]);

  const LetterType = getAllLetterType.data ?? [];

  useEffect(() => {
    dispatch({ type: 'SET_LETTER_TYPE_DETAIL', payload: getLetterTypeDetail.data ?? {} });
  }, [getLetterTypeDetail.data]);

  const handleCheckLetter = async (values) => {
    try {
      const { data, isSuccess } = await searchResident.execute({
        ...values,
        tanggal_lahir: dateFormatter(values.tanggal_lahir)
      });

      dispatch({
        type: 'SET_FORM_DATA',
        payload: isSuccess && data ? { ...data, jenis_surat: values.jenis_surat } : {}
      });

      dispatch({ type: 'SET_MODAL_STATUS', payload: 'initial' });
      dispatch({ type: 'SET_MODAL_OPEN', payload: true });
    } catch (err) {
      console.error('Terjadi kesalahan:', err);
    }
  };

  const handleSubmitLetter = async (values) => {
    dispatch({ type: 'SET_SUBMIT_LOADING', payload: true });

    try {
      const formattedData = {
        master_penduduk_id: state.formData.id,
        jenis_surat_id: state.letterTypeDetail.id,
        atribut_permohonan_surat: await Promise.all(
          state.letterTypeDetail.letter_attribut.map(async (attr) => {
            const content = values[attr.attribute];

            if (content?.fileList?.length > 0) {
              return new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(content.fileList[0].originFileObj);
                reader.onload = () => {
                  resolve({
                    atribut_surat_id: attr.id,
                    konten: reader.result.split(',')[1]
                  });
                };
              });
            }
            return { atribut_surat_id: attr.id, konten: values[attr.attribute] };
          })
        )
      };

      const response = await helperJsonApi(BASE_URL + '/permohonan-surat', formattedData);

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
    form.resetFields();
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
            <Typography.Title style={{ color: '#fff' }}>Permohonan Surat</Typography.Title>
          </Reveal>
          <Reveal>
            <div className="max-w-lg">
              <small>Ajukan surat sesuai kebutuhan Anda dalam hitungan menit. Isi detail yang diperlukan, dan biarkan sistem kami mengurus sisanya dengan cepat dan efisien!</small>
            </div>
          </Reveal>
        </div>
        <img src="/illustration/city_sillhoute_transparent.png" className="absolute bottom-0 left-0 z-0 w-full" />
      </section>
      <section className="min-h-screen w-full bg-white">
        <div className="mx-auto flex max-w-screen-lg flex-col gap-y-6 px-6 py-12">
          <Card className="w-full">
            <Form form={form} className="flex w-full flex-col items-center gap-2 lg:flex-row" onFinish={handleCheckLetter}>
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
                name="jenis_surat"
                rules={[
                  {
                    required: true,
                    message: 'Jenis Surat wajib diisi!'
                  }
                ]}
              >
                <Select className="w-full" size="large" placeholder="Pilih Jenis Surat">
                  {LetterType?.map((item) => (
                    <Select.Option key={item.id} value={item.id}>
                      {item.letter_name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Button className="w-full lg:w-fit" loading={searchResident.isLoading} variant="solid" color="primary" size="large" htmlType="submit">
                Proses
              </Button>
            </Form>
          </Card>
          {!state.isSubmitted && Object.keys(state.letterTypeDetail).length > 0 && (
            <Card>
              <Typography.Title level={5}>{state.letterTypeDetail.letter_name}</Typography.Title>
              {mapLetterAttributesToFormFields(state.letterTypeDetail.letter_attribut).length === 0 ? (
                <Result
                  status="info"
                  title="Kirim Permohonan Surat!"
                  subTitle="Surat yang dipilih tidak memiliki atribut surat, silahkan klik tombol kirim untuk melanjutkan"
                  extra={
                    <Button type="primary" onClick={handleSubmitLetter}>
                      Kirim Permohonan
                    </Button>
                  }
                />
              ) : (
                <Crud formFields={mapLetterAttributesToFormFields(state.letterTypeDetail.letter_attribut)} type="create" onSubmit={handleSubmitLetter} isLoading={state.submitLoading} />
              )}
            </Card>
          )}
        </div>
      </section>

      <Modal width={700} open={state.isModalOpen} onCancel={handleModalClose} footer={null}>
        {state.modalStatus === 'success' ? (
          <Result status="success" title="Permohonan Berhasil!" subTitle="Surat Anda telah berhasil dibuat dan diproses.">
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
            title="Permohonan Gagal!"
            subTitle="Terjadi kesalahan dalam proses pengajuan surat. Coba lagi."
            extra={
              <Button type="primary" onClick={handleModalClose}>
                Coba Lagi
              </Button>
            }
          />
        ) : (
          <Result
            status="success"
            title="Lanjutkan Membuat Surat"
            subTitle="Anda terdaftar dalam database kependudukan desa. Silakan lanjutkan."
            extra={
              <Button
                type="primary"
                onClick={() => {
                  fetchLetterTypeDetail(state.formData.jenis_surat);
                  dispatch({ type: 'SET_MODAL_OPEN', payload: false });
                }}
              >
                Lanjutkan
              </Button>
            }
          />
        )}
      </Modal>
    </>
  );
};

export default SubmitLetter;
