import React from 'react';
import { Play, TrendingUp, ShieldAlert, Award, Volume2, VolumeX, Sparkles, DollarSign, Swords, Smartphone } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface TitleScreenProps {
  onStartGame: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenPublishModal?: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({ 
  onStartGame, 
  isMuted, 
  onToggleMute,
  onOpenPublishModal 
}) => {
  return (
    <div className="relative w-full h-screen bg-[#070b14] text-slate-100 flex flex-col justify-between overflow-hidden select-none">
      {/* Background Matrix / Candlestick Grid Animation */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#38bdf8" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Floating Candlestick Neon Lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl" />
      </div>

      {/* Top Header Bar */}
      <header className="relative z-10 w-full px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 font-bold text-slate-950 text-xl tracking-tighter">
            $
          </div>
          <div>
            <span className="text-xs uppercase tracking-widest text-emerald-400 font-semibold block">Wall Street Career Sim</span>
            <span className="text-sm font-medium text-slate-400">Spotlight Studio Series</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {onOpenPublishModal && (
            <button
              onClick={onOpenPublishModal}
              className="px-3.5 py-2 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40 text-indigo-300 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-md"
              title="Publish on App Store & Google Play Store"
            >
              <Smartphone className="w-4 h-4 text-indigo-400" />
              <span>App Stores</span>
            </button>
          )}

          <PWAInstallButton variant="full" />
          <button
            onClick={onToggleMute}
            className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition cursor-pointer"
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5 text-emerald-400" />}
          </button>
        </div>
      </header>

      {/* Hero Centerpiece & Bespoke Title Lockup */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 max-w-4xl mx-auto">
        {/* Live Multiplayer Badge */}
        <div className="mb-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-bold uppercase tracking-wider shadow-sm animate-pulse">
          <Swords className="w-3.5 h-3.5" />
          <span>Real-Time Multiplayer Trading Pit Online</span>
        </div>

        {/* Bespoke SVG Title Lockup */}
        <div className="mb-4">
          <svg className="w-80 sm:w-96 md:w-[480px] h-auto mx-auto" viewBox="0 0 500 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="50%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#ca8a04" />
              </linearGradient>
              <linearGradient id="emeraldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Glowing Bull Horn Geometric Accent */}
            <path d="M 60 70 Q 110 30 160 50" stroke="url(#goldGradient)" strokeWidth="3" strokeLinecap="round" filter="url(#glow)" opacity="0.6" />
            <path d="M 440 70 Q 390 30 340 50" stroke="url(#emeraldGradient)" strokeWidth="3" strokeLinecap="round" filter="url(#glow)" opacity="0.6" />

            {/* Main Wordmark */}
            <text x="250" y="48" textAnchor="middle" fill="#94a3b8" fontSize="16" fontWeight="700" letterSpacing="9" fontFamily="system-ui, sans-serif">
              SPOTLIGHT
            </text>
            <text x="250" y="98" textAnchor="middle" fill="url(#goldGradient)" fontSize="52" fontWeight="900" letterSpacing="4" fontFamily="system-ui, sans-serif" filter="url(#glow)">
              STOCKS
            </text>
          </svg>
          <div className="text-xs md:text-sm font-semibold tracking-widest uppercase text-emerald-400 mt-1">
            MARKET TITAN · WALL STREET LIFE SIMULATION
          </div>
        </div>

        <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto mb-8 leading-relaxed">
          Start in your bedroom with <span className="text-emerald-400 font-semibold">$15,000</span>.
          Scale to a <span className="text-amber-400 font-semibold">$1.5 Billion</span> fund, conquer volatile stocks,
          crush rival raiders on the <span className="text-sky-400 font-semibold">WallRich 400</span>, survive SEC scandals, and build an immortal empire.
        </p>

        {/* Feature Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-2xl mb-8">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 flex flex-col items-center">
            <TrendingUp className="w-5 h-5 text-emerald-400 mb-1" />
            <span className="text-xs font-semibold text-slate-200">Real Tickers</span>
            <span className="text-[10px] text-slate-500">Candles & Options</span>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 flex flex-col items-center">
            <Award className="w-5 h-5 text-amber-400 mb-1" />
            <span className="text-xs font-semibold text-slate-200">WallRich 400</span>
            <span className="text-[10px] text-slate-500">Compete vs Rivals</span>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 flex flex-col items-center">
            <ShieldAlert className="w-5 h-5 text-rose-400 mb-1" />
            <span className="text-xs font-semibold text-slate-200">SEC Scandals</span>
            <span className="text-[10px] text-slate-500">6 PR Crisis Choices</span>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 flex flex-col items-center">
            <Sparkles className="w-5 h-5 text-purple-400 mb-1" />
            <span className="text-xs font-semibold text-slate-200">Power Couples</span>
            <span className="text-[10px] text-slate-500">Romance & Megayachts</span>
          </div>
        </div>

        {/* Start Game Button */}
        <button
          onClick={onStartGame}
          className="group relative inline-flex items-center gap-3 px-10 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-base md:text-lg tracking-wide shadow-xl shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
        >
          <Play className="w-5 h-5 fill-slate-950" />
          <span>ENTER THE TRADING FLOOR</span>
          <span className="text-xs px-2 py-0.5 rounded bg-slate-950/20 text-slate-900 font-mono ml-2">SPACE</span>
        </button>
      </main>

      {/* Control Hint Footer Line */}
      <footer className="relative z-10 w-full py-4 border-t border-slate-800/80 bg-slate-950/70 text-center text-xs text-slate-500 flex flex-wrap items-center justify-center gap-4 px-4 font-mono">
        <span>Space Advance Week</span>
        <span>•</span>
        <span>T Trading Floor</span>
        <span>•</span>
        <span>P Portfolio & Career</span>
        <span>•</span>
        <span>R WallRich Rivals</span>
        <span>•</span>
        <span>N StreetX Social</span>
        <span>•</span>
        <span>Esc Pause</span>
      </footer>
    </div>
  );
};
