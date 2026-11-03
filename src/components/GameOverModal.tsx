import React from 'react';
import { 
  Trophy, 
  Crown, 
  AlertOctagon, 
  ShieldAlert, 
  RotateCcw, 
  Award, 
  TrendingUp, 
  Flame 
} from 'lucide-react';
import { TraderProfile } from '../types/game';

interface GameOverModalProps {
  status: 'VICTORY' | 'BANKRUPT' | 'ARRESTED';
  profile: TraderProfile;
  winRate: number;
  onRestart: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  status,
  profile,
  winRate,
  onRestart,
}) => {
  const isVictory = status === 'VICTORY';
  const isArrested = status === 'ARRESTED';

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative overflow-hidden select-none text-center">
        {isVictory ? (
          <div>
            <div className="w-20 h-20 rounded-2xl bg-amber-500/20 text-yellow-400 border border-amber-500/40 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-amber-500/10">
              <Crown className="w-10 h-10 animate-bounce" />
            </div>

            <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">
              WALL STREET IMMORTALITY ACHIEVED
            </span>
            <h2 className="text-3xl font-black text-slate-100 mt-1">SOVEREIGN MARKET TITAN</h2>
            <p className="text-xs text-slate-300 max-w-sm mx-auto mt-2 leading-relaxed">
              You dethroned Gordon Sterling and conquered the #1 spot on the WallRich 400! Central bankers now seek your counsel before adjusting interest rates.
            </p>
          </div>
        ) : isArrested ? (
          <div>
            <div className="w-20 h-20 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-rose-500/10">
              <ShieldAlert className="w-10 h-10 animate-pulse" />
            </div>

            <span className="text-[10px] font-black uppercase tracking-widest text-rose-400">
              FEDERAL ENFORCEMENT RAID
            </span>
            <h2 className="text-3xl font-black text-slate-100 mt-1">SEC ASSET FREEZE</h2>
            <p className="text-xs text-slate-300 max-w-sm mx-auto mt-2 leading-relaxed">
              Your SEC Investigation Heat crossed the 100% threshold. Federal marshals served search warrants across your penthouse and trading desk. All assets have been confiscated.
            </p>
          </div>
        ) : (
          <div>
            <div className="w-20 h-20 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-rose-500/10">
              <AlertOctagon className="w-10 h-10" />
            </div>

            <span className="text-[10px] font-black uppercase tracking-widest text-rose-400">
              CATASTROPHIC MARGIN CALL
            </span>
            <h2 className="text-3xl font-black text-slate-100 mt-1">LIQUIDATED & BANKRUPT</h2>
            <p className="text-xs text-slate-300 max-w-sm mx-auto mt-2 leading-relaxed">
              Excessive leverage and sudden market volatility overwhelmed your equity. Your prime broker automatically liquidated every single position at the low.
            </p>
          </div>
        )}

        {/* Career Dossier Stats */}
        <div className="grid grid-cols-2 gap-2 my-6 text-left text-xs tabular-nums bg-slate-950 p-4 rounded-xl border border-slate-800">
          <div>
            <span className="text-[10px] text-slate-500 uppercase block">Career Span</span>
            <span className="font-semibold text-slate-200">{profile.week} Weeks (Year {profile.year})</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase block">Peak Net Worth</span>
            <span className="font-bold text-amber-400">{formatCurrency(profile.peakNetWorth)}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase block">Total Trades</span>
            <span className="font-semibold text-slate-200">{profile.totalTrades}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase block">Win Rate</span>
            <span className="font-bold text-emerald-400">{winRate}%</span>
          </div>
        </div>

        {/* Restart CTA */}
        <button
          onClick={onRestart}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm tracking-wide uppercase transition cursor-pointer flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20"
        >
          <RotateCcw className="w-4 h-4" />
          <span>START A NEW WALL STREET RUN</span>
        </button>
      </div>
    </div>
  );
};
