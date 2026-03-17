import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../services/authService';
import { useToast } from '../components/ToastHost';

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.add('Welcome back', 'success');
      nav('/dashboard');
    } catch (err) {
      setError('Invalid credentials');
      toast.add('Login failed', 'error');
    }
  };

  return (
    <div style={{ display: 'grid', placeItems: 'center', height: '100vh' }}>
      <div className="card" style={{ width: 360 }}>
        <h2>Welcome back</h2>
        <form className="form" onSubmit={submit}>
          <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
          {error && <div style={{ color: 'tomato' }}>{error}</div>}
          <button type="submit">Login</button>
        </form>
        <p style={{ color: '#94a3b8' }}>No account? <Link to="/register">Register</Link></p>
      </div>
    </div>
  );
}
