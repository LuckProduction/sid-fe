import { Footer as AntdFooter } from 'antd/es/layout/layout';

const Footer = () => {
  return (
    <AntdFooter style={{ textAlign: 'center' }}>
      <div>
        SID ©{new Date().getFullYear()} Created by <a href="">Badigo</a>
      </div>
    </AntdFooter>
  );
};

export default Footer;
