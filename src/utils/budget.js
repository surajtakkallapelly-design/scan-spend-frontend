export function calcBudget(expenses, budgets, defaults) {
  const monthKey = new Date().toISOString().slice(0,7);
  const spent = {};
  expenses.filter(e => (e.date || '').startsWith(monthKey)).forEach(e => {
    spent[e.category] = (spent[e.category] || 0) + Number(e.amount || 0);
  });
  const base = budgets && Object.keys(budgets).length ? budgets : defaults;
  const result = {};
  Object.entries(base).forEach(([cat, budget]) => {
    const val = spent[cat] || 0;
    result[cat] = { spent: val, budget, percent: (val / budget) * 100 };
  });
  return result;
}
