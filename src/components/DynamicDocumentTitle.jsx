import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { landingLink } from '@/data/link';
import { useService } from '@/hooks';
import { LandingService } from '@/services';
import { flattenLandingLinks } from '@/utils/landingLink';
import PropTypes from 'prop-types';

const DynamicDocumentTitle = ({ layout }) => {
  const location = useLocation();
  const flatLandingLinks = flattenLandingLinks(landingLink);

  const { data: villageProfile, execute: fetchVillageProfile } = useService(LandingService.getVillageProfile);

  const [titleData, setTitleData] = useState({
    title: 'Loading...',
    icon: '/vite.svg'
  });

  useEffect(() => {
    fetchVillageProfile();
  }, [fetchVillageProfile]);

  useEffect(() => {
    const pathname = location.pathname;
    const icon = villageProfile?.village_logo || '/vite.svg';
    const villageName = villageProfile?.village_name || 'GoVillage';
    const districtName = villageProfile?.district_profile?.district_name || '';

    let pageTitle = 'Beranda';

    if (layout === 'landing') {
      const matched = flatLandingLinks.find((link) => pathname === link.key || pathname.startsWith(link.key + '/'));

      if (pathname.startsWith('/dashboard')) {
        pageTitle = 'Dashboard';
      } else if (matched) {
        pageTitle = matched.label;
      } else {
        const parts = pathname.split('/').filter(Boolean);
        pageTitle = parts.at(-1)?.replace(/_/g, ' ') || 'Beranda';
      }

      const fullTitle = `${pageTitle} | ${villageName} ${districtName} - GoVillage`;

      setTitleData((prev) => {
        if (prev.title === fullTitle && prev.icon === icon) return prev;
        return { title: fullTitle, icon };
      });
    } else if (layout === 'dashboard') {
      const fullTitle = `Dashboard | ${villageName} - GoVillage`;
      setTitleData((prev) => {
        if (prev.title === fullTitle && prev.icon === icon) return prev;
        return { title: fullTitle, icon };
      });
    } else if (layout === 'auth') {
      const fullTitle = `Auth | ${villageName} - GoVillage`;
      setTitleData((prev) => {
        if (prev.title === fullTitle && prev.icon === icon) return prev;
        return { title: fullTitle, icon };
      });
    }
  }, [location.pathname, villageProfile, flatLandingLinks, layout]);

  useEffect(() => {
    document.title = titleData.title;

    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = titleData.icon;
  }, [titleData]);

  return null;
};

DynamicDocumentTitle.propTypes = {
  layout: PropTypes.string.isRequired
};

export default DynamicDocumentTitle;
