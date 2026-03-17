import React from 'react';
import { NavLink } from 'react-router-dom';

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/upload', label: 'Upload Receipt' },
  { to: '/expenses', label: 'Expenses' },
  { to: '/reports', label: 'Reports' },
  { to: '/budgets', label: 'Budgets' },
  { to: '/profile', label: 'Profile' }
];

export default function Sidebar() {
  return (
    <div className="sidebar">
      <h3>Navigation</h3>
      {links.map((link) => (
        <NavLink key={link.to} to={link.to}>{link.label}</NavLink>
      ))}
    </div>
  );
}
