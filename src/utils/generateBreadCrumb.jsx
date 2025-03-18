import { dashboardLink } from '@/data/link';

const generateBreadCrumb = (pathname) => {
  const paths = pathname.split('/').filter(Boolean);
  let currentPath = '';
  const breadcrumbs = [];

  paths.forEach((segment, index) => {
    currentPath += `/${segment}`;

    let matched = null;
    dashboardLink.forEach((menu) => {
      const found = menu.children.find((child) => child.path === currentPath);
      if (found) {
        matched = { label: found.label, path: found.path };
      }
    });

    if (!matched && index === paths.length - 1) {
      matched = { label: segment.replace(/-/g, ' '), path: '' };
    }

    if (matched) {
      breadcrumbs.push(matched);
    }
  });

  return breadcrumbs;
};

export default generateBreadCrumb;
