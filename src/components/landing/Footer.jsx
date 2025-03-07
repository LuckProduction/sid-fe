import { FacebookFilled, InstagramFilled, YoutubeFilled } from '@ant-design/icons';
import { Button, Image } from 'antd';
import { NavLink } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="w-full border-t-2 bg-white">
      <div className="mx-auto w-full max-w-screen-xl px-4 pb-4 pt-24">
        <div className="grid w-full grid-cols-6 gap-12">
          <div className="col-span-6 flex flex-col gap-y-6 lg:col-span-2">
            <Image width={125} src="/logo/brand_colored.png" />
            <small>Kelola administrasi desa lebih cepat, mudah, dan transparan dengan Sistem Informasi Desa! Digitalisasi tata kelola desa untuk pelayanan publik yang lebih efisien dan modern.</small>
            <div className="flex items-center gap-x-2">
              <Button type="primary" shape="circle" icon={<InstagramFilled />} />
              <Button type="primary" shape="circle" icon={<FacebookFilled />} />
              <Button type="primary" shape="circle" icon={<YoutubeFilled />} />
            </div>
          </div>
          <div className="col-span-6 grid grid-cols-12 gap-y-12 lg:col-span-4">
            <div className="col-span-12 flex flex-col gap-y-3 lg:col-span-4">
              <b>Quick Access</b>
              <NavLink className="text-sm">Home</NavLink>
              <NavLink className="text-sm">About</NavLink>
              <NavLink className="text-sm">Service</NavLink>
              <NavLink className="text-sm">Testimonial</NavLink>
              <NavLink className="text-sm">Contact</NavLink>
            </div>
            <div className="col-span-12 flex flex-col gap-y-3 lg:col-span-4">
              <b>Service</b>
              <NavLink className="text-sm">Web Design</NavLink>
              <NavLink className="text-sm">Web Development</NavLink>
              <NavLink className="text-sm">Seo Optimation</NavLink>
              <NavLink className="text-sm">Blog Writing</NavLink>
            </div>
            <div className="col-span-12 flex flex-col gap-y-3 lg:col-span-4">
              <b>Help & Support</b>
              <NavLink className="text-sm">Support Center</NavLink>
              <NavLink className="text-sm">Live Chat</NavLink>
              <NavLink className="text-sm">FAQ</NavLink>
              <NavLink className="text-sm">Terms & Condition</NavLink>
            </div>
          </div>
          <div className="col-span-6 flex items-center justify-center border-t-2 py-6">
            <small className="text-gray-500">Design Development And Design by Cafeekita</small>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
