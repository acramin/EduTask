import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X, Undo2 } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  text: string;
  actionText?: string;
  onAction?: () => void;
  duration?: number;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 z-50 flex flex-col gap-2.5 sm:max-w-sm pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, toast.duration || 4000);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  const typeConfig = {
    success: {
      bg: 'bg-slate-900 text-white border-slate-800',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />,
    },
    error: {
      bg: 'bg-rose-900 text-white border-rose-800',
      icon: <AlertCircle className="w-4 h-4 text-rose-300 shrink-0" />,
    },
    info: {
      bg: 'bg-slate-900 text-white border-slate-800',
      icon: <Info className="w-4 h-4 text-blue-400 shrink-0" />,
    },
  }[toast.type];

  return (
    <div
      className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-2xl shadow-xl border ${typeConfig.bg} animate-in slide-in-from-bottom-3 duration-200`}
      role="status"
    >
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        {typeConfig.icon}
        <span className="text-xs font-semibold leading-snug truncate">{toast.text}</span>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {toast.actionText && toast.onAction && (
          <button
            onClick={() => {
              toast.onAction?.();
              onDismiss(toast.id);
            }}
            className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1.5 px-2.5 py-1.5 min-h-[36px] rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span>{toast.actionText}</span>
          </button>
        )}

        <button
          onClick={() => onDismiss(toast.id)}
          className="text-slate-400 hover:text-white p-1.5 min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Fechar notificação"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
