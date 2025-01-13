import { dashboardLink } from '@/data/link';
import { useAuth } from '@/hooks';
import { Drawer, Menu } from 'antd';
import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';

const Sider = ({ collapsed, onCloseMenu }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user } = useAuth();

  return (
    <Drawer styles={{ body: { padding: 10 } }} placement="left" width={250} open={!collapsed} onClose={onCloseMenu}>
      <Menu
        className="w-full !border-none font-semibold"
        theme="light"
        mode="inline"
        defaultSelectedKeys={[pathname]}
        items={dashboardLink
          .filter(({ permissions, roles }) => {
            if (!user) return false;

            const hasPermission = permissions && permissions.length > 0;
            const hasRole = roles && roles.length > 0;

            const isPublicPage = !hasPermission && !hasRole;
            if (isPublicPage) return true;

            const roleSpecific = hasRole && !hasPermission;
            if (roleSpecific) return user.eitherIs(...roles);

            const permissionSpecific = hasPermission && !hasRole;
            if (permissionSpecific) return user.eitherCan(...permissions);

            return user.eitherCan(...permissions) && user.eitherIs(...roles);
          })
          .map(({ label, children }) => ({
            key: label,
            label,
            type: 'group',
            children: children
              .filter(({ permissions, roles }) => {
                const hasPermission = !permissions || user?.eitherCan(...permissions);
                const hasRole = !roles || user?.eitherIs(...roles);
                return hasPermission && hasRole;
              })
              .map(({ path, label, icon: Icon }) => ({
                key: path,
                icon: <Icon />,
                label,
                onClick: () => navigate(path)
              }))
          }))}
      />
    </Drawer>
  );
};

export default Sider;

Sider.propTypes = {
  collapsed: PropTypes.bool.isRequired,
  onCloseMenu: PropTypes.func.isRequired
};
