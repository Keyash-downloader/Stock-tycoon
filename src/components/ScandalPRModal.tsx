import React, { useState } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  Flame, 
  Gavel, 
  ChevronRight, 
  Tv, 
  FileText, 
  DollarSign, 
  Scale, 
  HelpCircle,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { Scandal, ScandalChoice } from '../types/game';

interface ScandalPRModalProps {
  scandal: Scandal;
  cash: number;
  onResolveChoice: (choice: ScandalChoice, success: boolean) => void;
}

export const ScandalPRModal: React.FC<ScandalPRModalProps> = ({
  scandal,
  cash,
  onResolveChoice,
}) => {
  const [selectedChoiceIdx, setSelectedChoiceIdx] = useState<number | null>(null);
  const [resolutionState, setResolutionState] = useState<{
    resolved: boolean;
    success: boolean;
    text: string;
  } | null>(null);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleSelect = (idx: number) => {
    if (resolutionState) return;
    setSelectedChoiceIdx(idx);
  };

  const handleConfirm = () => {
    if (selectedChoiceIdx === null || resolutionState) return;
    const choice = scandal.choices[selectedChoiceIdx];
    const success = Math.random() <= choice.oddsOfSuccess;
    const text = success ? choice.resolutionText : (choice.failureText || choice.resolutionText);

    setResolutionState({
      resolved: true,
      success,
      text,
    });

    setTimeout(() => {
      onResolveChoice(choice, success);
    }, 2800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-rose-500/40 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative overflow-hidden select-none animate-in fade-in zoom-in-95 duration-200">
        {/* Glowing emergency accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-500 via-amber-500 to-rose-500 animate-pulse" />

        {!resolutionState ? (
          <div>
            {/* Header */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-rose-400 flex items-center gap-1">
                  <Flame className="w-3 h-3" /> BREAKING CRISIS · PR & REGULATORY ARCS
                </span>
                <h3 className="text-xl font-black text-slate-100">{scandal.title}</h3>
              </div>
            </div>

            {/* Premise & Headline */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 mb-4">
              <span className="text-xs font-bold text-rose-400 block mb-1">
                {scandal.headline}
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {scandal.premise}
              </p>
            </div>

            {/* PR Advisor Brief */}
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 mb-4 italic flex items-center gap-2">
              <Scale className="w-4 h-4 text-amber-400 shrink-0" />
              <span><strong>General Counsel Brief:</strong> {scandal.prAdvisorBrief}</span>
            </div>

            {/* 6 Crisis Options */}
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Select Defense & PR Strategy (6 Options)
            </span>

            <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
              {scandal.choices.map((choice, idx) => {
                const isSelected = selectedChoiceIdx === idx;
                const canAfford = cash >= choice.cost;

                return (
                  <div
                    key={idx}
                    onClick={() => canAfford && handleSelect(idx)}
                    className={`p-3 rounded-xl border text-xs transition cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-rose-500/15 border-rose-500 shadow-md shadow-rose-500/10'
                        : canAfford
                        ? 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                        : 'bg-slate-950/20 border-slate-900 opacity-40 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-medium text-slate-200">{choice.text}</span>
                      {choice.cost > 0 && (
                        <span className="text-xs font-mono font-bold text-amber-400 shrink-0">
                          {formatCurrency(choice.cost)}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 mt-2 pt-2 border-t border-slate-800/60 text-[10px] font-mono tabular-nums">
                      <span className={choice.secHeatChange <= 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                        SEC Heat: {choice.secHeatChange > 0 ? `+${choice.secHeatChange}%` : `${choice.secHeatChange}%`}
                      </span>
                      <span className={choice.publicSentimentChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                        Sentiment: {choice.publicSentimentChange >= 0 ? `+${choice.publicSentimentChange}%` : `${choice.publicSentimentChange}%`}
                      </span>
                      <span className="text-slate-500 ml-auto">
                        Est Success: {Math.round(choice.oddsOfSuccess * 100)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Confirm Action */}
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                {selectedChoiceIdx !== null ? 'Strategy selected. Ready to deploy.' : 'Choose your response carefully.'}
              </span>

              <button
                onClick={handleConfirm}
                disabled={selectedChoiceIdx === null}
                className="px-6 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-bold text-xs tracking-wider uppercase transition cursor-pointer shadow-lg shadow-rose-500/20 flex items-center gap-1.5"
              >
                <span>Deploy Strategy</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Resolution Screen */
          <div className="text-center py-6 animate-in zoom-in-95">
            {resolutionState.success ? (
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-8 h-8" />
              </div>
            )}

            <h3 className="text-2xl font-black text-slate-100 mb-2">
              {resolutionState.success ? 'CRISIS AVERTED' : 'COMPLICATIONS ARISE'}
            </h3>

            <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
              {resolutionState.text}
            </p>

            <div className="mt-4 text-xs text-slate-500 font-mono animate-pulse">
              Updating regulatory records and financial standing...
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
