import { CheckCircle2, Info, X, XCircle } from 'lucide-react';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';

import { useLanguage } from '../context/LanguageContext.jsx';

const ToastContext = createContext(null);

const icons = {
  success: CheckCircle2,
  error: XCircle,
  info: Info
};

export const ToastProvider = ({ children }) => {
  const languageContext = useLanguage();
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((message, type = 'info') => {
    const id = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
    const toast = { id, message, type };

    setToasts((current) => [...current.slice(-3), toast]);
    window.setTimeout(() => removeToast(id), type === 'error' ? 5200 : 3600);
  }, [removeToast]);

  const value = useMemo(() => ({
    error: (message) => showToast(message, 'error'),
    info: (message) => showToast(message, 'info'),
    success: (message) => showToast(message, 'success')
  }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-stack" aria-live="polite" aria-atomic="true">
        {toasts.map((toast) => {
          const Icon = icons[toast.type] || Info;

          return (
            <div className={`toast ${toast.type}`} key={toast.id}>
              <Icon size={20} />
              <span>{toast.message}</span>
              <button type="button" onClick={() => removeToast(toast.id)} title={languageContext?.t?.('close') || 'Close'}>
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
