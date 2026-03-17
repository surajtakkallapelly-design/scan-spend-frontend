import React, { useEffect, useState } from 'react';
import { fetchExpenses, fetchMonthlyReport } from '../services/expenseService';
import ExpenseCard from '../components/ExpenseCard';
import ExpenseTable from '../components/ExpenseTable';
import { CategoryPie, SpendingLine } from '../components/ExpenseChart';
import ReminderPanel from '../components/ReminderPanel';
import { useToast } from '../components/ToastHost';
import BudgetPanel from '../components/BudgetPanel';
import { calcBudget } from '../utils/budget';

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [report, setReport] = useState({ total: 0, byCategory: {} });
  const [trend, setTrend] = useState([]);
  const [loading, setLoading] = useState(true);
  const defaultBudgets = {
    Food: 15000, Transport: 8000, Shopping: 12000, Bills: 10000, Entertainment: 8000, Utilities: 5000, Health: 7000, Travel: 12000, Other: 6000
  };
  const [budgets, setBudgets] = useState(() => {
    const stored = localStorage.getItem('budgets');
    return stored ? JSON.parse(stored) : defaultBudgets;
  });
  const toast = useToast();

  const load = async () => {
    try {
      setLoading(true);
      const data = await fetchExpenses();
      setExpenses(data);
      const month = new Date().toISOString().slice(0,7);
      const rep = await fetchMonthlyReport(month);
      setReport(rep);
      const points = buildTrend(data, month);
      setTrend(points);
    } catch {
      toast.add('Failed to load dashboard', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const total = report.total || 0;
  const recent = expenses.slice(-5).reverse();
  const { currentMonthTotal, prevMonthTotal, delta } = computeDelta(expenses);
  const budgetUsage = calcBudget(expenses, budgets, defaultBudgets);
  const fmt = (v) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(v || 0));
  const deltaPct = prevMonthTotal > 0 ? ((delta / prevMonthTotal) * 100) : 0;
  const deltaLabel = `Month over month: ${deltaPct >= 0 ? '+' : ''}${deltaPct.toFixed(1)}%`;

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <h1 className="hero-title">Dashboard</h1>
          <div className="badge">Live spend overview</div>
        </div>
      </div>
      {loading && <div className="card" style={{ marginTop: 12 }}>Loading...</div>}
      <div className="grid two">
        <ExpenseCard title="Total this month" value={total} sub="Based on OCR + manual adds" accent="#7cf3d6" />
        <ExpenseCard title="Month over month change" raw={deltaLabel} sub={`Change: ${fmt(delta)} vs previous ${fmt(prevMonthTotal)}`} accent="#38bdf8" />
        <div className="card"><CategoryPie data={report.byCategory} /></div>
      </div>
      <div className="card" style={{ marginTop: 16 }}>
        <h3>Daily spend trend</h3>
        <SpendingLine points={trend} />
      </div>
      <div className="card" style={{ marginTop: 16 }}>
        <h3>Budgets (this month)</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 10 }}>
          {Object.entries(budgetUsage).map(([cat, info]) => (
            <div key={cat} className="badge" style={{ padding: 10, background: 'rgba(255,255,255,0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                <span>{cat}</span>
                <span>{Math.round(info.percent)}%</span>
              </div>
              <div style={{ height: 6, background: 'rgba(0,0,0,0.15)', borderRadius: 99, marginTop: 6 }}>
                <div style={{ width: `${Math.min(100, info.percent)}%`, height: '100%', borderRadius: 99, background: info.percent > 100 ? '#f97316' : '#0ea5e9' }} />
              </div>
              <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>{fmt(info.spent)} / {fmt(info.budget)}</div>
            </div>
          ))}
        </div>
      </div>
      <BudgetPanel
        budgets={budgets}
        onChange={(b) => { setBudgets(b); localStorage.setItem('budgets', JSON.stringify(b)); }}
      />
      <div className="grid two" style={{ marginTop: 16 }}>
        <ExpenseTable expenses={recent} onEdit={() => {}} onDelete={() => {}} />
        <ReminderPanel />
      </div>
    </div>
  );
}

function buildTrend(expenses, month) {
  const map = {};
  expenses.filter(e => (e.date || '').startsWith(month)).forEach(e => {
    const key = e.date;
    map[key] = (map[key] || 0) + Number(e.amount || 0);
  });
  return Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, total]) => ({
      label: new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
      value: total
    }));
}

function computeDelta(expenses) {
  const now = new Date();
  const monthKey = now.toISOString().slice(0,7);
  const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().slice(0,7);
  const sumFor = (key) => expenses.filter(e => (e.date || '').startsWith(key)).reduce((s,e)=>s+Number(e.amount||0),0);
  const currentMonthTotal = sumFor(monthKey);
  const prevMonthTotal = sumFor(prev);
  const delta = currentMonthTotal - prevMonthTotal;
  return { currentMonthTotal, prevMonthTotal, delta };
}

// calcBudget now lives in utils/budget.js
