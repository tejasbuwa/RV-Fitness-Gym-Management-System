import axios from 'axios';
import { getMockResponse } from './mockFallback';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('rv_fitness_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle fallback & common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response ? error.response.status : null;
    const url = error.config ? (error.config.url || '') : '';

    // Handle 401 unauthorized
    if (status === 401) {
      if (!url.includes('/login') && !url.includes('/health')) {
        localStorage.removeItem('rv_fitness_token');
        localStorage.removeItem('rv_fitness_user');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login?expired=1';
        }
      }
    }

    // Static host fallback: catch 404, 405 (method not allowed on static files),
    // 502/503/504 (gateway error), or Network Error (no server on Vercel)
    const isStaticDeployError =
      status === 404 ||
      status === 405 ||
      status === 502 ||
      status === 503 ||
      status === 504 ||
      !error.response;

    if (isStaticDeployError && error.config) {
      const mockResult = getMockResponse(error.config);
      if (mockResult) {
        if (mockResult.success === false) {
          const customError = new Error(mockResult.message || 'Request failed');
          customError.response = {
            data: mockResult,
            status: 400,
            statusText: 'Bad Request',
            headers: {},
            config: error.config
          };
          return Promise.reject(customError);
        }

        return Promise.resolve({
          data: mockResult,
          status: 200,
          statusText: 'OK',
          headers: { 'content-type': 'application/json' },
          config: error.config
        });
      }
    }

    return Promise.reject(error);
  }
);

export default api;
