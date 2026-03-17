import { useEffect, useState, createContext, useContext } from 'react';
import api from './api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const auth = useProvideAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);

function useProvideAuth() {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    const name = localStorage.getItem('name');
    const income = localStorage.getItem('income');
    return token ? { token, email, name, income } : null;
  });

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    setUser(res.data);
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('email', res.data.email);
    localStorage.setItem('name', res.data.name);
    if (res.data.income !== undefined) localStorage.setItem('income', res.data.income);
  };

  const register = async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password });
    setUser(res.data);
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('email', res.data.email);
    localStorage.setItem('name', res.data.name);
    if (res.data.income !== undefined) localStorage.setItem('income', res.data.income);
  };

  const logout = () => {
    setUser(null);
    localStorage.clear();
  };

  const setUserFromProfile = (res) => {
    setUser(res);
    localStorage.setItem('token', res.token);
    localStorage.setItem('email', res.email);
    localStorage.setItem('name', res.name);
    if (res.income !== undefined) localStorage.setItem('income', res.income);
  };

  useEffect(() => {
    const interceptor = api.interceptors.request.use((config) => {
      if (user?.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
      return config;
    });
    return () => api.interceptors.request.eject(interceptor);
  }, [user]);

  return { user, login, register, logout, setUserFromProfile };
}
