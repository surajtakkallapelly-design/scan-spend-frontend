import React from 'react';
import { useAuth } from '../services/authService';
import { useTheme } from '../services/theme.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  return (
    <div className="navbar">
      <div className="brand">
        <div style={{ width: 10, height: 10, borderRadius: 999, background: 'linear-gradient(120deg,#7cf3d6,#4cc9f0)' }} />
        <div>
          <div>ScanSpend</div>
          <div className="tag">AI expense automator</div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={toggle} style={{ padding: '8px 10px' }}>
          {theme === 'light' ? 'Dark mode' : 'Light mode'}
        </button>
        <span style={{ color: '#8b92a5', fontSize: 14 }}>{user?.name}</span>
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
}
