import React from 'react';
import { Trophy, Crown, Flame, Award, TrendingUp, Users, HeartHandshake } from 'lucide-react';
import { Rival } from '../types/game';

interface WallRichLeaderboardProps {
  playerNetWorth: number;
  playerName: string;
  firmTitle: string;
  rivals: Rival[];
  partnerName: string | null;
  partnerNetWorth: number;
  isMarried: boolean;
  powerCoupleMoniker: string | null;
}

export const WallRichLeaderboard: React.FC<WallRichLeaderboardProps> = ({
  playerNetWorth,
  playerName,
  firmTitle,
  rivals,
  partnerName,
  partnerNetWorth,
  isMarried,
  powerCoupleMoniker,
}) => {
  const effectivePlayerNetWorth = isMarried ? playerNetWorth + partnerNetWorth : playerNetWorth;

  // Combine player with rivals and sort descending by net worth
  const allEntries = [
    {
      id: 'player',
      name: isMarried && partnerName ? `${playerName} & ${partnerName}` : playerName,
      moniker: isMarried && powerCoupleMoniker ? powerCoupleMoniker : firmTitle,
      firm: isMarried ? 'Joint Power Empire' : firmTitle,
      avatar: isMarried ? '👑' : '📈',
      netWorth: effectivePlayerNetWorth,
      aum: 0,
      strategy: 'Quantitative Momentum & Asymmetric Options',
      weeklyQuote: '"I don\'t just participate in markets. I dictate them."',
      isPlayer: true,
      statusBadge: isMarried ? 'Power Couple Syndicate' : 'Rising Titan',
    },
    ...rivals.map((r) => ({ ...r, isPlayer: false })),
  ].sort((a, b) => b.netWorth - a.netWorth);

  const playerRank = allEntries.findIndex((e) => e.isPlayer) + 1;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-4 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/30 to-slate-900 border border-amber-500/30 rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span className="text-xs uppercase font-bold tracking-widest text-amber-400">
                Official Wall Street Financial Standings
              </span>
            </div>
            <h2 className="text-3xl font-black text-slate-100">THE WALLRICH 400</h2>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Ranked by audited global net worth. Out-trade the apex raiders of high finance to claim the #1 Sovereign Spot on the leaderboard.
            </p>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl text-center tabular-nums">
            <span className="text-[10px] text-slate-500 uppercase block font-bold">Your Standing</span>
            <div className="text-3xl font-black text-amber-400 flex items-center justify-center gap-1.5">
              {playerRank === 1 ? <Crown className="w-6 h-6 text-yellow-400" /> : null}
              #{playerRank}
            </div>
            <span className="text-xs font-semibold text-slate-300">
              {formatCurrency(effectivePlayerNetWorth)}
            </span>
          </div>
        </div>

        {isMarried && (
          <div className="mt-4 pt-3 border-t border-amber-500/20 flex items-center gap-2 text-xs text-amber-300">
            <HeartHandshake className="w-4 h-4 text-pink-400" />
            <span>
              <strong>Power Couple Synergy Active:</strong> Net worth reflects combined fortunes of {playerName} and {partnerName} ({powerCoupleMoniker}).
            </span>
          </div>
        )}
      </div>

      {/* Leaderboard Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            Billionaire Honor Roll
          </span>
          <span className="text-[11px] text-slate-500">Updated weekly with live mark-to-market valuations</span>
        </div>

        <div className="divide-y divide-slate-800/80">
          {allEntries.map((entry, idx) => {
            const rank = idx + 1;
            const isTop3 = rank <= 3;

            return (
              <div
                key={entry.id}
                className={`p-4 transition-all flex flex-wrap items-center justify-between gap-4 ${
                  entry.isPlayer
                    ? 'bg-amber-500/15 border-l-4 border-amber-400'
                    : 'hover:bg-slate-800/30'
                }`}
              >
                {/* Left: Rank & Avatar & Details */}
                <div className="flex items-center gap-4">
                  <div className="w-8 flex items-center justify-center font-mono font-black text-base tabular-nums">
                    {rank === 1 ? (
                      <Crown className="w-6 h-6 text-yellow-400" />
                    ) : rank === 2 ? (
                      <span className="text-slate-300">#2</span>
                    ) : rank === 3 ? (
                      <span className="text-amber-600">#3</span>
                    ) : (
                      <span className="text-slate-500">#{rank}</span>
                    )}
                  </div>

                  <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-2xl shadow-inner">
                    {entry.avatar}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`font-black text-base ${entry.isPlayer ? 'text-amber-300' : 'text-slate-100'}`}>
                        {entry.name}
                      </span>
                      {entry.isPlayer && (
                        <span className="text-[10px] bg-amber-500 text-slate-950 font-black px-2 py-0.5 rounded-full">
                          YOU
                        </span>
                      )}
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {entry.statusBadge}
                      </span>
                    </div>

                    <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                      <span className="font-semibold text-slate-300">{entry.firm}</span>
                      <span>•</span>
                      <span className="italic text-slate-500 truncate max-w-md">{entry.weeklyQuote}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Net Worth & Stats */}
                <div className="text-right tabular-nums">
                  <div className="text-xl font-black text-slate-100 tracking-tight">
                    {formatCurrency(entry.netWorth)}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {entry.aum > 0 ? `AUM: ${formatCurrency(entry.aum)}` : 'Personal & Fund Equity'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
