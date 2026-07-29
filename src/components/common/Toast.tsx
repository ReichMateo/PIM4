import React from 'react';
import type { ToastMessage } from '../../hooks/useToast';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

interface ToastContainerProps {
  toasts: ToastMessage[];
  onClose: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onClose }) => {
  if (!toasts.length) return null;

  return (
    <div className="toast-container" role="region" aria-label="Notificaciones">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          {toast.type === 'success' && <CheckCircle2 size={20} color="#10b981" />}
          {toast.type === 'error' && <XCircle size={20} color="#ef4444" />}
          {toast.type === 'warning' && <AlertTriangle size={20} color="#f59e0b" />}
          {toast.type === 'info' && <Info size={20} color="#3b82f6" />}
          <span style={{ flex: 1, fontSize: '0.875rem' }}>{toast.message}</span>
          <button
            onClick={() => onClose(toast.id)}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
            aria-label="Cerrar notificación"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};
