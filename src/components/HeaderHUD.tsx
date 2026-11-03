import React from 'react';
import { 
  TrendingUp, 
  Briefcase, 
  Landmark, 
  Trophy, 
  MessageSquare, 
  Heart, 
  Volume2, 
  VolumeX, 
  AlertTriangle, 
  Zap, 
  ChevronRight,
  ShieldAlert,
  Flame
} from 'lucide-react';
import { TraderProfile } from '../types/game';

interface HeaderHUDProps {
  profile: TraderProfile;
  activeTab: 'TRADING' | 'CAREER' | 'EMPIRE' | 'WALLRICH' | 'STREETX' | 'ROMANCE';
  onSelectTab: (tab: 'TRADING' | 'CAREER' | 'EMPIRE' | 'WALLRICH' | 'STREETX' | 'ROMANCE') => void;
  onAdvanceWeek: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const HeaderHUD: React.FC<HeaderHUDProps> = ({
  profile,
  activeTab,
  onSelectTab,
  onAdvanceWeek,
  isMuted,
  onToggleMute,
}) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const getStressColor = (val: number) => {
    if (val < 40) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    if (val < 75) return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/30 animate-pulse';
  };

  const getHeatColor = (val: number) => {
    if (val < 30) return 'text-slate-400 bg-slate-800/40 border-slate-700/40';
    if (val < 70) return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    return 'text-rose-400 bg-rose-500/20 border-rose-500/40 animate-pulse';
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-[#0a0f1d]/95 backdrop-blur-md border-b border-slate-800/80 shadow-2xl select-none">
      {/* Upper Status Perimeter Cluster */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Player Profile & Firm */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-emerald-500 to-sky-500 p-0.5 shadow-md">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-lg">
                📈
              </div>
            </div>
            {profile.isMarried && (
              <span className="absolute -bottom-1 -right-1 text-xs" title="Power Couple Active">
                💍
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-100 text-sm tracking-tight">{profile.name}</span>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                {profile.firmTitle}
              </span>
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <span className="text-amber-400/90 font-mono font-medium">Week {profile.week} · Year {profile.year}</span>
              <span>•</span>
              <span className="text-slate-400">Prestige: <strong className="text-slate-200">{profile.prestige}</strong></span>
            </div>
          </div>
        </div>

        {/* Center: Financial Integer Readouts */}
        <div className="flex items-center gap-4 text-xs tabular-nums">
          <div className="bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-lg flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-slate-500">Cash</span>
            <span className="font-bold text-emerald-400 text-sm">{formatCurrency(profile.cash)}</span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-lg flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-slate-500">Portfolio</span>
            <span className="font-bold text-sky-400 text-sm">{formatCurrency(profile.portfolioValue)}</span>
          </div>

          <div className="bg-gradient-to-br from-amber-500/10 to-yellow-500/5 border border-amber-500/30 px-3.5 py-1.5 rounded-lg flex flex-col shadow-sm">
            <span className="text-[10px] uppercase tracking-wider text-amber-400 font-semibold flex items-center gap-1">
              Net Worth
            </span>
            <span className="font-black text-amber-300 text-sm">{formatCurrency(profile.netWorth)}</span>
          </div>

          {/* Stress Meter */}
          <div className={`px-2.5 py-1.5 rounded-lg border flex flex-col text-xs ${getStressColor(profile.stress)}`}>
            <div className="flex items-center gap-1 text-[10px] font-semibold uppercase">
              <Flame className="w-3 h-3" />
              <span>Stress</span>
            </div>
            <span className="font-bold">{profile.stress}%</span>
          </div>

          {/* SEC Heat Meter */}
          <div className={`px-2.5 py-1.5 rounded-lg border flex flex-col text-xs ${getHeatColor(profile.secHeat)}`}>
            <div className="flex items-center gap-1 text-[10px] font-semibold uppercase">
              <ShieldAlert className="w-3 h-3" />
              <span>SEC Heat</span>
            </div>
            <span className="font-bold">{profile.secHeat}%</span>
          </div>
        </div>

        {/* Right: Controls & Advance Week */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleMute}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition"
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          <button
            onClick={onAdvanceWeek}
            className="group px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs tracking-wide shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition active:scale-95 cursor-pointer"
            title="Advance Trading Week [SPACE]"
          >
            <span>NEXT WEEK</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-slate-950/20 text-[10px] font-mono">SPACE</kbd>
          </button>
        </div>
      </div>

      {/* Navigation Ribbon */}
      <nav className="w-full bg-slate-950/80 border-t border-slate-800/60 px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
          <button
            onClick={() => onSelectTab('TRADING')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-semibold tracking-wide transition shrink-0 ${
              activeTab === 'TRADING'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Trading Floor</span>
          </button>

          <button
            onClick={() => onSelectTab('CAREER')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-semibold tracking-wide transition shrink-0 ${
              activeTab === 'CAREER'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Career & Desk</span>
          </button>

          <button
            onClick={() => onSelectTab('EMPIRE')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-semibold tracking-wide transition shrink-0 ${
              activeTab === 'EMPIRE'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Landmark className="w-4 h-4" />
            <span>Empire & Bank</span>
          </button>

          <button
            onClick={() => onSelectTab('WALLRICH')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-semibold tracking-wide transition shrink-0 ${
              activeTab === 'WALLRICH'
                ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>WallRich 400</span>
          </button>

          <button
            onClick={() => onSelectTab('STREETX')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-semibold tracking-wide transition shrink-0 ${
              activeTab === 'STREETX'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>StreetX Feed</span>
          </button>

          <button
            onClick={() => onSelectTab('ROMANCE')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-semibold tracking-wide transition shrink-0 ${
              activeTab === 'ROMANCE'
                ? 'bg-pink-500/20 text-pink-300 border border-pink-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>High Society & Romance</span>
          </button>
        </div>
      </nav>
    </header>
  );
};
