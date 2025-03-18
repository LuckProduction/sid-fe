import { DashboardFooter, DashboardSider } from '@/components';
import { useAuth } from '@/hooks';
import generateBreadCrumb from '@/utils/generateBreadCrumb';
import { LogoutOutlined, MenuOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Breadcrumb, Button, Dropdown, Layout, Skeleton, Space, theme } from 'antd';
import { Content, Header } from 'antd/es/layout/layout';
import { useEffect, useMemo, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { logout, token, user } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (token) return;
    navigate(`/auth/login?redirect=${pathname}`);
  }, [navigate, token, pathname]);

  const breadcrumbs = generateBreadCrumb(location.pathname);

  const items = useMemo(
    () => [
      {
        key: '1',
        label: (
          <button onClick={() => navigate('/dashboard/profile-settings')} className="flex min-w-32 items-center gap-x-2">
            <UserOutlined />
            Pengaturan Profil
          </button>
        )
      },
      {
        key: '2',
        label: (
          <button onClick={logout} className="text-color-danger-500 flex min-w-32 items-center gap-x-2">
            <LogoutOutlined />
            Logout
          </button>
        )
      }
    ],
    [logout, navigate]
  );

  const {
    token: { colorBgContainer }
  } = theme.useToken();

  return (
    <Layout className="min-h-screen font-sans">
      <DashboardSider collapsed={collapsed} onCloseMenu={() => setCollapsed(true)} />
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer
          }}
        >
          <div className="flex h-full w-full items-center justify-between px-4">
            <Button type="text" icon={<MenuOutlined />} onClick={() => setCollapsed(!collapsed)} color="default"></Button>
            <div className="flex items-center gap-x-2">
              {!user ? (
                <>
                  <Skeleton.Button active className="leading-4" size="small" />
                  <Skeleton.Avatar active className="leading-4" />
                </>
              ) : (
                <>
                  <span>Hai, {user.name}</span>

                  <Dropdown menu={{ items }}>
                    <a onClick={(e) => e.preventDefault()}>
                      <Space>
                        <Avatar className="bg-color-primary-100 text-color-primary-500 font-semibold">U</Avatar>
                      </Space>
                    </a>
                  </Dropdown>
                </>
              )}
            </div>
          </div>
        </Header>

        <Content style={{ margin: '24px 16px 0' }}>
          <Breadcrumb className="mb-4 ms-2">
            {breadcrumbs.map((breadcrumb, index) => (
              <Breadcrumb.Item key={breadcrumb.path}>{index === breadcrumbs.length - 1 ? <span>{breadcrumb.label}</span> : <Link to={breadcrumb.path}>{breadcrumb.label}</Link>}</Breadcrumb.Item>
            ))}
          </Breadcrumb>

          <Outlet />
        </Content>

        <DashboardFooter />
      </Layout>
    </Layout>
  );
};

export default Dashboard;
