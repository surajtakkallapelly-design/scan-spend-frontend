import React, { useState } from 'react';
import { API_HOST } from '../services/api';

const fmt = (v) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(Number(v || 0));
const fd = (d) => new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
const imgSrc = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${API_HOST}${path}`;
};

export default function ExpenseTable({ expenses, onEdit, onDelete, onRemind, onView }) {
  const [preview, setPreview] = useState(null);
  return (
    <div className="card">
      <h3>Expenses</h3>
      <div className="scroll-x">
      <table className="table">
        <thead>
          <tr>
            <th>Receipt</th>
            <th>Date</th>
            <th>Merchant</th>
            <th>Category</th>
            <th>Amount</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((e) => (
            <tr key={e.id}>
              <td>
                {e.receiptImage && (
                  <img
                    src={imgSrc(e.receiptImage)}
                    alt="receipt"
                    style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8, cursor: 'pointer' }}
                    onClick={() => onView ? onView(e) : setPreview(imgSrc(e.receiptImage))}
                  />
                )}
              </td>
              <td>{fd(e.date)}</td>
              <td>{e.merchant}</td>
              <td>{e.category}</td>
              <td>{fmt(e.amount)}</td>
              <td style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => onEdit(e)}>Edit</button>
                <button onClick={() => onDelete(e.id)}>Delete</button>
                {onRemind && <button onClick={() => onRemind(e)}>Remind</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      {preview && (
        <div
          onClick={() => setPreview(null)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
            display: 'grid', placeItems: 'center', zIndex: 999
          }}
        >
          <img src={preview} alt="receipt large" style={{ maxWidth: '90vw', maxHeight: '90vh', borderRadius: 12, boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }} />
        </div>
      )}
    </div>
  );
}
