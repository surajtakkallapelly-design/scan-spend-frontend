import React, { useEffect, useState } from 'react';
import { getProfile, updateProfile, changePassword } from '../services/profileService';
import { useToast } from '../components/ToastHost';
import { useAuth } from '../services/authService';

export default function Profile() {
  const toast = useToast();
  const { setUserFromProfile } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', income: '' });
  const [pwd, setPwd] = useState({ currentPassword: '', newPassword: '' });

  useEffect(() => {
    (async () => {
      const p = await getProfile();
      setForm({ name: p.name || '', email: p.email || '', income: p.income || '' });
    })();
  }, []);

  const saveProfile = async () => {
    const res = await updateProfile({ ...form, income: Number(form.income || 0) });
    setUserFromProfile(res);
    toast.add('Profile updated', 'success');
  };

  const savePassword = async () => {
    await changePassword(pwd);
    setPwd({ currentPassword: '', newPassword: '' });
    toast.add('Password updated', 'success');
  };

  return (
    <div style={{ padding: 24 }}>
      <h1 className="hero-title">Profile</h1>
      <div className="card" style={{ maxWidth: 520, display: 'grid', gap: 12 }}>
        <label>Name <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></label>
        <label>Email <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></label>
        <label>Income (₹/month) <input type="number" value={form.income} onChange={e => setForm({ ...form, income: e.target.value })} /></label>
        <button onClick={saveProfile}>Save profile</button>
      </div>

      <div className="card" style={{ maxWidth: 520, marginTop: 16, display: 'grid', gap: 12 }}>
        <h3>Change Password</h3>
        <input type="password" placeholder="Current password" value={pwd.currentPassword} onChange={e => setPwd({ ...pwd, currentPassword: e.target.value })} />
        <input type="password" placeholder="New password" value={pwd.newPassword} onChange={e => setPwd({ ...pwd, newPassword: e.target.value })} />
        <button onClick={savePassword}>Update password</button>
      </div>
    </div>
  );
}
