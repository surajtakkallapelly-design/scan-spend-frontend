import React, { useState } from 'react';
import { uploadReceipt } from '../services/expenseService';
import { useToast } from './ToastHost';

export default function UploadReceipt({ onUploaded }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleUpload = async () => {
    if (!file) {
      toast.add('Choose a file first', 'error');
      return;
    }
    setLoading(true);
    try {
      const res = await uploadReceipt(file);
      onUploaded(res);
      toast.add('Receipt processed', 'success');
    } catch (e) {
      toast.add('Upload failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3>Upload Receipt</h3>
      <input type="file" accept="image/*" onChange={(e) => {
        const f = e.target.files[0];
        setFile(f);
        setPreview(URL.createObjectURL(f));
      }} />
      {preview && <img src={preview} alt="preview" style={{ maxWidth: '100%', marginTop: 12, borderRadius: 12 }} />}
      <button disabled={loading} onClick={handleUpload}>{loading ? 'Processing...' : 'Send to OCR'}</button>
    </div>
  );
}
