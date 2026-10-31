import api from './axios';

export const usersApi = {
    getAll: (params) => api.get('/users', { params }),
    createStaff: (data) => api.post('/users/staff', data),
    setActive: (id, isActive) => api.patch(`/users/${id}/active`, { isActive }),
};
