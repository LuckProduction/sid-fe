import { useAuth, useNotification } from '@/hooks';
import { EyeInvisibleOutlined, EyeOutlined, LockOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, Space } from 'antd';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const ForgetPassword = () => {
  const { forgot, isLoading, verify, reset } = useAuth();
  const { success, error } = useNotification();

  const [verifForm] = Form.useForm();
  const [resetForm] = Form.useForm();

  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [verifData, setVerifData] = useState({ email: '', code: '' });

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSendCode = async () => {
    try {
      const email = verifForm.getFieldValue('email');
      if (!email) return error('Gagal', 'Mohon masukkan email terlebih dahulu!');

      const { isSuccess, message } = await forgot(email);
      if (!isSuccess) return error('Gagal', message);

      success('Berhasil', message);
      setIsCodeSent(true);
      setCountdown(10);
    } catch {
      error('Gagal', 'Terjadi kesalahan saat mengirim kode');
    }
  };

  const handleVerif = async (values) => {
    const { email, code } = values;
    const { isSuccess, message } = await verify(email, code);
    if (isSuccess) {
      success('Berhasil', message);
      setIsVerified(true);
      setVerifData({ email, code });
      resetForm.setFieldsValue({ code });
    } else {
      error('Gagal', message);
    }
  };

  const handleReset = async (values) => {
    const { isSuccess, message } = await reset(verifData.code, verifData.email, values.password, values.password_confirmation);
    if (isSuccess) {
      success('Berhasil', message);
      window.location.href = '/';
    } else {
      error('Gagal', message);
    }
  };

  return (
    <Card className="w-full max-w-md px-4">
      <div className="mb-5 mt-4 flex w-full flex-col items-center justify-center gap-y-2">
        <div className="mb-4 flex flex-col items-center justify-center gap-y-2 text-center">
          <h1 className="text-xl font-semibold">Lupa Kata Sandi</h1>
          <p className="max-w-xs text-xs">Masukkan email Anda untuk menerima tautan pemulihan. Sistem ini membantu Anda mengelola data dan layanan desa secara mudah dan aman.</p>
        </div>
      </div>

      {/* FORM VERIFIKASI */}
      {!isVerified && (
        <Form form={verifForm} name="forgot" layout="vertical" onFinish={handleVerif}>
          <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Mohon masukkan email!' }]}>
            <Space.Compact style={{ width: '100%' }}>
              <Input size="large" placeholder="Masukkan email terdaftar" />
              <Button size="large" type="primary" disabled={countdown > 0} onClick={handleSendCode} loading={isLoading}>
                {countdown > 0 ? `Ulangi (${countdown}s)` : 'Kode'}
              </Button>
            </Space.Compact>
          </Form.Item>

          {isCodeSent && (
            <Form.Item label="Kode Verifikasi" name="code" rules={[{ required: true, message: 'Mohon masukkan kode verifikasi!' }]}>
              <Input size="large" placeholder="Masukkan kode verifikasi" />
            </Form.Item>
          )}

          <Form.Item>
            <Button block loading={isLoading} type="primary" htmlType="submit" size="large" disabled={!isCodeSent}>
              Kirim
            </Button>
          </Form.Item>

          <Form.Item>
            <span className="m-0 block text-center">
              Sudah punya akun?{' '}
              <Link className="text-color-primary-500 hover:text-color-primary-200 font-bold underline" to="/">
                Login
              </Link>
            </span>
          </Form.Item>
        </Form>
      )}

      {/* FORM RESET PASSWORD */}
      {isVerified && (
        <Form form={resetForm} name="reset" layout="vertical" onFinish={handleReset}>
          <Form.Item label="Kode Verifikasi" name="code" rules={[{ required: true, message: 'Mohon masukkan kode verifikasi!' }]}>
            <Input size="large" disabled placeholder="Masukkan kode verifikasi" />
          </Form.Item>

          <Form.Item name="password" rules={[{ required: true, message: 'Mohon masukkan kata sandi!' }]}>
            <Input
              prefix={<LockOutlined />}
              type={passwordVisible ? 'text' : 'password'}
              placeholder="Kata Sandi"
              size="large"
              suffix={passwordVisible ? <EyeOutlined onClick={() => setPasswordVisible(false)} /> : <EyeInvisibleOutlined onClick={() => setPasswordVisible(true)} />}
            />
          </Form.Item>

          <Form.Item name="password_confirmation" rules={[{ required: true, message: 'Mohon ulangi kata sandi!' }]}>
            <Input
              prefix={<LockOutlined />}
              type={passwordVisible ? 'text' : 'password'}
              placeholder="Ulangi kata sandi"
              size="large"
              suffix={passwordVisible ? <EyeOutlined onClick={() => setPasswordVisible(false)} /> : <EyeInvisibleOutlined onClick={() => setPasswordVisible(true)} />}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large" loading={isLoading}>
              Reset Kata Sandi
            </Button>
          </Form.Item>
        </Form>
      )}
    </Card>
  );
};

export default ForgetPassword;
