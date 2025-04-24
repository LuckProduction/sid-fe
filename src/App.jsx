import { Result } from 'antd';
import { authLink, dashboardLink, kioskLink, landingLink } from './data/link';
import { useAuth, useService } from './hooks';
import { AuthLayout, DashboardLayout, KioskLayout, LandingLayout } from './layouts';
import { createBrowserRouter } from 'react-router-dom';
import { RouterProvider } from 'react-router';
import './index.css';
import { ApbdItem, Beneficiary, CreateArticle, DetailCitizenReport as DetailCitizenReportDashboard, DetailResident, EditArticle, EditResident, FamilyDetail, InstitutionMember, Lettering, ProfileSettings, ReportAttribute } from './pages/dashboard';
import { flattenLandingLinks } from './utils/landingLink';
import { BrowseLetter, DetailCitizenReport as DetailCitizenReportLanding, DetailNews, DetailVillageEnterprise, SubmitLetter, VillageBoundaries } from './pages/landing';
import { Notfound, PrivacyPolicy } from './pages/result';
import DetailVillagePotential from './pages/landing/DetailVillagePotential';
import { LandingService } from './services';
import { useEffect, useState } from 'react';
import { ProtectedRoute, ScrollToTop } from './components';
import PublicTax from './pages/dashboard/publicTax/PublicTax';
import { Home } from './pages/kiosk';

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
          element: (
            <>
              <KioskLayout />
            </>
          ),
          children: [
            ...kioskLink.map(({ path, element: Element }) => ({
              path,
              element: (
                <ProtectedRoute>
                  <Element />
                </ProtectedRoute>
              )
            })),
            { path: '/kiosk', element: <Home /> }
          ]
        },
        {
          element: (
            <>
              <LandingLayout />
              <ScrollToTop />
            </>
          ),
          children: [
            ...flatLandingLinks.map(({ path, element: Element }) => ({
              path,
              element: <Element />
            })),
            { path: '/news/detail/:slug', element: <DetailNews /> },
            { path: '/village_enterprises/detail/:slug', element: <DetailVillageEnterprise /> },
            { path: '/village_potentials/detail/:slug', element: <DetailVillagePotential /> },
            { path: '/citizen_reports/detail/:slug', element: <DetailCitizenReportLanding /> },
            { path: '/letterings/browse', element: <BrowseLetter /> },
            { path: '/letterings/submitletter', element: <SubmitLetter /> },
            { path: '/villageboundaries', element: <VillageBoundaries /> },
            { path: '/privacy_policy', element: <PrivacyPolicy /> },
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
            { path: '/dashboard/public_assistance/beneficiary/:id', element: <Beneficiary /> },
            { path: '/dashboard/apbd_report/apbd-item/:id', element: <ApbdItem /> },
            { path: '/dashboard/village_institutions/institution_member/:id', element: <InstitutionMember /> },
            { path: '/dashboard/correspondence/lettering/:id', element: <Lettering /> },
            { path: '/dashboard/profile-settings', element: <ProfileSettings /> },
            { path: '/dashboard/family/detail/:id', element: <FamilyDetail /> },
            { path: '/dashboard/citizen_report/detail/:id', element: <DetailCitizenReportDashboard /> },
            { path: '/dashboard/tax_period/public_tax/:id', element: <PublicTax /> },
            { path: '/dashboard/village_report/report_attribute/:id', element: <ReportAttribute /> }
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
