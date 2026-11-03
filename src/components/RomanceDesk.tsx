import React, { useState } from 'react';
import { 
  Heart, 
  Sparkles, 
  Crown, 
  Wine, 
  Gift, 
  CheckCircle, 
  MessageCircle, 
  DollarSign,
  TrendingUp,
  HeartHandshake
} from 'lucide-react';
import { RomancePartner } from '../types/game';

interface RomanceDeskProps {
  partners: RomancePartner[];
  activePartnerId: string | null;
  isMarried: boolean;
  cash: number;
  onGoOnDate: (partnerId: string, cost: number, affectionGain: number) => void;
  onGiveGift: (partnerId: string, cost: number, affectionGain: number) => void;
  onPropose: (partnerId: string) => void;
  onSelectPartner: (partnerId: string) => void;
}

export const RomanceDesk: React.FC<RomanceDeskProps> = ({
  partners,
  activePartnerId,
  isMarried,
  cash,
  onGoOnDate,
  onGiveGift,
  onPropose,
  onSelectPartner,
}) => {
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>(activePartnerId || partners[0]?.id || 'elena');

  const currentPartner = partners.find((p) => p.id === selectedPartnerId) || partners[0];
  const isSelectedActive = activePartnerId === currentPartner.id;

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
      <div className="bg-gradient-to-r from-slate-900 via-pink-950/30 to-slate-900 border border-pink-500/30 rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Heart className="w-5 h-5 text-pink-400" />
              <span className="text-xs uppercase font-bold tracking-widest text-pink-400">
                High Society & Power Couples
              </span>
            </div>
            <h2 className="text-3xl font-black text-slate-100">WALL STREET ROMANCE</h2>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Court elite venture capitalists, media titans, and tech founders. Advance from discreet dinners to a high-society marriage that combines your fortunes on the WallRich 400.
            </p>
          </div>

          {isMarried && (
            <div className="bg-slate-950/80 border border-pink-500/40 p-4 rounded-xl text-center tabular-nums">
              <span className="text-[10px] text-pink-400 uppercase block font-bold flex items-center justify-center gap-1">
                <Crown className="w-3.5 h-3.5" /> Official Power Couple
              </span>
              <div className="text-xl font-black text-slate-100 mt-0.5">
                {currentPartner.powerCoupleMoniker}
              </div>
              <span className="text-xs text-emerald-400 font-semibold">
                +{formatCurrency(currentPartner.netWorth)} Joint Net Worth
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main Romance Suite */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Suitors Selection (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block px-1">
            Eligible High-Society Suitors
          </span>

          {partners.map((partner) => {
            const isSelected = partner.id === selectedPartnerId;
            const isCurrentActive = partner.id === activePartnerId;

            return (
              <div
                key={partner.id}
                onClick={() => {
                  setSelectedPartnerId(partner.id);
                  if (!activePartnerId && !isMarried) {
                    onSelectPartner(partner.id);
                  }
                }}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'bg-pink-500/15 border-pink-500/50 shadow-lg shadow-pink-500/5'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-2xl shadow-inner">
                    {partner.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-100 text-sm">{partner.name}</span>
                      {isCurrentActive && isMarried && (
                        <span className="text-[10px] bg-pink-500 text-slate-950 font-bold px-1.5 py-0.2 rounded-full">
                          SPOUSE
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-400 block truncate max-w-[150px]">{partner.profession}</span>
                    <span className="text-[10px] text-pink-400 font-mono font-medium">{partner.relationshipStage} · {partner.affection}% Love</span>
                  </div>
                </div>

                <div className="text-right tabular-nums">
                  <span className="text-xs font-bold text-slate-200 block">
                    {formatCurrency(partner.netWorth)}
                  </span>
                  <span className="text-[10px] text-slate-500">Net Worth</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Selected Suitor Dossier & Date/Proposal Actions (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            {/* Top Partner Details */}
            <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-4xl shadow-inner">
                  {currentPartner.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-2xl font-black text-slate-100">{currentPartner.name}</h3>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30 font-bold">
                      {currentPartner.relationshipStage}
                    </span>
                  </div>
                  <span className="text-sm text-slate-300 font-medium block mt-0.5">{currentPartner.profession}</span>
                  <span className="text-xs text-slate-500">Personal Net Worth: <strong className="text-emerald-400">{formatCurrency(currentPartner.netWorth)}</strong></span>
                </div>
              </div>

              {/* Affection Progress Meter */}
              <div className="w-full sm:w-48 bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                <div className="flex items-center justify-between mb-1 font-semibold">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400" /> Affection
                  </span>
                  <span className="text-pink-300">{currentPartner.affection}/100</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-pink-500 to-rose-400 transition-all duration-300"
                    style={{ width: `${currentPartner.affection}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Quote / Personality */}
            <div className="my-4 p-4 rounded-xl bg-slate-950/70 border border-slate-800/80">
              <p className="text-xs italic text-slate-300 leading-relaxed font-serif">
                {currentPartner.dialogue}
              </p>
              <div className="mt-3 pt-2 border-t border-slate-800 text-xs text-slate-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span><strong>Power Couple Synergy Perk:</strong> {currentPartner.perk}</span>
              </div>
            </div>
          </div>

          {/* Interaction Actions */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Courting Interactions
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Lavish Dinner Date */}
              <button
                onClick={() => onGoOnDate(currentPartner.id, 8000, 15)}
                disabled={cash < 8000}
                className="p-3.5 rounded-xl bg-slate-950 hover:bg-slate-800 disabled:opacity-50 border border-slate-800 text-left transition cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 text-pink-400 font-bold text-xs mb-1">
                    <Wine className="w-4 h-4" />
                    Lavish Dinner at Le Bernardin
                  </div>
                  <span className="text-[11px] text-slate-400 block">
                    Caviar, vintage Dom Pérignon, and financial pillow talk.
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs font-mono">
                  <span className="text-emerald-400 font-bold">$8,000</span>
                  <span className="text-pink-400">+15% Affection</span>
                </div>
              </button>

              {/* Gift Luxury Jewelry */}
              <button
                onClick={() => onGiveGift(currentPartner.id, 45000, 25)}
                disabled={cash < 45000}
                className="p-3.5 rounded-xl bg-slate-950 hover:bg-slate-800 disabled:opacity-50 border border-slate-800 text-left transition cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-xs mb-1">
                    <Gift className="w-4 h-4" />
                    Cartier High Jewelry Gift
                  </div>
                  <span className="text-[11px] text-slate-400 block">
                    Emerald pendant delivered in a private armored motorcade.
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs font-mono">
                  <span className="text-emerald-400 font-bold">$45,000</span>
                  <span className="text-amber-400">+25% Affection</span>
                </div>
              </button>

              {/* Marriage Proposal */}
              <button
                onClick={() => onPropose(currentPartner.id)}
                disabled={currentPartner.affection < 80 || isMarried || cash < 250000}
                className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                  currentPartner.affection >= 80 && !isMarried && cash >= 250000
                    ? 'bg-gradient-to-br from-pink-500/20 to-purple-500/20 border-pink-500/50 shadow-lg shadow-pink-500/10'
                    : 'bg-slate-950 border-slate-800 opacity-60 cursor-not-allowed'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 text-yellow-400 font-bold text-xs mb-1">
                    <Crown className="w-4 h-4" />
                    {isMarried ? 'Already Married' : 'Propose Marriage ($250k Ring)'}
                  </div>
                  <span className="text-[11px] text-slate-400 block">
                    10-carat Harry Winston diamond. Merges fortunes permanently!
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs font-mono">
                  <span className="text-emerald-400 font-bold">$250,000</span>
                  <span className="text-yellow-400 font-bold">Needs 80% Love</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
