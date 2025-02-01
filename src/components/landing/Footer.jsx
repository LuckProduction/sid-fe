import { FacebookFilled, InstagramFilled, YoutubeFilled } from '@ant-design/icons';
import { Button, Image, Typography } from 'antd';

const Footer = () => {
  return (
    <footer className="w-full border-t-2 bg-white">
      <div className="mx-auto grid w-full max-w-screen-xl grid-cols-12 gap-12 px-4 pb-4 pt-24">
        <div className="col-span-5 flex flex-col gap-y-6">
          <Image width={64} src="/logo/bonebolango.jpg" />
          <small>Melalui misi dan komitmen ganda untuk kemajuan bisnis dan sosial, Danone memiliki tujuan untuk membangun masa depan yang lebih sehat dari gaya hidup sehat</small>
          <div className="flex items-center gap-x-2">
            <Button type="primary" shape="circle" icon={<InstagramFilled />} />
            <Button type="primary" shape="circle" icon={<FacebookFilled />} />
            <Button type="primary" shape="circle" icon={<YoutubeFilled />} />
          </div>
        </div>
        <div className="col-span-7 grid grid-cols-12">
          <div className="col-span-4 flex flex-col gap-y-3">
            <b>Quick Access</b>
            <Typography.Text>Home</Typography.Text>
            <Typography.Text>About</Typography.Text>
            <Typography.Text>Service</Typography.Text>
            <Typography.Text>Testimonial</Typography.Text>
            <Typography.Text>Contact</Typography.Text>
          </div>
          <div className="col-span-4 flex flex-col gap-y-3">
            <b>Service</b>
            <Typography.Text>Web Design</Typography.Text>
            <Typography.Text>Web Development</Typography.Text>
            <Typography.Text>Seo Optimation</Typography.Text>
            <Typography.Text>Blog Writing</Typography.Text>
          </div>
          <div className="col-span-4 flex flex-col gap-y-3">
            <b>Help & Support</b>
            <Typography.Text>Support Center</Typography.Text>
            <Typography.Text>Live Chat</Typography.Text>
            <Typography.Text>FAQ</Typography.Text>
            <Typography.Text>Terms & Condition</Typography.Text>
          </div>
        </div>
        <div className="col-span-12 flex items-center justify-center border-t-2 py-6">
          <small className="text-gray-500">Design Development And Design by Cafeekita</small>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
