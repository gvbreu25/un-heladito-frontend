import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionError, setSessionError] = useState('');

  async function restoreSession(signal) {
    setLoading(true);
    setSessionError('');
    try {
      const profile = await api('/auth/me', { signal });
      if (!signal?.aborted) setUser(profile);
    } catch (error) {
      if (signal?.aborted) return;
      setUser(null);
      if (error.status !== 401) setSessionError(error.message);
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }

  useEffect(() => {
    // Las credenciales y pedidos simulados de la EA2 nunca se importan.
    try {
      localStorage.removeItem('unheladito_users');
      sessionStorage.removeItem('unheladito_session');
    } catch {
      // En modo privado el navegador puede restringir el almacenamiento.
    }
    const controller = new AbortController();
    restoreSession(controller.signal);
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!user) return;
    const controller = new AbortController();
    const interval = window.setInterval(() => {
      api('/auth/renovar', { method: 'POST', signal: controller.signal })
        .catch((error) => {
          if (!controller.signal.aborted && error.status === 401) setUser(null);
        });
    }, 10 * 60 * 1000);
    return () => {
      window.clearInterval(interval);
      controller.abort();
    };
  }, [user]);

  async function authenticate(path, body) {
    try {
      const profile = await api(path, { method: 'POST', body });
      setUser(profile);
      setSessionError('');
      return { ok: true, user: profile };
    } catch (error) {
      return { ok: false, message: error.message };
    }
  }

  const login = (email, password) => authenticate('/auth/login', { email: email.trim(), password });
  const register = ({ name, email, password }) =>
    authenticate('/auth/registro', { name: name.trim(), email: email.trim(), password });

  async function logout() {
    try {
      await api('/auth/logout', { method: 'POST' });
    } catch (error) {
      if (error.status !== 401) {
        setSessionError('No se pudo cerrar la sesión. Inténtalo nuevamente.');
        return;
      }
    }
    setSessionError('');
    setUser(null);
  }

  return <AuthContext.Provider value={{ user, loading, sessionError, login, register, logout,
    restoreSession: () => restoreSession() }}>
    {children}
  </AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider.');
  return context;
}
