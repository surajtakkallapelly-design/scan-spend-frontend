import React, { createContext, useContext, useMemo, useState, useCallback } from 'react';

const ToastContext = createContext({ add: () => {} });

export function ToastProvider({ children }) {
  const [items, setItems] = useState([]);

  const add = useCallback((message, tone = 'info', timeout = 2800) => {
    const id = crypto.randomUUID();
    setItems((list) => [...list, { id, message, tone }]);
    setTimeout(() => setItems((list) => list.filter((t) => t.id !== id)), timeout);
  }, []);

  const value = useMemo(() => ({ add }), [add]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-stack">
        {items.map((t) => (
          <div key={t.id} className={`toast ${t.tone}`}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
