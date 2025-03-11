/* eslint-disable react-hooks/exhaustive-deps */
import { landingLink } from '@/data/link';
import { findItemByKey } from '@/utils/landingLink';
import { MenuOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Drawer, Grid, Image, Menu, Skeleton } from 'antd';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ villageProfile }) => {
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

  const executeVillageProfile = useCallback(() => villageProfile.execute(), [villageProfile]);

  useEffect(() => {
    executeVillageProfile();
  }, []);

  const isDesktop = breakpoints.lg || breakpoints.xl || breakpoints.xxl;

  return (
    <div className="mx-auto flex w-full max-w-screen-xl items-center justify-between gap-x-4 p-4">
      <div className="flex w-fit items-center gap-x-4 lg:w-full">
        {isDesktop ? (
          <>
            {villageProfile.isLoading ? (
              <div className="inline-flex items-center gap-x-2">
                <Skeleton.Button size="large" active />
                <Skeleton.Input size="small" active />
              </div>
            ) : (
              <>
                <Image width={40} preview={false} src={villageProfile?.data?.village_logo} />
                <b>
                  Desa <span className="text-blue-500">{villageProfile?.data?.village_name}</span>{' '}
                </b>
              </>
            )}
            {/* <Menu style={{ minWidth: 0, flex: 'auto', border: 'none' }} mode="horizontal" items={landingLink} activeKey="" onClick={handleMenuClick} /> */}
          </>
        ) : (
          <>
            <Button icon={<MenuOutlined />} onClick={openDrawer} />
            <Drawer open={isDrawerOpen} onClose={closeDrawer} placement="left" width={300}>
              <Menu items={landingLink} mode="inline" onClick={handleMenuClick} />
            </Drawer>
          </>
        )}
      </div>
      <div className="flex items-center justify-end gap-x-4">
        <Button variant="solid" color="primary" icon={<UserOutlined />} onClick={() => navigate('/auth/login')}>
          Masuk
        </Button>
      </div>
    </div>
  );
};

Navbar.propTypes = {
  villageProfile: PropTypes.object
};

export default Navbar;
