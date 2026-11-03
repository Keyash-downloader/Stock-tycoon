import React from 'react';
import { Stock } from '../types/game';
import { 
  Gauge, 
  TrendingUp, 
  TrendingDown, 
  Flame, 
  ShieldAlert, 
  Activity, 
  Sparkles,
  Zap,
  Compass
} from 'lucide-react';

interface MarketSentimentGaugeProps {
  stocks: Stock[];
}

export const MarketSentimentGauge: React.FC<MarketSentimentGaugeProps> = ({ stocks }) => {
  // Aggregate calculations
  const totalStocks = stocks.length || 1;
  const advancingStocks = stocks.filter((s) => s.changePercent > 0).length;
  const decliningStocks = stocks.filter((s) => s.changePercent < 0).length;
  const unchangedStocks = stocks.filter((s) => s.changePercent === 0).length;
  const breadthPercent = Math.round((advancingStocks / totalStocks) * 100);

  const avgChangePercent = stocks.reduce((acc, s) => acc + s.changePercent, 0) / totalStocks;
  const avgVolatility = stocks.reduce((acc, s) => acc + s.volatility, 0) / totalStocks;

  // Compute a 0-100 Fear & Greed index score
  // Neutral base: 50
  // Breadth contribution: (breadthPercent - 50) * 0.4
  // Return contribution: avgChangePercent * 2.2
  // Hot stocks momentum bonus:
  const hotStocksBonus = stocks.filter((s) => s.isHot && s.changePercent > 0).length * 4;
  const rawScore = 50 + (breadthPercent - 50) * 0.45 + avgChangePercent * 2.2 + hotStocksBonus;
  const sentimentScore = Math.max(5, Math.min(95, Math.round(rawScore)));

  // Simulated VIX Volatility Index based on average volatility & market swings
  const vix = Math.round((avgVolatility * 100 + Math.abs(avgChangePercent) * 1.5 + 8) * 10) / 10;

  // Determine market phase & status
  let phaseLabel: string;
  let phaseDescription: string;
  let tacticalAdvice: string;
  let badgeColor: string;
  let textGrad: string;

  if (sentimentScore <= 25) {
    phaseLabel = 'EXTREME FEAR';
    phaseDescription = 'Deep Bearish Capitulation';
    tacticalAdvice = 'Liquidations accelerating. Prime territory for contrarian dip buying and deep-value accumulation.';
    badgeColor = 'bg-rose-500/20 text-rose-400 border-rose-500/30';
    textGrad = 'from-rose-500 to-red-400';
  } else if (sentimentScore <= 45) {
    phaseLabel = 'FEAR';
    phaseDescription = 'Bearish Contraction';
    tacticalAdvice = 'Risk-off sentiment dominating. Defensive equities and energy hedges outperform.';
    badgeColor = 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    textGrad = 'from-amber-500 to-orange-400';
  } else if (sentimentScore <= 58) {
    phaseLabel = 'NEUTRAL';
    phaseDescription = 'Balanced Rangebound Phase';
    tacticalAdvice = 'Market awaiting fresh macroeconomic catalysts. Focus on selective sector rotation.';
    badgeColor = 'bg-slate-700/40 text-slate-300 border-slate-600/40';
    textGrad = 'from-slate-300 to-yellow-200';
  } else if (sentimentScore <= 75) {
    phaseLabel = 'GREED';
    phaseDescription = 'Bullish Expansion';
    tacticalAdvice = 'Broad risk appetite accelerating. High-beta tech and growth momentum leading rallies.';
    badgeColor = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    textGrad = 'from-emerald-400 to-teal-300';
  } else {
    phaseLabel = 'EXTREME GREED';
    phaseDescription = 'Euphoric Bull Mania';
    tacticalAdvice = 'Speculative call buying and gamma squeezes raging. Trim excessive leverage to avoid flash pullbacks.';
    badgeColor = 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
    textGrad = 'from-cyan-400 to-emerald-400';
  }

  // Needle angle for SVG semi-circle gauge:
  // 0 corresponds to -90 deg, 50 to 0 deg, 100 to +90 deg
  const needleAngle = ((sentimentScore - 50) / 50) * 85;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-2.5 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center border border-slate-700 text-amber-400">
            <Compass className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              Market Sentiment & Volatility Index
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${badgeColor}`}>
                {phaseLabel}
              </span>
            </h3>
            <span className="text-[11px] text-slate-500">
              Real-time Fear & Greed gauge derived from cross-sector equities and volatility flow
            </span>
          </div>
        </div>

        {/* Volatility VIX Indicator */}
        <div className="flex items-center gap-2 tabular-nums font-mono text-xs">
          <div className="bg-slate-950 px-3 py-1 rounded-lg border border-slate-800 flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-slate-400 text-[10px] uppercase">VIX Proxy:</span>
            <span className={`font-bold ${vix > 28 ? 'text-rose-400' : vix > 18 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {vix} {vix > 28 ? '· High Turbulence' : '· Moderate'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Gauge on Left, Metrics & Tactical Readout on Right */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Semi-circular Radial Speedometer SVG Gauge (5 cols) */}
        <div className="md:col-span-5 flex flex-col items-center justify-center relative py-1">
          <div className="relative w-52 h-28 overflow-hidden flex items-end justify-center">
            <svg viewBox="0 0 200 110" className="w-52 h-28 select-none">
              <defs>
                {/* Arc gradient from red to green */}
                <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f43f5e" />
                  <stop offset="25%" stopColor="#fb923c" />
                  <stop offset="50%" stopColor="#eab308" />
                  <stop offset="75%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#34d399" />
                </linearGradient>
              </defs>

              {/* Background Arc Track */}
              <path
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none"
                stroke="#1e293b"
                strokeWidth="14"
                strokeLinecap="round"
              />

              {/* Colored Gradient Arc Track */}
              <path
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none"
                stroke="url(#gaugeGradient)"
                strokeWidth="14"
                strokeLinecap="round"
                opacity="0.85"
              />

              {/* Needle Indicator */}
              <g transform={`translate(100, 100) rotate(${needleAngle})`}>
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="-74"
                  stroke="#ffffff"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  filter="drop-shadow(0 0 4px rgba(255,255,255,0.6))"
                />
                <circle cx="0" cy="0" r="7" fill="#ffffff" />
                <circle cx="0" cy="0" r="3" fill="#0f172a" />
              </g>
            </svg>
          </div>

          {/* Central Score Display */}
          <div className="text-center mt-1">
            <div className={`text-2xl font-black bg-gradient-to-r ${textGrad} bg-clip-text text-transparent tabular-nums font-mono`}>
              {sentimentScore} <span className="text-xs text-slate-500 font-normal">/ 100</span>
            </div>
            <span className="text-xs font-bold text-slate-200 tracking-wide block">
              {phaseDescription}
            </span>
          </div>
        </div>

        {/* Right Info: Market Breadth & Tactical Intelligence (7 cols) */}
        <div className="md:col-span-7 space-y-3">
          {/* Breadth and Average Momentum */}
          <div className="grid grid-cols-2 gap-2 text-xs tabular-nums">
            <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block">Market Breadth</span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-bold text-emerald-400">{advancingStocks} Adv</span>
                <span className="text-slate-600">/</span>
                <span className="font-bold text-rose-400">{decliningStocks} Dec</span>
                <span className="text-[10px] text-slate-400 font-mono ml-auto">({breadthPercent}% Bull)</span>
              </div>
            </div>

            <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block">Average Momentum</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                {avgChangePercent >= 0 ? (
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
                )}
                <span
                  className={`font-black ${
                    avgChangePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {avgChangePercent >= 0 ? '+' : ''}{avgChangePercent.toFixed(2)}%
                </span>
                <span className="text-[10px] text-slate-500">across index</span>
              </div>
            </div>
          </div>

          {/* Tactical Wall Street Commentary */}
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs">
            <div className="flex items-center gap-1.5 text-slate-300 font-semibold mb-1">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Desk Intelligence & Positioning:</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              {tacticalAdvice}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
