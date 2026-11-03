import React from 'react';
import { 
  CheckCircle, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Landmark, 
  Flame, 
  ChevronRight,
  Zap,
  Sparkles
} from 'lucide-react';
import { MarketEvent } from '../types/game';

interface WeekSummaryModalProps {
  week: number;
  year: number;
  tradingPnL: number;
  salaryEarned: number;
  savingsInterestEarned: number;
  dividendsEarned: number;
  upkeepDeducted: number;
  marginInterestDeducted: number;
  marketEvent: MarketEvent | null;
  onClose: () => void;
}

export const WeekSummaryModal: React.FC<WeekSummaryModalProps> = ({
  week,
  year,
  tradingPnL,
  salaryEarned,
  savingsInterestEarned,
  dividendsEarned,
  upkeepDeducted,
  marginInterestDeducted,
  marketEvent,
  onClose,
}) => {
  const netWeeklyCashFlow = salaryEarned + savingsInterestEarned + dividendsEarned - upkeepDeducted - marginInterestDeducted;
  const totalWeeklyChange = tradingPnL + netWeeklyCashFlow;
  const isPositive = totalWeeklyChange >= 0;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative overflow-hidden select-none animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400">
              Weekly Market Settlement
            </span>
            <h3 className="text-xl font-black text-slate-100">
              Week {week} · Year {year} Results
            </h3>
          </div>
          <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center font-mono font-bold text-slate-200 text-sm">
            W{week}
          </div>
        </div>

        {/* Breaking Market Catalyst Event */}
        {marketEvent && (
          <div className="mb-4 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold mb-1">
              <Zap className="w-4 h-4" />
              <span>MARKET FLASH: {marketEvent.headline}</span>
            </div>
            <p className="text-slate-300 leading-relaxed">{marketEvent.description}</p>
          </div>
        )}

        {/* Financial Flow Breakdown */}
        <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800 space-y-2.5 text-xs tabular-nums mb-4">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Portfolio Mark-to-Market PnL</span>
            <span className={`font-bold ${tradingPnL >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {tradingPnL >= 0 ? '+' : ''}{formatCurrency(tradingPnL)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">Career Salary Draw</span>
            <span className="font-semibold text-emerald-400">+{formatCurrency(salaryEarned)}</span>
          </div>

          {savingsInterestEarned > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-slate-400">High-Yield Treasury Interest</span>
              <span className="font-semibold text-emerald-400">+{formatCurrency(savingsInterestEarned)}</span>
            </div>
          )}

          {dividendsEarned > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Portfolio Stock Dividends Payout
              </span>
              <span className="font-semibold text-emerald-400 font-mono">+{formatCurrency(dividendsEarned)}</span>
            </div>
          )}

          {upkeepDeducted > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Empire & Staff Upkeep</span>
              <span className="font-semibold text-rose-400">-{formatCurrency(upkeepDeducted)}</span>
            </div>
          )}

          {marginInterestDeducted > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Margin Borrow Financing Fee</span>
              <span className="font-semibold text-rose-400">-{formatCurrency(marginInterestDeducted)}</span>
            </div>
          )}

          <div className="pt-2.5 border-t border-slate-800 flex items-center justify-between font-black text-sm">
            <span className="text-slate-200">Net Weekly Performance</span>
            <span className={isPositive ? 'text-emerald-400' : 'text-rose-400'}>
              {isPositive ? '+' : ''}{formatCurrency(totalWeeklyChange)}
            </span>
          </div>
        </div>

        {/* Bottom CTA */}
        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs tracking-wider uppercase transition cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
        >
          <span>OPEN TRADING FLOOR</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
