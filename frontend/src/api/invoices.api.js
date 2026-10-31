import api from './axios';

export const invoicesApi = {
    getAll: (params) => api.get('/invoices', { params }),
    getById: (id) => api.get(`/invoices/${id}`),
    generate: (subscriptionId) => api.post(`/invoices/generate/${subscriptionId}`),
    runBilling: () => api.post('/invoices/run-billing'),
    changeStatus: (id, status) => api.patch(`/invoices/${id}/status`, { status }),
    send: (id) => api.post(`/invoices/${id}/send`),
};
