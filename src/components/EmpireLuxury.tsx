import React, { useState } from 'react';
import { 
  Landmark, 
  Sparkles, 
  Check, 
  Watch, 
  Car, 
  Building, 
  Send, 
  Anchor, 
  Users, 
  Shield, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownLeft,
  Flame,
  Zap
} from 'lucide-react';
import { LuxuryItem } from '../types/game';

interface EmpireLuxuryProps {
  cash: number;
  netWorth: number;
  highYieldSavings: number;
  marginDebt: number;
  prestige: number;
  luxuryItems: LuxuryItem[];
  onBuyLuxuryItem: (itemId: string) => void;
  onDepositSavings: (amount: number) => void;
  onWithdrawSavings: (amount: number) => void;
  onBorrowMargin: (amount: number) => void;
  onRepayMargin: (amount: number) => void;
}

export const EmpireLuxury: React.FC<EmpireLuxuryProps> = ({
  cash,
  netWorth,
  highYieldSavings,
  marginDebt,
  prestige,
  luxuryItems,
  onBuyLuxuryItem,
  onDepositSavings,
  onWithdrawSavings,
  onBorrowMargin,
  onRepayMargin,
}) => {
  const [activeCategory, setActiveCategory] = useState<'ALL' | 'WATCH' | 'VEHICLE' | 'ESTATE' | 'AIRCRAFT' | 'YACHT' | 'STAFF'>('ALL');
  const [bankTab, setBankTab] = useState<'SAVINGS' | 'MARGIN'>('SAVINGS');
  const [bankInputAmount, setBankInputAmount] = useState<number>(10000);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Watch': return <Watch className="w-5 h-5 text-amber-400" />;
      case 'Car': return <Car className="w-5 h-5 text-sky-400" />;
      case 'Building': return <Building className="w-5 h-5 text-indigo-400" />;
      case 'Send': return <Send className="w-5 h-5 text-purple-400" />;
      case 'Anchor': return <Anchor className="w-5 h-5 text-cyan-400" />;
      case 'Users': return <Users className="w-5 h-5 text-emerald-400" />;
      case 'Shield': return <Shield className="w-5 h-5 text-rose-400" />;
      default: return <Sparkles className="w-5 h-5 text-yellow-400" />;
    }
  };

  const filteredItems = activeCategory === 'ALL'
    ? luxuryItems
    : luxuryItems.filter((i) => i.category === activeCategory);

  const totalAssetsValue = luxuryItems
    .filter((i) => i.purchased)
    .reduce((acc, curr) => acc + curr.price, 0);

  const totalWeeklyUpkeep = luxuryItems
    .filter((i) => i.purchased)
    .reduce((acc, curr) => acc + curr.weeklyUpkeep, 0);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-4 space-y-6">
      {/* Empire Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Luxury Assets Value</span>
          <div className="mt-2">
            <span className="text-2xl font-black text-slate-100 tabular-nums">{formatCurrency(totalAssetsValue)}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              {luxuryItems.filter((i) => i.purchased).length} of {luxuryItems.length} acquired
            </span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">High-Yield Treasury Vault</span>
          <div className="mt-2">
            <span className="text-2xl font-black text-emerald-400 tabular-nums">{formatCurrency(highYieldSavings)}</span>
            <span className="text-[10px] text-emerald-500 block mt-0.5">Earning ~5.2% APY paid weekly</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Margin Credit Facility</span>
          <div className="mt-2">
            <span className="text-2xl font-black text-rose-400 tabular-nums">{formatCurrency(marginDebt)}</span>
            <span className="text-[10px] text-rose-500 block mt-0.5">6.0% borrow fee</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Weekly Empire Upkeep</span>
          <div className="mt-2">
            <span className="text-2xl font-black text-amber-400 tabular-nums">{formatCurrency(totalWeeklyUpkeep)}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Deducted each trading week</span>
          </div>
        </div>
      </div>

      {/* Wall Street Treasury & Banking Desk */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-800">
          <div>
            <h3 className="font-bold text-slate-100 text-lg flex items-center gap-2">
              <Landmark className="w-5 h-5 text-emerald-400" />
              Private Wealth Treasury Desk
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Secure cash in the interest vault or draw immediate credit lines for opportunistic market moves.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setBankTab('SAVINGS')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                bankTab === 'SAVINGS' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              High-Yield Vault
            </button>
            <button
              onClick={() => setBankTab('MARGIN')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                bankTab === 'MARGIN' ? 'bg-rose-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Margin Credit Facility
            </button>
          </div>
        </div>

        {/* Banking Action station */}
        <div className="max-w-xl mx-auto space-y-4">
          <div>
            <label className="text-xs text-slate-400 font-semibold mb-1 block">Transaction Amount ($)</label>
            <input
              type="number"
              min="1000"
              step="5000"
              value={bankInputAmount}
              onChange={(e) => setBankInputAmount(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 font-bold tabular-nums text-base focus:outline-none focus:border-emerald-500"
            />
            <div className="flex items-center gap-2 mt-2">
              {[5000, 25000, 100000, 500000].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setBankInputAmount(amt)}
                  className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  +{amt >= 1000000 ? `${amt / 1000000}M` : `${amt / 1000}k`}
                </button>
              ))}
            </div>
          </div>

          {bankTab === 'SAVINGS' ? (
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => onDepositSavings(bankInputAmount)}
                disabled={bankInputAmount <= 0 || bankInputAmount > cash}
                className="py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-bold text-xs tracking-wider uppercase transition cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20"
              >
                <ArrowDownLeft className="w-4 h-4" />
                Deposit to Vault
              </button>
              <button
                onClick={() => onWithdrawSavings(bankInputAmount)}
                disabled={bankInputAmount <= 0 || bankInputAmount > highYieldSavings}
                className="py-3 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:bg-slate-900 disabled:text-slate-600 text-slate-200 font-bold text-xs tracking-wider uppercase transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <ArrowUpRight className="w-4 h-4" />
                Withdraw to Cash
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => onBorrowMargin(bankInputAmount)}
                disabled={bankInputAmount <= 0}
                className="py-3 rounded-xl bg-rose-500 hover:bg-rose-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-bold text-xs tracking-wider uppercase transition cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-rose-500/20"
              >
                <ArrowDownLeft className="w-4 h-4" />
                Draw Margin Credit
              </button>
              <button
                onClick={() => onRepayMargin(bankInputAmount)}
                disabled={bankInputAmount <= 0 || marginDebt <= 0 || bankInputAmount > cash}
                className="py-3 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:bg-slate-900 disabled:text-slate-600 text-slate-200 font-bold text-xs tracking-wider uppercase transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <ArrowUpRight className="w-4 h-4" />
                Repay Debt
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Luxury Collection Catalog */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="font-bold text-slate-100 text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              The Billionaire Asset Showcase
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Acquire luxury artifacts to slash stress, skyrocket social prestige, and unlock institutional respect.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {['ALL', 'WATCH', 'VEHICLE', 'ESTATE', 'AIRCRAFT', 'YACHT', 'STAFF'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat as typeof activeCategory)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Item Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => {
            const canAfford = cash >= item.price;

            return (
              <div
                key={item.id}
                className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                  item.purchased
                    ? 'bg-amber-500/10 border-amber-500/40 shadow-lg shadow-amber-500/5'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center border border-slate-800">
                      {getIcon(item.iconName)}
                    </div>
                    {item.purchased ? (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Check className="w-3 h-3" /> OWNED
                      </span>
                    ) : (
                      <span className="text-xs font-mono font-bold text-amber-400 tabular-nums">
                        {formatCurrency(item.price)}
                      </span>
                    )}
                  </div>

                  <h4 className="font-bold text-slate-200 text-sm">{item.name}</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{item.perkDescription}</p>

                  <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-800/80 text-[11px] tabular-nums">
                    <span className="text-amber-400 font-semibold">+{item.prestigeBonus} Prestige</span>
                    <span className="text-emerald-400 font-semibold">-{item.stressReduction}% Stress</span>
                    <span className="text-slate-500 font-mono ml-auto">{formatCurrency(item.weeklyUpkeep)}/wk</span>
                  </div>
                </div>

                <div className="mt-4 pt-2">
                  {!item.purchased ? (
                    <button
                      onClick={() => onBuyLuxuryItem(item.id)}
                      disabled={!canAfford}
                      className={`w-full py-2.5 rounded-xl font-bold text-xs tracking-wider uppercase transition cursor-pointer flex items-center justify-center gap-1.5 ${
                        canAfford
                          ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                          : 'bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed'
                      }`}
                    >
                      {canAfford ? `Acquire for ${formatCurrency(item.price)}` : 'Insufficient Funds'}
                    </button>
                  ) : (
                    <div className="text-center py-2 text-xs font-medium text-emerald-400">
                      Active In Your Empire Collection
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
