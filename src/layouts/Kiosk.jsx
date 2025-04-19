import { useService } from '@/hooks';
import { LandingService } from '@/services';
import { Image, Skeleton } from 'antd';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

const Kiosk = () => {
  const { execute: fetchVillageProfile, ...getVillageProfile } = useService(LandingService.getVillageProfile);

  useEffect(() => {
    fetchVillageProfile();
  }, [fetchVillageProfile]);

  const villageProfile = getVillageProfile.data ?? {};

  return (
    <div className="flex h-dvh flex-col font-sans">
      <header className="fixed left-0 right-0 top-0 z-[999]">
        <div className="mx-auto flex w-full max-w-screen-xl items-center justify-between gap-x-4 p-4">
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
                  <small>
                    Kecamatan {villageProfile?.district_profile?.district_name}, {villageProfile?.district_profile?.regency_profile?.regency_name}
                  </small>
                </div>
              </div>
            </>
          )}

          <div>
            <Image width={120} preview={false} src="/logo/brand_text_symbol.png" />
          </div>
        </div>
      </header>

      <main className="h-screen w-full flex-auto bg-white pt-8">
        <Outlet />
        {/* <Footer /> */}
      </main>
    </div>
  );
};

export default Kiosk;
