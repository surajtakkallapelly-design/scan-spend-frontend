import api from './api';

export const fetchExpenses = () => api.get('/expenses').then(r => r.data);
const normalize = (p) => ({
  ...p,
  amount: p.amount !== undefined ? Number(p.amount) : p.amount
});

export const createExpense = (payload) => api.post('/expenses', normalize(payload)).then(r => r.data);
export const updateExpense = (id, payload) => api.put(`/expenses/${id}`, normalize(payload)).then(r => r.data);
export const deleteExpense = (id) => api.delete(`/expenses/${id}`);
export const uploadReceipt = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/receipts/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data);
};
export const fetchMonthlyReport = (month) => api.get('/reports/monthly', { params: { month } }).then(r => r.data);
