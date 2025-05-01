import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useKioskAuth } from '@/context/KiosAuth';

const ProtectedRoute = ({ children }) => {
  const { user } = useKioskAuth();

  if (!user) {
    return <Navigate to="/kiosk" replace />;
  }

  return children;
};

export default ProtectedRoute;

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired
};
