import React from 'react';

export default function FilterBar({ filters, onChange, onClear }) {
  return (
    <div className="card" style={{ display: 'grid', gap: 8, marginBottom: 12 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 8 }}>
        <input placeholder="Search merchant" value={filters.search} onChange={e => onChange({ ...filters, search: e.target.value })} />
        <input placeholder="Category" value={filters.category} onChange={e => onChange({ ...filters, category: e.target.value })} />
        <input type="date" value={filters.from} onChange={e => onChange({ ...filters, from: e.target.value })} />
        <input type="date" value={filters.to} onChange={e => onChange({ ...filters, to: e.target.value })} />
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="button" onClick={onClear}>Clear filters</button>
      </div>
    </div>
  );
}
