import { landingLink } from '@/data/link';
import { findItemByKey } from '@/utils/landingLink';
import { MenuOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Drawer, Grid, Image, Input, Menu } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const breakpoints = Grid.useBreakpoint();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const openDrawer = () => {
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  const handleMenuClick = (e) => {
    const clickedItem = findItemByKey(landingLink, e.key);
    if (clickedItem) {
      navigate(clickedItem.key);
    }
  };

  const isDesktop = breakpoints.lg || breakpoints.xl || breakpoints.xxl;

  return (
    <div className="mx-auto flex w-full max-w-screen-xl items-center justify-between gap-x-4 p-4">
      <div className="flex w-fit items-center gap-x-4 lg:w-full">
        {isDesktop ? (
          <>
            <Image width={40} preview={false} src="./logo/bonebolango.jpg" />
            <b>
              Desa <span className="text-blue-500">Sukma</span>{' '}
            </b>
            <Menu style={{ minWidth: 0, flex: 'auto', border: 'none' }} mode="horizontal" items={landingLink} activeKey="" onClick={handleMenuClick} />
          </>
        ) : (
          <>
            <Button icon={<MenuOutlined />} onClick={openDrawer} />
            <Drawer open={isDrawerOpen} onClose={closeDrawer} placement="left" width={300}>
              ini Drawer
            </Drawer>
          </>
        )}
      </div>
      <div className="flex w-full items-center justify-end gap-x-4">
        <Input.Search className="w-full lg:max-w-xs" placeholder="Cari" />
        <Button variant="solid" color="primary" icon={<UserOutlined />} onClick={() => navigate('/auth/login')}>
          Masuk
        </Button>
      </div>
    </div>
  );
};

export default Navbar;
