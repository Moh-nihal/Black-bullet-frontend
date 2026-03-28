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

export default api;
