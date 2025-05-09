import { LiveClock } from '@/components';
import { useKioskAuth } from '@/context/KiosAuth';
import { useService } from '@/hooks';
import { LandingService } from '@/services';
import dateFormatter from '@/utils/dateFormatter';
import { PoweroffOutlined } from '@ant-design/icons';
import { Button, Image, Skeleton } from 'antd';
import { useCallback, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import KioskService, { kioskToken } from '../services/KioskService';

const Kiosk = () => {
  const { execute: fetchVillageProfile, ...getVillageProfile } = useService(LandingService.getVillageProfile);
  const { execute, ...getAllWebSettings } = useService(KioskService.getAllSettings);
  const { user, logout } = useKioskAuth();

  const fetchWebSettings = useCallback(() => {
    execute({ kioskToken });
  }, [execute]);

  useEffect(() => {
    fetchVillageProfile();
    fetchWebSettings();
  }, [fetchVillageProfile, fetchWebSettings]);

  const villageProfile = getVillageProfile.data ?? {};
  const webSettings = getAllWebSettings.data ?? [];

  const aksesAnjungan = webSettings?.find((setting) => setting.slug === 'akses_anjungan');

  if (!webSettings || aksesAnjungan?.nilai === 'false') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex h-dvh flex-col font-sans">
      <header className="fixed left-0 right-0 top-0 z-[999] py-4">
        <div className="mx-auto flex w-full max-w-screen-xl items-center justify-between gap-x-4 py-4">
          {getVillageProfile.isLoading ? (
            <div className="inline-flex items-center gap-x-2">
              <Skeleton.Button size="large" active />
              <Skeleton.Input size="small" active />
            </div>
          ) : (
            <>
              <div className="inline-flex items-center gap-x-2">
                <Image width={40} preview={false} src={villageProfile.village_logo} />
                <div className="flex flex-col">
                  <b>
                    Desa <span className="text-blue-500">{villageProfile.village_name}</span>{' '}
                  </b>
                  <small>Keca. {villageProfile?.district_profile?.district_name},</small>
                </div>
              </div>
            </>
          )}

          <div>
            <Image width={120} preview={false} src="/logo/brand_text_symbol_white.png" />
          </div>
        </div>
      </header>

      <main className="h-screen w-full flex-auto bg-white">
        <Outlet />
        <footer className="fixed bottom-0 left-0 right-0 z-[999] flex p-8">
          <div className="flex h-full w-full flex-[2] items-center justify-center"></div>
          <div className="flex h-full w-full flex-[4] items-center justify-between">
            {user && (
              <div className="ms-12">
                <Button onClick={logout} icon={<PoweroffOutlined />} size="large" variant="text" color="default" className="text-xl text-white" />
              </div>
            )}

            <div className="inline-flex w-full items-center justify-end divide-x-2 divide-white text-sm text-white">
              <LiveClock />
              <div className="px-4">
                <span>{dateFormatter(Date.now())}</span>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Kiosk;
