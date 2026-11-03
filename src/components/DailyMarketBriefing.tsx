import React, { useState } from 'react';
import { MarketBriefing } from '../types/game';
import { 
  Radio, 
  ChevronDown, 
  ChevronUp, 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  Clock, 
  FileText, 
  Sparkles,
  Newspaper
} from 'lucide-react';

interface DailyMarketBriefingProps {
  currentBriefing: MarketBriefing;
  archive: MarketBriefing[];
}

export const DailyMarketBriefing: React.FC<DailyMarketBriefingProps> = ({
  currentBriefing,
  archive,
}) => {
  const [showArchive, setShowArchive] = useState(false);

  const getSentimentBadge = (sentiment: MarketBriefing['sentiment']) => {
    switch (sentiment) {
      case 'BULLISH':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> BULLISH TAILWIND
          </span>
        );
      case 'BEARISH':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1">
            <TrendingDown className="w-3 h-3" /> BEARISH HEADWIND
          </span>
        );
      case 'VOLATILE':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1">
            <Zap className="w-3 h-3" /> HIGH VOLATILITY
          </span>
        );
    }
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-sky-950/30 border border-slate-800 rounded-2xl p-4 shadow-xl select-none">
      {/* Top Banner Row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center">
              <Radio className="w-4 h-4 animate-pulse text-sky-400" />
            </div>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-sky-400">
                DAILY MARKET BRIEFING WIRE
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                W{currentBriefing.week} · Y{currentBriefing.year}
              </span>
              <span className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 text-[10px] font-medium border border-slate-700">
                {currentBriefing.category}
              </span>
            </div>
            <h4 className="text-sm md:text-base font-black text-slate-100 tracking-tight mt-0.5 flex items-center gap-2">
              <span>{currentBriefing.headline}</span>
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {getSentimentBadge(currentBriefing.sentiment)}

          <button
            onClick={() => setShowArchive(!showArchive)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-400 hover:text-slate-200 transition cursor-pointer flex items-center gap-1 font-mono"
            title="Toggle Wire Archive"
          >
            <Newspaper className="w-3.5 h-3.5 text-slate-400" />
            <span>Wire History ({archive.length})</span>
            {showArchive ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Briefing Contextual Summary */}
      <div className="mt-2.5 pt-2.5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <p className="text-slate-300 text-xs leading-relaxed max-w-4xl flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" />
          <span>{currentBriefing.summary}</span>
        </p>

        <span className="text-[11px] text-slate-500 font-mono shrink-0">
          Impact Focus: <strong className="text-slate-300">{currentBriefing.affectedSector}</strong>
        </span>
      </div>

      {/* Expandable Wire Archive Accordion */}
      {showArchive && (
        <div className="mt-3 pt-3 border-t border-slate-800 space-y-2 max-h-56 overflow-y-auto pr-1 animate-in fade-in duration-150">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
            Prior Dispatches & Market Catalysts
          </span>
          {archive.length === 0 ? (
            <div className="text-center py-3 text-slate-500 text-xs">
              No prior wire dispatches yet. Advance weeks to build historical market archive.
            </div>
          ) : (
            archive.map((briefing) => (
              <div
                key={briefing.id}
                className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-start justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-mono text-[10px] text-amber-400 font-bold">W{briefing.week}</span>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">{briefing.category}</span>
                    <span className="text-slate-600">·</span>
                    <span className="text-slate-400 text-[11px]">{briefing.affectedSector}</span>
                  </div>
                  <div className="font-semibold text-slate-200 text-xs">{briefing.headline}</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">{briefing.summary}</div>
                </div>

                <div className="shrink-0 pt-0.5">
                  {getSentimentBadge(briefing.sentiment)}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
