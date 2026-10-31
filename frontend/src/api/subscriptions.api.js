import api from './axios';

export const subscriptionsApi = {
    getAll: (params) => api.get('/subscriptions', { params }),
    getById: (id) => api.get(`/subscriptions/${id}`),
    create: (data) => api.post('/subscriptions', data),
    createFromTemplate: (templateId, data) => api.post(`/subscriptions/from-template/${templateId}`, data),
    update: (id, data) => api.put(`/subscriptions/${id}`, data),
    changeStatus: (id, status) => api.patch(`/subscriptions/${id}/status`, { status }),
};
