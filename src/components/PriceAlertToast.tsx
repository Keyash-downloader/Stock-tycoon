import React from 'react';
import { PriceAlertNotification } from '../types/game';
import { Bell, ArrowUpRight, ArrowDownRight, X, ExternalLink, CheckCircle } from 'lucide-react';

interface PriceAlertToastProps {
  notifications: PriceAlertNotification[];
  onDismiss: (id: string) => void;
  onSelectStock: (symbol: string) => void;
}

export const PriceAlertToast: React.FC<PriceAlertToastProps> = ({
  notifications,
  onDismiss,
  onSelectStock,
}) => {
  if (notifications.length === 0) return null;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(val);
  };

  return (
    <div className="fixed top-16 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none select-none">
      {notifications.map((notif) => {
        const isAbove = notif.condition === 'ABOVE';

        return (
          <div
            key={notif.id}
            className="pointer-events-auto bg-[#0a1020]/95 backdrop-blur-md border border-amber-500/50 rounded-2xl p-3.5 shadow-2xl shadow-amber-500/10 text-slate-100 animate-in slide-in-from-top-4 fade-in duration-200"
          >
            {/* Top Chrome Bar */}
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Bell className="w-3 h-3 animate-bounce" />
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400">
                  Target Price Hit · Week {notif.week}
                </span>
              </div>

              <button
                onClick={() => onDismiss(notif.id)}
                className="text-slate-500 hover:text-slate-300 p-0.5 rounded transition cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Notification Body */}
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-black text-slate-100 text-sm tracking-tight">
                    ${notif.symbol}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded flex items-center gap-0.5 ${
                      isAbove
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {isAbove ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {isAbove ? 'Crossed Above' : 'Dropped Below'}
                  </span>
                </div>

                <p className="text-xs text-slate-300 mt-1 leading-snug">
                  Target threshold of <strong className="text-amber-300">{formatCurrency(notif.targetPrice)}</strong> reached! Current market price:{' '}
                  <strong className="text-emerald-400 font-mono">{formatCurrency(notif.currentPrice)}</strong>.
                </p>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between gap-2 mt-3 pt-2 border-t border-slate-800/60 text-xs">
              <button
                onClick={() => onDismiss(notif.id)}
                className="text-slate-400 hover:text-slate-200 text-[11px] cursor-pointer"
              >
                Dismiss
              </button>

              <button
                onClick={() => {
                  onSelectStock(notif.symbol);
                  onDismiss(notif.id);
                }}
                className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] tracking-wide transition cursor-pointer flex items-center gap-1 shadow-md shadow-amber-500/20"
              >
                <span>Trade {notif.symbol}</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
