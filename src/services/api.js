import axios from 'axios';

export const API_BASE = import.meta?.env?.VITE_API_BASE || 'http://localhost:8080/api';
export const API_HOST = API_BASE.replace(/\/api$/, '');

const api = axios.create({
  baseURL: API_BASE
});

// Attach token immediately on instance (in case interceptors haven't run yet)
const stored = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
if (stored) {
  api.defaults.headers.common.Authorization = `Bearer ${stored}`;
}

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      if (typeof localStorage !== 'undefined') {
        localStorage.clear();
      }
      // Force re-login to refresh token; avoids stuck 401 loops
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export default api;
