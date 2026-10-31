import api from './axios';

export const paymentsApi = {
    getAll: (params) => api.get('/payments', { params }),
    record: (data) => api.post('/payments', data),
};

