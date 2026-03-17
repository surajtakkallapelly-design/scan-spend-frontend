import React, { useEffect, useState } from 'react';
import BudgetPanel from '../components/BudgetPanel';
import { calcBudget } from '../utils/budget';

const defaultBudgets = {
  Food: 15000, Transport: 8000, Shopping: 12000, Bills: 10000, Entertainment: 8000,
  Utilities: 5000, Health: 7000, Travel: 12000, Other: 6000
};

export default function Budgets() {
  const [budgets, setBudgets] = useState(() => {
    const stored = localStorage.getItem('budgets');
    return stored ? JSON.parse(stored) : defaultBudgets;
  });

  useEffect(() => {
    localStorage.setItem('budgets', JSON.stringify(budgets));
  }, [budgets]);

  return (
    <div style={{ padding: 24 }}>
      <h1 className="hero-title">Budgets</h1>
      <div className="badge">Set your monthly category limits</div>
      <BudgetPanel
        budgets={budgets}
        onChange={(b) => setBudgets(b)}
      />
    </div>
  );
}
