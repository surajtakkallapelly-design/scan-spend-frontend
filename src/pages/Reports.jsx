import React, { useEffect, useMemo, useState } from 'react';
import { fetchMonthlyReport, fetchExpenses } from '../services/expenseService';
import { CategoryPie } from '../components/ExpenseChart';

export default function Reports() {
  const [month, setMonth] = useState(() => new Date().toISOString().slice(0,7));
  const [report, setReport] = useState({ total: 0, byCategory: {} });
  const [expenses, setExpenses] = useState([]);
  const [trendRange, setTrendRange] = useState('weekly');

  const load = async () => {
    const data = await fetchMonthlyReport(month);
    setReport(data);
  };
  const loadExpenses = async () => {
    const rows = await fetchExpenses();
    setExpenses(rows);
  };

  useEffect(() => { load(); }, [month]);
  useEffect(() => { loadExpenses(); }, []);

  const entries = Object.entries(report.byCategory || {});
  const top = entries.reduce((acc, [k,v]) => v > (acc?.[1] ?? 0) ? [k,v] : acc, null);
  const totalFmt = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(Number(report.total || 0));

  const trend = useMemo(() => {
    if (!expenses.length) return { total: 0, avg: 0, days: 0 };
    const today = new Date();
    const start = new Date(today);
    if (trendRange === 'weekly') start.setDate(today.getDate() - 6);
    else if (trendRange === 'monthly') start.setDate(today.getDate() - 29);
    else if (trendRange === 'yearly') start.setDate(today.getDate() - 364);
    else start.setTime(Math.min(...expenses.map(e => new Date(e.date))));

    const filtered = expenses.filter(e => new Date(e.date) >= start);
    const total = filtered.reduce((s,e) => s + Number(e.amount || 0), 0);
    const days = Math.max(1, Math.round((today - start) / (1000*60*60*24)) + 1);
    const dailyAvg = total / days;
    return { total, avg: dailyAvg, days, count: filtered.length };
  }, [expenses, trendRange]);

  const fmt = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(n||0));

  return (
    <div style={{ padding: 24 }}>
      <h1 className="hero-title">Reports</h1>
      <div className="card" style={{ marginBottom: 12 }}>
        <label>Month</label>
        <input type="month" value={month} onChange={e => setMonth(e.target.value)} />
        <button onClick={load}>Refresh</button>
      </div>
      <div className="grid two">
        <div className="card" style={{ display: 'grid', gap: 8 }}>
          <div style={{ fontSize: 20, fontWeight: 600 }}>Total: {totalFmt}</div>
          <div style={{ color: '#9aa5b5' }}>
            Month: {month} • Categories: {entries.length || 0}
          </div>
          {top && (
            <div className="badge">
              Top category: {top[0]} ({new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(top[1] || 0))})
            </div>
          )}
          {!top && <div className="badge">No data for this month</div>}
        </div>
        <div className="card">
          <CategoryPie data={report.byCategory} />
        </div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <h3 style={{ margin: 0 }}>Daily Trend</h3>
          <select value={trendRange} onChange={e => setTrendRange(e.target.value)}>
            <option value="weekly">Last 7 days</option>
            <option value="monthly">Last 30 days</option>
            <option value="yearly">Last 365 days</option>
            <option value="avg">All-time average</option>
          </select>
        </div>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <div className="badge">Range days: {trend.days}</div>
          <div className="badge">Entries: {trend.count ?? 0}</div>
          <div className="badge">Total: {fmt(trend.total)}</div>
          <div className="badge">Daily avg: {fmt(trend.avg)}</div>
        </div>
        {(!expenses || !expenses.length) && <div style={{ color: '#9aa5b5', marginTop: 8 }}>No expenses to show yet.</div>}
      </div>
    </div>
  );
}
