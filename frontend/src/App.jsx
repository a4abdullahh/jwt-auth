import { Route, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Loader from './components/Loader';
import PrivateRoute from './components/PrivateRoute';
import Settings from './pages/Settings';

// Lazy load components
const Profile = lazy(() => import('./pages/Profile'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const VerifyEmail = lazy(() => import('./pages/VerifyEmail'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));

function App() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* Public Routes */}
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/verify/email/:code' element={<VerifyEmail />} />
        <Route path='/password/forgot' element={<ForgotPassword />} />
        <Route path='/password/reset' element={<ResetPassword />} />

        {/* Private Routes */}
        <Route path='/' element={<PrivateRoute />}>
          <Route index element={<Profile />} />
          <Route path='/settings' element={<Settings />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
