import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useService } from '@/hooks';
import { LandingService } from '@/services';
import PropTypes from 'prop-types';
import { landingLink } from '@/data/link';

const flattenLandingLinks = (links) => {
  let flat = [];
  links.forEach((link) => {
    if (link.children) {
      flat = flat.concat(flattenLandingLinks(link.children));
    } else {
      flat.push(link);
    }
  });
  return flat;
};

const findLabelByPath = (links, path) => {
  const flatLinks = flattenLandingLinks(links);
  const matched = flatLinks.find((link) => path === link.key || path.startsWith(link.key + '/'));
  return matched ? matched.label : null;
};

const DynamicDocumentTitle = ({ layout }) => {
  const location = useLocation();

  const { data: villageProfile, execute: fetchVillageProfile } = useService(LandingService.getVillageProfile);

  const [titleData, setTitleData] = useState({
    title: 'Loading...',
    icon: '/vite.svg'
  });

  useEffect(() => {
    fetchVillageProfile();
  }, [fetchVillageProfile]);

  useEffect(() => {
    const icon = villageProfile?.village_logo || '/vite.svg';
    const villageName = villageProfile?.village_name || 'GoVillage';
    const districtName = villageProfile?.district_profile?.district_name || '';

    let pageTitle = 'Beranda';

    if (layout === 'landing') {
      if (location.pathname.startsWith('/dashboard')) {
        pageTitle = 'Dashboard';
      } else {
        const labelFromLandingLink = findLabelByPath(landingLink, location.pathname);
        pageTitle = labelFromLandingLink || 'Beranda';
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
  }, [location.pathname, villageProfile, layout]);

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
