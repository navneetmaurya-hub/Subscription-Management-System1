import api from './axios';

export const taxesApi = {
    getAll: (params) => api.get('/taxes', { params }),
    getById: (id) => api.get(`/taxes/${id}`),
    create: (data) => api.post('/taxes', data),
    update: (id, data) => api.put(`/taxes/${id}`, data),
    delete: (id) => api.delete(`/taxes/${id}`),
};
