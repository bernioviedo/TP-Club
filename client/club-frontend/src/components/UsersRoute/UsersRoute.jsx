import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { ContextUser } from '../../../context/contextUser';

export default function UsersRoute({ children }) {
  const { user } = useContext(ContextUser);

  if (user === undefined) return null;
  if (user !== null ) return <Navigate to="/" replace />;

  return children;
}