import axios from 'axios';

const api = axios.create({
  baseURL: 'https://healthdiaryonline.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add the JWT token to the request headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
