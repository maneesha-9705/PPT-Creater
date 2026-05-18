import axios from 'axios';

const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_URL = isLocalhost ? 'http://localhost:5000/api' : 'https://ppt-creater-2.onrender.com/api';

let baseURL = import.meta.env.VITE_API_URL || API_URL;
if (baseURL && baseURL.endsWith('/')) {
  baseURL = baseURL.slice(0, -1);
}
if (baseURL && !baseURL.endsWith('/api')) {
  baseURL += '/api';
}

const api = axios.create({
  baseURL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('pitchcraft_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('pitchcraft_token');
      localStorage.removeItem('pitchcraft_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
