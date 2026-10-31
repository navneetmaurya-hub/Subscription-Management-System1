import api from './axios';

export const templatesApi = {
    getAll: (params) => api.get('/quotation-templates', { params }),
    getById: (id) => api.get(`/quotation-templates/${id}`),
    create: (data) => api.post('/quotation-templates', data),
    update: (id, data) => api.put(`/quotation-templates/${id}`, data),
    delete: (id) => api.delete(`/quotation-templates/${id}`),
};

