import api from './axios';

export const authApi = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (data) => api.post('/auth/register', data),
    me: () => api.get('/auth/me'),
    forgotPassword: (data) => api.post('/auth/forgot-password', data),
    resetPassword: (token, data) => api.post(`/auth/reset-password/${token}`, data),
};
