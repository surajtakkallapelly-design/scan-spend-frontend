import api from './api';

export const fetchReminders = () => api.get('/reminders').then(r => r.data);
export const addReminder = (payload) => api.post('/reminders', payload).then(r => r.data);
export const deleteReminder = (id) => api.delete(`/reminders/${id}`);
