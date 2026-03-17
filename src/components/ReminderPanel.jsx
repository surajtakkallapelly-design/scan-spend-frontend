import React, { useEffect, useMemo, useState } from 'react';
import { fetchReminders, addReminder, deleteReminder } from '../services/reminderService';
import { useToast } from './ToastHost';

const requestPermission = () => {
  if (typeof Notification === 'undefined') return Promise.resolve('denied');
  if (Notification.permission === 'granted') return Promise.resolve('granted');
  if (Notification.permission === 'denied') return Promise.resolve('denied');
  return Notification.requestPermission();
};

const notify = (title, body) => {
  if (typeof Notification === 'undefined') {
    alert(`${title}\n${body}`);
    return;
  }
  if (Notification.permission === 'granted') {
    new Notification(title, { body });
  } else {
    alert(`${title}\n${body}`);
  }
};

export default function ReminderPanel() {
  const [reminders, setReminders] = useState([]);
  const [form, setForm] = useState({ title: '', amount: '', dueDate: '' });
  const toast = useToast();

  useEffect(() => { requestPermission(); }, []);
  useEffect(() => {
    fetchReminders().then(setReminders).catch(() => toast.add('Could not load reminders', 'error'));
  }, []);

  const upcoming = useMemo(() => reminders
    .slice()
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)), [reminders]);

  const submit = (e) => {
    e.preventDefault();
    if (!form.title || !form.dueDate) return;
    const item = { title: form.title, amount: form.amount, dueDate: form.dueDate };
    addReminder(item).then((created) => {
      setReminders([...reminders, created]);
      toast.add('Reminder saved', 'success');
      setForm({ title: '', amount: '', dueDate: '' });
    }).catch(() => toast.add('Could not save reminder', 'error'));
  };

  const remove = (id) => {
    deleteReminder(id).then(() => {
      setReminders(reminders.filter(r => r.id !== id));
      toast.add('Reminder deleted', 'success');
    }).catch(() => toast.add('Delete failed', 'error'));
  };

  return (
    <div className="card">
      <h3>EMI reminders</h3>
      <form className="form" onSubmit={submit}>
        <input required placeholder="Title (e.g., Car EMI)" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
        <input type="number" placeholder="Amount" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />
        <input required type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} />
        <button type="submit">Save reminder</button>
      </form>
      <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {upcoming.length === 0 && <div style={{ color: '#94a3b8' }}>No reminders yet</div>}
        {upcoming.map(r => (
          <div key={r.id} style={{ padding: 10, border: '1px solid #1f2937', borderRadius: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 600 }}>{r.title}</div>
              <div style={{ color: '#94a3b8', fontSize: 12 }}>Due {r.dueDate} · ₹{r.amount || 0}</div>
            </div>
            <button onClick={() => remove(r.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
