import axios from 'axios';

const api = axios.create({
  baseURL: typeof window === 'undefined' 
    ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api` 
    : '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

if (typeof window !== 'undefined') {
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error.response?.status;
      const reqPath = error.config?.url || '';
      const isAdminRequest = reqPath.includes('/admin/');
      const isLoginRequest = reqPath.includes('/admin/login');
      if (status === 401 && isAdminRequest && !isLoginRequest) {
        const path = window.location.pathname;
        if (path.startsWith('/admin') && !path.startsWith('/admin/login')) {
          window.location.assign('/admin/login');
        }
      }
      return Promise.reject(error);
    }
  );
}

export default api;
