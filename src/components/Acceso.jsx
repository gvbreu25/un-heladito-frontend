import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export function RutaProtegida({ roles }) {
  const { user, loading, sessionError, restoreSession } = useAuth();
  const location = useLocation();
  if (loading) return <main className="container section-space" role="status">Verificando sesión…</main>;
  if (sessionError && !user) return <main className="container section-space">
    <p role="alert">{sessionError}</p>
    <button className="btn btn-primary" onClick={restoreSession}>Volver a verificar</button>
  </main>;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (!roles.includes(user.role)) return <Navigate to={user.role === 'VENDEDOR' ? '/gestion' : '/'} replace />;
  return <Outlet />;
}

export function Tienda() {
  const { user } = useAuth();
  return user?.role === 'VENDEDOR' ? <Navigate to="/gestion" replace /> : <Outlet />;
}
