import { DashboardFooter, DashboardSider, Inbox } from '@/components';
import { useAuth, useService } from '@/hooks';
import { InboxService } from '@/services';
import generateBreadCrumb from '@/utils/generateBreadCrumb';
import { BellOutlined, LogoutOutlined, MenuOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Badge, Breadcrumb, Button, Dropdown, Grid, Layout, Popover, Skeleton, Space, theme } from 'antd';
import { Content, Header } from 'antd/es/layout/layout';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { logout, token, user } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { execute, ...getAllInbox } = useService(InboxService.getAll);
  const readInbox = useService(InboxService.read);
  const breakpoints = Grid.useBreakpoint();

  const fetchInbox = useCallback(() => {
    execute({
      token: token
    });
  }, [execute, token]);

  useEffect(() => {
    fetchInbox();
  }, [fetchInbox]);

  useEffect(() => {
    if (token) return;
    navigate(`/auth/login?redirect=${pathname}`);
  }, [navigate, token, pathname]);

  const breadcrumbs = generateBreadCrumb(location.pathname);
  const inbox = getAllInbox.data ?? [];

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

  const isDesktop = breakpoints.lg || breakpoints.xl || breakpoints.xxl;

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
              <Popover className="max-w-sm" trigger="click" placement={isDesktop ? 'bottomLeft' : 'bottom'} content={<Inbox inbox={inbox} token={token} fetchInbox={fetchInbox} />}>
                <Button
                  onClick={async () => {
                    await readInbox.execute({}, token);
                    fetchInbox();
                  }}
                  icon={
                    <Badge count={inbox.filter((item) => item.read_at === null).length} size="small">
                      <BellOutlined />
                    </Badge>
                  }
                  type="text"
                  color="default"
                />
              </Popover>
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
