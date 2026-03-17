import React from 'react';

const formatInr = (v) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(Number(v || 0));

export default function ExpenseCard({ title, value, sub, accent, raw }) {
  return (
    <div className="card" style={{ borderColor: accent || 'rgba(255,255,255,0.07)' }}>
      <div className="stat">
        <div style={{ width: 10, height: 10, borderRadius: 999, background: accent || '#7cf3d6' }} />
        <div style={{ color: '#8b92a5', fontSize: 14 }}>{title}</div>
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, marginTop: 6 }}>{raw !== undefined ? raw : formatInr(value)}</div>
      {sub && <div style={{ color: '#8b92a5', fontSize: 12, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}
