import React, { useState, useEffect } from 'react';
import { API_HOST } from '../services/api';
import { updateExpense } from '../services/expenseService';
import { useToast } from './ToastHost';

export default function ReceiptDrawer({ expense, onClose, onSaved }) {
  const toast = useToast();
  const [form, setForm] = useState(null);

  useEffect(() => {
    if (expense) setForm({ merchant: expense.merchant, amount: expense.amount, category: expense.category, date: expense.date });
  }, [expense]);

  if (!expense || !form) return null;
  const img = expense.receiptImage ? (expense.receiptImage.startsWith('http') ? expense.receiptImage : `${API_HOST}${expense.receiptImage}`) : null;

  const save = async () => {
    await updateExpense(expense.id, form);
    toast.add('Expense updated', 'success');
    onSaved();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999, display: 'grid', placeItems: 'center', padding: 16 }} onClick={onClose}>
      <div className="card" style={{ width: 'min(90vw, 960px)', maxHeight: '90vh', overflow: 'auto' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3>Receipt</h3>
          <button onClick={onClose}>Close</button>
        </div>
        {img && <img src={img} alt="receipt" style={{ maxWidth: '100%', borderRadius: 12, marginBottom: 12 }} />}
        <div className="form" style={{ display: 'grid', gap: 8 }}>
          <input value={form.merchant} onChange={e => setForm({ ...form, merchant: e.target.value })} />
          <input value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />
          <input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
          <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
          <button onClick={save}>Save changes</button>
        </div>
      </div>
    </div>
  );
}
