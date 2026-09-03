import React from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export interface ToastItem {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
}

interface ToastNotificationProps {
  toasts: ToastItem[];
  removeToast: (id: string) => void;
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({ toasts, removeToast }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 sm:top-5 sm:right-5 sm:bottom-auto z-50 flex flex-col gap-2.5 max-w-sm w-[calc(100vw-32px)] sm:w-96 pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        const isWarning = toast.type === 'warning';
        const isInfo = toast.type === 'info';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-2xl border backdrop-blur-xl transition-all duration-300 animate-page-enter ${
              isSuccess
                ? 'bg-zinc-950/95 text-white border-emerald-500/40 shadow-emerald-950/20'
                : isError
                ? 'bg-zinc-950/95 text-white border-rose-500/50 shadow-rose-950/30'
                : isWarning
                ? 'bg-zinc-950/95 text-white border-amber-500/40 shadow-amber-950/20'
                : 'bg-zinc-950/95 text-white border-zinc-700/60 shadow-black/40'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              {isError && <AlertCircle className="w-4 h-4 text-rose-400" />}
              {isWarning && <AlertTriangle className="w-4 h-4 text-amber-400" />}
              {isInfo && <Info className="w-4 h-4 text-blue-400" />}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-white tracking-tight leading-tight">
                {toast.title}
              </h4>
              {toast.message && (
                <p className="text-[11px] text-zinc-300 mt-0.5 leading-relaxed break-words font-sans">
                  {toast.message}
                </p>
              )}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 text-zinc-500 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              aria-label="Close notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
