import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../services/authService';
import { useToast } from '../components/ToastHost';

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const toast = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(name, email, password);
      toast.add('Account created', 'success');
      nav('/dashboard');
    } catch (err) {
      setError('Sign-up failed. Try a different email or check your connection.');
      toast.add('Sign-up failed', 'error');
    }
  };

  return (
    <div style={{ display: 'grid', placeItems: 'center', height: '100vh' }}>
      <div className="card" style={{ width: 360 }}>
        <h2>Create account</h2>
        <form className="form" onSubmit={submit}>
          <input required placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
          <input required type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <input required minLength={6} type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
          {error && <div style={{ color: 'tomato' }}>{error}</div>}
          <button type="submit">Register</button>
        </form>
        <p style={{ color: '#94a3b8' }}>Already registered? <Link to="/">Login</Link></p>
      </div>
    </div>
  );
}
