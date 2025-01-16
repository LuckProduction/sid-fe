import { Result, Skeleton } from 'antd';
import { authLink, dashboardLink, landingLink } from './data/link';
import { useAuth } from './hooks';
import { AuthLayout, DashboardLayout, LandingLayout } from './layouts';
import { createBrowserRouter } from 'react-router-dom';
import { RouterProvider } from 'react-router';
import './index.css';
import { CreateArticle, EditArticle } from './pages/dashboard';

function App() {
  const { isLoading, user } = useAuth();

  return (
    <RouterProvider
      router={createBrowserRouter([
        {
          element: <LandingLayout />,
          children: [
            ...landingLink.map(({ path, element: Element }) => ({
              path,
              element: <Element />
            }))
          ]
        },
        {
          element: <DashboardLayout />,
          children: [
            ...dashboardLink.flatMap(({ children }) =>
              children.map(({ permissions, roles, path, element: Element }) => {
                if (isLoading) {
                  return {
                    path,
                    // TODO: Sekeleton 💀
                    element: <Skeleton active />
                  };
                }

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
            { path: '/article/create', element: <CreateArticle /> },
            { path: '/article/edit/:id', element: <EditArticle /> }
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
