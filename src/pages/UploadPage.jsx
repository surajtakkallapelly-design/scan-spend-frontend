import React, { useState } from 'react';
import UploadReceipt from '../components/UploadReceipt';
import { updateExpense } from '../services/expenseService';
import { useToast } from '../components/ToastHost';
import { API_HOST } from '../services/api';

export default function UploadPage() {
  const [last, setLast] = useState(null);
  const [edit, setEdit] = useState(null);
  const toast = useToast();

  const handleUploaded = (res) => {
    setLast(res);
    setEdit({ merchant: res.merchant, amount: res.amount, category: res.category || '', date: res.date });
  };

  const saveFix = async () => {
    if (!last?.expenseId) return;
    await updateExpense(last.expenseId, edit);
    toast.add('Corrected and saved', 'success');
  };

  return (
    <div style={{ padding: 24 }}>
      <h1 className="hero-title">Upload Receipt</h1>
      <UploadReceipt onUploaded={handleUploaded} />
      {last && (
        <div className="card" style={{ marginTop: 12 }}>
          <div className="badge">OCR created expense</div>
          {last.receiptImage && <img src={`${last.receiptImage.startsWith('http') ? '' : API_HOST}${last.receiptImage}`} alt="uploaded receipt" style={{ maxWidth: '100%', borderRadius: 12, marginBottom: 12 }} />}
          <div style={{ display: 'grid', gap: 8 }}>
            <label>Merchant <input value={edit?.merchant || ''} onChange={e => setEdit({ ...edit, merchant: e.target.value })} /></label>
            <label>Amount <input value={edit?.amount || ''} onChange={e => setEdit({ ...edit, amount: e.target.value })} /></label>
            <label>Category <input value={edit?.category || ''} onChange={e => setEdit({ ...edit, category: e.target.value })} /></label>
            <label>Date <input type="date" value={edit?.date || ''} onChange={e => setEdit({ ...edit, date: e.target.value })} /></label>
            <button onClick={saveFix}>Save correction</button>
          </div>
        </div>
      )}
    </div>
  );
}
