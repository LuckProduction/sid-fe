import { Crud } from '@/components';
import { useKioskAuth } from '@/context/KiosAuth';
import { useNotification, useService } from '@/hooks';
import { LandingService } from '@/services';
import { BASE_URL } from '@/utils/api';
import { mapAttributesToFormFields } from '@/utils/attributToForm';
import helperJsonApi from '@/utils/helperJsonApi';
import { FileOutlined, LeftOutlined, ScanOutlined, TableOutlined } from '@ant-design/icons';
import { Button, Card, Descriptions, Form, Modal, Result, Select, Steps, Typography } from 'antd';
import { useEffect, useReducer, useState } from 'react';
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
  const { execute: fetchLetterType, ...getAllLetterType } = useService(LandingService.getAllLetterType);
  const { execute: fetchLetterTypeDetail, ...getLetterTypeDetail } = useService(LandingService.getLetterTypeDetail);
  const [step, setStep] = useState('letter_type');
  const [state, dispatch] = useReducer(reducer, initialState);
  const { error, success } = useNotification();
  const { user } = useKioskAuth();

  useEffect(() => {
    fetchLetterType();
  }, [fetchLetterType]);

  const letterType = getAllLetterType.data ?? [];

  useEffect(() => {
    dispatch({ type: 'SET_LETTER_TYPE_DETAIL', payload: getLetterTypeDetail.data ?? {} });
  }, [getLetterTypeDetail.data]);

  const handleCheckLetter = async (values) => {
    try {
      dispatch({ type: 'SET_FORM_DATA', payload: { jenis_surat: values.jenis_surat } });
      dispatch({ type: 'SET_MODAL_STATUS', payload: 'initial' });

      const { isSuccess, data } = await fetchLetterTypeDetail(values.jenis_surat);
      if (isSuccess) {
        dispatch({ type: 'SET_LETTER_TYPE_DETAIL', payload: data });
        setStep('attribut');
      } else {
        error('Gagal');
      }
    } catch (err) {
      error('Gagal', err);
      setStep('letter_type');
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

  const getPreviewData = (values) => {
    return Object.entries(values).map(([key, value]) => ({
      label: key,
      value: value?.fileList ? value.fileList.map((f) => f.name).join(', ') : value || '-'
    }));
  };

  const handlePreviewLetter = async (values) => {
    dispatch({ type: 'SET_FORM_DATA', payload: values });
    setStep('preview');
  };

  const handleSubmitLetter = async (values) => {
    dispatch({ type: 'SET_SUBMIT_LOADING', payload: true });
    try {
      const formattedData = {
        master_penduduk_id: user.id,
        jenis_surat_id: state.letterTypeDetail.id,
        atribut_permohonan_surat: (
          await Promise.all(
            state.letterTypeDetail.letter_attribut.flatMap(async (attr) => {
              const content = values[attr.attribute];
              if (content?.fileList?.length > 0) {
                return Promise.all(
                  content.fileList.map(async (file) => {
                    const base64String = await readFileAsBase64(file.originFileObj);
                    return {
                      atribut_surat_id: attr.id,
                      konten: base64String ?? '-'
                    };
                  })
                );
              }

              return {
                atribut_surat_id: attr.id,
                konten: values[attr.attribute] ?? '-'
              };
            })
          )
        ).flat()
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
    setStep('letter_type');
  };

  return (
    <section className="relative flex h-full w-full">
      <div className="flex h-full w-full flex-[2] items-center justify-center pb-60">
        <div className="flex flex-col px-24">
          <button className="mb-6 inline-flex items-center gap-x-2 text-sm" onClick={() => navigate(-1)}>
            <LeftOutlined />
            kembali
          </button>
          <Typography.Title level={1} style={{ marginTop: 0 }}>
            Permohonan Surat
          </Typography.Title>
        </div>
      </div>
      <div className="flex h-full w-full flex-[4] items-center justify-center bg-blue-500">
        <div className="flex w-full max-w-2xl flex-col gap-y-12">
          <Card className="w-full">
            <Steps
              current={step === 'letter_type' ? 0 : step === 'attribut' ? 1 : 2}
              items={[
                {
                  title: 'Pilih Surat',
                  icon: <FileOutlined />
                },
                {
                  title: 'Atribut Surat',
                  icon: <TableOutlined />
                },
                {
                  title: 'Konfirmasi Surat',
                  icon: <ScanOutlined />
                }
              ]}
            />
          </Card>

          {step === 'letter_type' && (
            <Form onFinish={handleCheckLetter}>
              <Card className="h-fit w-full">
                <Form.Item className="m-0 w-full" name="jenis_surat">
                  <Select
                    className="w-full"
                    size="large"
                    placeholder="Pilih Jenis Surat"
                    style={{
                      height: 64,
                      fontSize: 20,
                      borderRadius: 8
                    }}
                    options={letterType?.map((item) => ({
                      label: item.letter_name,
                      value: item.id
                    }))}
                  ></Select>
                </Form.Item>
              </Card>
              <Form.Item className="m-0 w-full">
                <Button loading={getLetterTypeDetail.isLoading} size="large" variant="solid" className="mt-4 w-full p-6" htmlType="submit">
                  Lanjutkan
                </Button>
              </Form.Item>
            </Form>
          )}
          {step === 'attribut' && (
            <>
              {!state.letterTypeDetail?.letter_attribut?.length ? (
                <Result
                  status="warning"
                  title="Tidak ada atribut untuk surat ini"
                  subTitle="Silakan pilih surat lain atau lanjutkan permohonan tanpa atribut."
                  extra={
                    <Button type="primary" onClick={handlePreviewLetter}>
                      Lanjutkan
                    </Button>
                  }
                />
              ) : (
                <Card className="max-h-80 w-full overflow-y-auto">
                  <Crud extraLarge={true} formFields={mapAttributesToFormFields(state.letterTypeDetail.letter_attribut)} type="create" onSubmit={handlePreviewLetter} isLoading={state.submitLoading} />
                </Card>
              )}
            </>
          )}
          {step === 'preview' && (
            <Card className="w-full">
              <Typography.Title level={4}>Konfirmasi Atribut Surat</Typography.Title>
              <Descriptions column={1} bordered size="default">
                {getPreviewData(state.formData).map((item, idx) => (
                  <Descriptions.Item key={idx} label={item.label}>
                    {item.value}
                    {console.log(item)}
                  </Descriptions.Item>
                ))}
              </Descriptions>
              <div className="mt-4 flex justify-between">
                <Button onClick={() => setStep('attribut')}>Kembali</Button>
                <Button type="primary" loading={state.submitLoading} onClick={() => handleSubmitLetter(state.formData)}>
                  Konfirmasi dan Kirim
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
      <div className="absolute bottom-0 w-[22rem]">
        <img src="/illustration/briefcase.png" />
      </div>
      <Modal width={700} open={state.isModalOpen} onCancel={handleModalClose} footer={null}>
        {state.modalStatus === 'success' ? (
          <Result
            status="success"
            title="Permohonan Berhasil!"
            subTitle="Surat Anda telah berhasil dibuat dan diproses."
            extra={[
              <Button key="cek_surat" color="primary" variant="solid" size="large" onClick={() => navigate('kiosk/features/lettering/browse_letter')}>
                Cari Surat
              </Button>
            ]}
          />
        ) : (
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
        )}
      </Modal>
    </section>
  );
};

export default SubmitLetter;
