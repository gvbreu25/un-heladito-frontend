import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Alert from '../components/Alert.jsx';

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const destination = (role) => role === 'ADMINISTRADOR' || role === 'VENDEDOR'
    ? '/gestion' : (location.state?.from || '/mi-cuenta');
  if (user) return <Navigate to={destination(user.role)} replace />;
  const submit = async (event) => {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) { setError('Ingresa un correo válido.'); return; }
    if (sending) return;
    setSending(true);
    setError('');
    const result = await login(form.email.trim(), form.password);
    setSending(false);
    if (!result.ok) { setError(result.message); return; }
    navigate(destination(result.user.role), { replace: true });
  };
  return <main className="auth-page"><section className="auth-card"><div className="auth-icon">🍦</div><span className="eyebrow">QUÉ BUENO TENERTE DE VUELTA</span><h1>Iniciar sesión</h1><p>Entra para continuar disfrutando tus sabores favoritos.</p><Alert message={error} type="danger" onClose={() => setError('')} /><form onSubmit={submit} className="form-stack"><div className="form-group"><label htmlFor="email">Correo electrónico</label><input id="email" name="email" type="email" className="form-control" required autoComplete="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></div><div className="form-group"><label htmlFor="password">Contraseña</label><input id="password" name="password" type="password" className="form-control" required autoComplete="current-password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /></div><button type="submit" className="btn btn-primary btn-lg w-100" disabled={sending}>{sending ? 'Ingresando…' : 'Ingresar'}</button></form><p className="auth-switch">¿Aún no tienes cuenta? <Link to="/registro">Crear cuenta</Link></p></section></main>;
}
