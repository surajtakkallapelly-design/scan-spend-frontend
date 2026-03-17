import React from 'react';
import AppRoutes from './routes/AppRoutes';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { useAuth } from './services/authService';

export default function App() {
  const { user } = useAuth();
  return (
    <div className="app-shell">
      {user && <Sidebar />}
      <div style={{ width: '100%' }}>
        {user && <Navbar />}
        <AppRoutes />
      </div>
    </div>
  );
}
