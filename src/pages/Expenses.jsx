import React, { useEffect, useState } from 'react';
import { fetchExpenses, createExpense, updateExpense, deleteExpense } from '../services/expenseService';
import ExpenseTable from '../components/ExpenseTable';
import { useToast } from '../components/ToastHost';
import { addReminder } from '../services/reminderService';
import { exportToCsv } from '../utils/csv';
import FilterBar from '../components/FilterBar';
import ReceiptDrawer from '../components/ReceiptDrawer';

const today = () => new Date().toISOString().slice(0, 10);

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [form, setForm] = useState({ merchant: '', amount: '', category: '', date: today() });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ search: '', category: '', from: '', to: '' });
  const [drawer, setDrawer] = useState(null);
  const toast = useToast();

  const applyFilters = (list, f) => {
    return list.filter((e) => {
      if (f.search && !e.merchant.toLowerCase().includes(f.search.toLowerCase())) return false;
      if (f.category && !e.category.toLowerCase().includes(f.category.toLowerCase())) return false;
      if (f.from && e.date < f.from) return false;
      if (f.to && e.date > f.to) return false;
      return true;
    });
  };

  const load = async () => {
    const data = await fetchExpenses();
    setExpenses(data);
    setFiltered(applyFilters(data, filters));
  };
  useEffect(() => { load(); }, []);
  useEffect(() => { setFiltered(applyFilters(expenses, filters)); }, [filters, expenses]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await updateExpense(editingId, form);
        toast.add('Expense updated', 'success');
      } else {
        await createExpense(form);
        toast.add('Expense added', 'success');
      }
      setForm({ merchant: '', amount: '', category: '', date: today() });
      setEditingId(null);
      load();
    } catch (err) {
      toast.add('Save failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const doExport = () => {
    if (!filtered.length) {
      toast.add('No expenses to export', 'error');
      return;
    }
    exportToCsv('expenses.csv', filtered);
    toast.add('CSV exported', 'success');
  };

  const onEdit = (exp) => {
    setEditingId(exp.id);
    setForm({ merchant: exp.merchant, amount: exp.amount, category: exp.category, date: exp.date });
  };

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <h1 className="hero-title">Expenses</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={doExport}>Export CSV</button>
        </div>
      </div>

      <FilterBar
        filters={filters}
        onChange={setFilters}
        onClear={() => setFilters({ search: '', category: '', from: '', to: '' })}
      />

      <div className="card" style={{ marginBottom: 16 }}>
        <form className="form" onSubmit={submit}>
          <input placeholder="Merchant" value={form.merchant} onChange={e => setForm({ ...form, merchant: e.target.value })} />
          <input placeholder="Amount" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />
          <input placeholder="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
          <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
          <button disabled={loading} type="submit">{loading ? 'Saving...' : editingId ? 'Update' : 'Add'} Expense</button>
        </form>
      </div>
      <ExpenseTable
        expenses={filtered}
        onEdit={onEdit}
        onDelete={async (id) => { await deleteExpense(id); toast.add('Deleted', 'success'); load(); }}
        onRemind={(exp) => {
          addReminder({ title: `EMI: ${exp.merchant}`, amount: exp.amount, dueDate: exp.date, notified: false });
          toast.add('Reminder set for this expense', 'success');
        }}
        onView={setDrawer}
      />

      <ReceiptDrawer expense={drawer} onClose={() => setDrawer(null)} onSaved={() => { setDrawer(null); load(); }} />
    </div>
  );
}
