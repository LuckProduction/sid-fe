// import { FacebookFilled, InstagramFilled, YoutubeFilled } from '@ant-design/icons';
import { Image } from 'antd';
import { NavLink } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="w-full border-t-2 bg-white">
      <div className="mx-auto w-full max-w-screen-xl px-4 pb-4 pt-24">
        <div className="grid w-full grid-cols-6 gap-12">
          <div className="col-span-6 flex flex-col gap-y-6 lg:col-span-2">
            <Image width={125} src="/logo/brand_colored.png" />
            <small>Kelola administrasi desa lebih cepat, mudah, dan transparan dengan Sistem Informasi Desa! Digitalisasi tata kelola desa untuk pelayanan publik yang lebih efisien dan modern.</small>
            {/* <div className="flex items-center gap-x-2">
              <Button type="primary" shape="circle" icon={<InstagramFilled />} />
              <Button type="primary" shape="circle" icon={<FacebookFilled />} />
              <Button type="primary" shape="circle" icon={<YoutubeFilled />} />
            </div> */}
          </div>
          <div className="col-span-6 grid grid-cols-12 gap-y-12 lg:col-span-4">
            <div className="col-span-12 flex flex-col gap-y-3 lg:col-span-4">
              <b>Quick Access</b>
              <NavLink className="text-sm" to="/">
                Home
              </NavLink>
            </div>
            <div className="col-span-12 flex flex-col gap-y-3 lg:col-span-4">
              <b>Service</b>
              <NavLink className="text-sm" to="/mobile_landing">
                Go Village Mobile
              </NavLink>
              <NavLink className="text-sm" to="/">
                Go Village Web
              </NavLink>
            </div>
            <div className="col-span-12 flex flex-col gap-y-3 lg:col-span-4">
              <b>Help & Support</b>
              <NavLink className="text-sm" to="/privacy_policy">
                Privacy & Policy
              </NavLink>
              <NavLink className="text-sm" to="/mitra_registration">
                Pendaftaran Mitra
              </NavLink>
            </div>
          </div>
          <div className="col-span-6 flex items-center justify-center border-t-2 py-6">
            <small className="text-gray-500">Design Development And Design by Badigo</small>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
