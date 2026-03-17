import React, { useEffect, useState } from 'react';

const defaultBudgets = {
  Food: 15000, Transport: 8000, Shopping: 12000, Bills: 10000, Entertainment: 8000,
  Utilities: 5000, Health: 7000, Travel: 12000, Other: 6000
};

export default function BudgetPanel({ budgets, onChange }) {
  const [local, setLocal] = useState(budgets || defaultBudgets);
  useEffect(() => setLocal(budgets || defaultBudgets), [budgets]);

  const update = (cat, val) => {
    const next = { ...local, [cat]: Number(val || 0) };
    setLocal(next);
    onChange(next);
  };

  const reset = () => {
    setLocal(defaultBudgets);
    onChange(defaultBudgets);
  };

  return (
    <div className="card" style={{ marginTop: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>Budgets (per month)</h3>
        <button type="button" onClick={reset}>Reset defaults</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 8 }}>
        {Object.keys(local).map(cat => (
          <label key={cat} style={{ display: 'grid', gap: 4 }}>
            <span style={{ fontSize: 12, color: '#94a3b8' }}>{cat}</span>
            <input
              type="number"
              value={local[cat]}
              onChange={e => update(cat, e.target.value)}
            />
          </label>
        ))}
      </div>
    </div>
  );
}
