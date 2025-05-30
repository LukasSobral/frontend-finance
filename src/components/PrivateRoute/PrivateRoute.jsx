import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from '../Loader/Loader';

export default function PrivateRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  return user ? <Outlet /> : <Navigate to="/" />;
}
