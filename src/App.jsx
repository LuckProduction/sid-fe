import { Result } from 'antd';
import { authLink, dashboardLink, landingLink } from './data/link';
import { useAuth, useService } from './hooks';
import { AuthLayout, DashboardLayout, LandingLayout } from './layouts';
import { createBrowserRouter } from 'react-router-dom';
import { RouterProvider } from 'react-router';
import './index.css';
import { ApbdItem, Beneficiary, CreateArticle, DetailResident, EditArticle, EditResident, FamilyDetail, InstitutionMember, Lettering, ProfileSettings } from './pages/dashboard';
import { flattenLandingLinks } from './utils/landingLink';
import { Browse, DetailNews, SubmitLetter, VillageBoundaries } from './pages/landing';
import { Notfound } from './pages/result';
import DetailVillagePotential from './pages/landing/DetailVillagePotential';
import { LandingService } from './services';
import { useEffect, useState } from 'react';

function App() {
  const { user } = useAuth();
  const flatLandingLinks = flattenLandingLinks(landingLink);
  const [titleData, setTitleData] = useState({ title: 'Loading...', icon: '' });

  const { execute: fetchVillageProfile, ...getAll } = useService(LandingService.getVillageProfile);

  useEffect(() => {
    fetchVillageProfile();
  }, [fetchVillageProfile]);

  const villageProfile = getAll.data ?? {};

  useEffect(() => {
    if (getAll.data) {
      setTitleData({
        title: 'GoVillage | ' + villageProfile.village_name || 'Default Title',
        icon: villageProfile.village_logo || '/vite.svg'
      });
    }
  }, [getAll.data, villageProfile.village_logo, villageProfile.village_name]);

  useEffect(() => {
    document.title = titleData.title;

    if (titleData.icon) {
      let link = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = titleData.icon;
    }
  }, [titleData]);

  return (
    <RouterProvider
      router={createBrowserRouter([
        {
          element: <LandingLayout />,
          children: [
            // Tambahkan route dari landingLink
            ...flatLandingLinks.map(({ path, element: Element }) => ({
              path,
              element: <Element />
            })),
            { path: '/article/detail/:slug', element: <DetailNews /> },
            { path: '/village_potential/detail/:slug', element: <DetailVillagePotential /> },
            { path: '/lettering/browse', element: <Browse /> },
            { path: '/lettering/submitletter', element: <SubmitLetter /> },
            { path: '/villageboundaries', element: <VillageBoundaries /> },
            { path: '*', element: <Notfound /> }
          ]
        },
        {
          element: <DashboardLayout />,
          children: [
            ...dashboardLink.flatMap(({ children }) =>
              children.map(({ permissions, roles, path, element: Element }) => {
                const hasPermissions = permissions && permissions.length > 0;
                const hasRoles = roles && roles.length > 0;
                const userCantDoAnyOfThat = hasPermissions && (!user || user.cantDoAny(...permissions));
                const userIsNotInAnyOfThatRole = hasRoles && (!user || !roles.some((role) => user.is(role)));

                if (userCantDoAnyOfThat && userIsNotInAnyOfThatRole) {
                  return {
                    path,
                    element: <Result status="403" subTitle="Anda tidak memiliki akses ke halaman ini" title="Forbidden" />
                  };
                }
                return {
                  path,
                  element: <Element />
                };
              })
            ),
            { path: '/dashboard/article/create', element: <CreateArticle /> },
            { path: '/dashboard/article/edit/:id', element: <EditArticle /> },
            { path: '/dashboard/residential/detail/:id', element: <DetailResident /> },
            { path: '/dashboard/residential/edit/:id', element: <EditResident /> },
            { path: '/dashboard/public_assistance/:id/beneficiary', element: <Beneficiary /> },
            { path: '/dashboard/apbd_report/:id/apbd-item', element: <ApbdItem /> },
            { path: '/dashboard/village_institutions/:id/institution_member', element: <InstitutionMember /> },
            { path: '/dashboard/correspondence/:id/lettering', element: <Lettering /> },
            { path: '/dashboard/profile-settings', element: <ProfileSettings /> },
            { path: '/dashboard/family/:id/detail', element: <FamilyDetail /> }
          ]
        },
        {
          element: <AuthLayout />,
          children: authLink.map(({ path, element: Element }) => ({
            path,
            element: <Element />
          }))
        }
      ])}
    />
  );
}

export default App;
