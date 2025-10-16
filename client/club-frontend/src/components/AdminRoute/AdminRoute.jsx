import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { ContextUser } from '../../../context/contextUser';

export default function AdminRoute({ children, role = 'superadmin' }) {
  const { user } = useContext(ContextUser);

  if (user === undefined) return null;
  if (user === null ) return <Navigate to="/login" replace />;
  if (user.userType !== role) return <Navigate to="/" replace />;

  return children;
}