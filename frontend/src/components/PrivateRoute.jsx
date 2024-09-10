import { Navigate, Outlet } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import Loader from './Loader';
import UserMenu from './UserMenu';
import useAuth from '../hooks/useAuth';

const PrivateRoute = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Loader />;
  }

  if (!user) {
    return (
      <Navigate
        to='/login'
        replace
        state={{
          redirectUrl: window.location.pathname,
        }}
      />
    );
  }

  return (
    <Box p={4} minH='100vh'>
      <UserMenu />
      <div style={{ marginTop: '5rem' }}>
        <Outlet />
      </div>
    </Box>
  );
};

export default PrivateRoute;
