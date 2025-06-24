import { Crud, Reveal } from '@/components';
import { InputType } from '@/constants';
import { useCrudModal } from '@/hooks';
import { LeftOutlined } from '@ant-design/icons';
import { Button, Card, Result, Typography } from 'antd';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MitraRegistration = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const modal = useCrudModal();
  const formRef = useRef();

  const MitraRegistrationFormFields = () => [
    {
      label: `Nama`,
      name: 'nama',
      type: InputType.TEXT,
      rules: [
        {
          required: true,
          message: `Nama harus diisi`
        }
      ]
    },
    {
      label: `Jabatan`,
      name: 'jabatan',
      type: InputType.TEXT,
      rules: [
        {
          required: true,
          message: `Jabatan harus diisi`
        }
      ]
    },
    {
      label: `Kode Referal`,
      name: 'kode_referal',
      type: InputType.TEXT
      // rules: [
      //   {
      //     required: true,
      //     message: `Kode Referal harus diisi`
      //   }
      // ]
    },
    {
      label: `No HP`,
      name: 'no_hp',
      type: InputType.TEXT,
      rules: [
        {
          required: true,
          message: `No HP harus diisi`
        },
        {
          validator: (_, value) => {
            if (!value || /^628\d{7,10}$/.test(value)) {
              return Promise.resolve();
            }
            return Promise.reject(new Error('Nomor telepon harus diawali dengan 628 dan memiliki 10-13 digit'));
          }
        }
      ]
    },
    {
      label: `Email`,
      name: 'email',
      type: InputType.TEXT,
      rules: [
        {
          required: true,
          message: `Email harus diisi`
        },
        { type: 'email', message: 'Gunakan email yang valid' }
      ]
    },
    {
      label: `Instansi`,
      name: 'instansi',
      type: InputType.TEXT,
      rules: [
        {
          required: true,
          message: `Email harus diisi`
        }
      ]
    }
  ];

  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      const response = await fetch('https://api-example.go-village.id/api/pendaftaran-mitra', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...values, kode_referal: values.kode_referal ?? null })
      });

      const result = await response.json();

      if (response.ok) {
        modal.show.paragraph({
          data: {
            content: (
              <Result
                status="success"
                title="Pendaftaran Mitra Berhasil"
                subTitle="Terima kasih telah bergabung. Kami akan segera menghubungi Anda untuk langkah selanjutnya."
                extra={[
                  <Button
                    key="success-confirm"
                    onClick={() => {
                      modal.close();
                      formRef.current?.form?.resetFields();
                    }}
                  >
                    Konfirmasi
                  </Button>
                ]}
              />
            )
          }
        });
        return true;
      } else {
        throw new Error(result?.message || 'Terjadi kesalahan saat memproses pendaftaran.');
      }
    } catch (error) {
      modal.show.paragraph({
        data: {
          content: (
            <Result
              status="error"
              title="Pendaftaran Gagal"
              subTitle={error.message || 'Terjadi kesalahan tidak terduga. Silakan coba lagi nanti.'}
              extra={[
                <Button
                  key="error-confirm"
                  onClick={() => {
                    modal.close();
                    formRef.current?.form?.resetFields();
                  }}
                >
                  Konfirmasi
                </Button>
              ]}
            />
          )
        }
      });
      return false;
    } finally {
      setIsLoading(false);
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
            <Typography.Title style={{ color: '#fff' }}>Daftar Sebagai Mitra</Typography.Title>
          </Reveal>
          <Reveal>
            <div className="max-w-lg">
              <small> Jadilah bagian dari ekosistem digital desa. Bekerja sama untuk menciptakan solusi, mendukung transparansi, dan mempercepat pembangunan berbasis data.</small>
            </div>
          </Reveal>
        </div>
        <img src="/illustration/city_sillhoute_transparent.png" className="absolute bottom-0 left-0 z-0 w-full" />
      </section>
      <section className="min-h-screen w-full bg-white">
        <div className="mx-auto flex max-w-screen-lg flex-col gap-y-6 px-6 py-12">
          <Card>
            <Crud ref={formRef} formFields={MitraRegistrationFormFields()} type="create" onSubmit={handleSubmit} isLoading={isLoading} />
          </Card>
        </div>
      </section>
    </>
  );
};

export default MitraRegistration;
