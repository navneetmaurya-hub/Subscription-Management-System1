import api from './axios';

export const reportsApi = {
    getSummary: (params) => api.get('/reports/summary', { params }),
};
