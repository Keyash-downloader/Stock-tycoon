import React, { useState } from 'react';
import { 
  Briefcase, 
  Award, 
  CheckCircle, 
  Lock, 
  ChevronRight, 
  Building2, 
  TrendingUp, 
  AlertCircle,
  HelpCircle,
  Percent,
  Sparkles,
  ShieldCheck,
  Send
} from 'lucide-react';
import { CareerStage, SectorMastery, Sector } from '../types/game';

interface CareerDeskProps {
  currentStageIndex: number;
  stages: CareerStage[];
  netWorth: number;
  winRate: number;
  sectorMastery: Record<Sector, SectorMastery>;
  lpApprovalRating: number;
  onPromoteStage: (stageIndex: number) => void;
  onSendInvestorLetter: () => void;
}

interface InterviewState {
  targetStageIndex: number;
  currentQuestionIndex: number;
  score: number;
  completed: boolean;
  passed: boolean;
}

const INTERVIEW_QUESTIONS = [
  {
    question: "A high-beta AI stock you hold drops 18% on a sudden Fed rate hike statement. What is your immediate protocol?",
    options: [
      { text: "Panic dump all shares at market to avoid further drawdown.", correct: false, note: "Amateur reaction. Lock in losses without thesis change." },
      { text: "Assess correlation matrices, delta-hedge with short index futures, and evaluate fundamental earnings revisions.", correct: true, note: "Institutional risk management at its finest." },
      { text: "Tweet angrily at the Fed Chairman from your personal account.", correct: false, note: "Funny, but invites SEC and LP scrutiny." }
    ]
  },
  {
    question: "Your largest LP investor demands 30% annualized returns with zero downside risk. How do you respond?",
    options: [
      { text: "Promise them 50% returns by deploying 50x crypto leverage.", correct: false, note: "Recipe for catastrophic fund blowup." },
      { text: "Educate them on Sharpe ratios, establish strict asymmetric risk bounds, and refuse unhedged tail-risk mandates.", correct: true, note: "Senior fiduciary maturity." },
      { text: "Accept their money and pray for a bull market.", correct: false, note: "Breach of fiduciary duty." }
    ]
  },
  {
    question: "You uncover evidence that a rival hedge fund is aggressively shorting your core biotech position. What is the play?",
    options: [
      { text: "Analyze their borrow fees, estimate their days-to-cover, and coordinate liquidity with sympathetic syndicates for a squeeze.", correct: true, note: "Brilliant Wall Street counter-offensive." },
      { text: "Concede immediately and close out your entire position.", correct: false, note: "Surrendering alpha without a fight." },
      { text: "Call the rival CIO and threaten them with a golf club.", correct: false, note: "Legal liability and PR disaster." }
    ]
  }
];

export const CareerDesk: React.FC<CareerDeskProps> = ({
  currentStageIndex,
  stages,
  netWorth,
  winRate,
  sectorMastery,
  lpApprovalRating,
  onPromoteStage,
  onSendInvestorLetter,
}) => {
  const [interview, setInterview] = useState<InterviewState | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answeredFeedback, setAnsweredFeedback] = useState<string | null>(null);
  const [letterSent, setLetterSent] = useState(false);

  const currentStage = stages[currentStageIndex];
  const nextStage = stages[currentStageIndex + 1];

  const canApplyForNext = nextStage && 
    netWorth >= nextStage.minNetWorthReq && 
    winRate >= nextStage.minWinRateReq;

  const startInterview = (stageIdx: number) => {
    setInterview({
      targetStageIndex: stageIdx,
      currentQuestionIndex: 0,
      score: 0,
      completed: false,
      passed: false,
    });
    setSelectedOption(null);
    setAnsweredFeedback(null);
  };

  const handleSelectAnswer = (optionIdx: number) => {
    if (answeredFeedback !== null) return;
    setSelectedOption(optionIdx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || !interview) return;

    const q = INTERVIEW_QUESTIONS[interview.currentQuestionIndex % INTERVIEW_QUESTIONS.length];
    const isCorrect = q.options[selectedOption].correct;
    const note = q.options[selectedOption].note;
    const newScore = isCorrect ? interview.score + 1 : interview.score;

    setAnsweredFeedback(note);

    setTimeout(() => {
      if (interview.currentQuestionIndex + 1 < 3) {
        setInterview({
          ...interview,
          currentQuestionIndex: interview.currentQuestionIndex + 1,
          score: newScore,
        });
        setSelectedOption(null);
        setAnsweredFeedback(null);
      } else {
        const passed = newScore >= 2;
        setInterview({
          ...interview,
          score: newScore,
          completed: true,
          passed,
        });
        if (passed) {
          onPromoteStage(interview.targetStageIndex);
        }
      }
    }, 1400);
  };

  const handleInvestorLetter = () => {
    setLetterSent(true);
    onSendInvestorLetter();
    setTimeout(() => setLetterSent(false), 3000);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-4 space-y-6">
      {/* Current Title & Firm Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase font-bold tracking-widest text-amber-400">Current Position</span>
              <span className="text-xs text-slate-500">Tier {currentStageIndex + 1} of {stages.length}</span>
            </div>
            <h2 className="text-3xl font-black text-slate-100">{currentStage.title}</h2>
            <p className="text-sm text-slate-300 font-medium mt-0.5">{currentStage.firmName}</p>
            <p className="text-xs text-slate-400 max-w-2xl mt-2 leading-relaxed">{currentStage.description}</p>
          </div>

          <div className="flex items-center gap-4 text-xs tabular-nums bg-slate-950/80 p-4 rounded-xl border border-slate-800">
            <div>
              <span className="text-[10px] text-slate-500 uppercase block">Weekly Salary</span>
              <span className="font-bold text-emerald-400 text-base">{formatCurrency(currentStage.weeklySalary)}</span>
            </div>
            {currentStage.aumManaged > 0 && (
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">AUM Managed</span>
                <span className="font-bold text-sky-400 text-base">{formatCurrency(currentStage.aumManaged)}</span>
              </div>
            )}
            <div>
              <span className="text-[10px] text-slate-500 uppercase block">Max Leverage</span>
              <span className="font-bold text-amber-400 text-base">{currentStage.maxLeverageAllowed}x</span>
            </div>
          </div>
        </div>

        {/* Current Perks Checklist */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-4 text-xs">
          <span className="text-slate-400 font-semibold">Active Privileges:</span>
          {currentStage.perks.map((perk, idx) => (
            <span key={idx} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 text-slate-200 border border-slate-700">
              <CheckCircle className="w-3 h-3 text-emerald-400" />
              {perk}
            </span>
          ))}
        </div>
      </div>

      {/* Institutional Board / LP Relations Desk (if Fund Manager or Titan) */}
      {currentStage.aumManaged > 0 && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-200 text-base flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-400" />
                Institutional LP & Risk Committee Board
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xl">
                Sovereign funds and pension trustees review your risk-adjusted metrics weekly. High approval unlocks bonus inflows; falling below 30% risks capital redemptions!
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-[10px] text-slate-500 uppercase block">LP Approval Rating</span>
                <span className={`text-xl font-black tabular-nums ${lpApprovalRating >= 70 ? 'text-emerald-400' : lpApprovalRating >= 40 ? 'text-amber-400' : 'text-rose-400'}`}>
                  {lpApprovalRating}%
                </span>
              </div>

              <button
                onClick={handleInvestorLetter}
                disabled={letterSent}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs tracking-wide shadow-md transition cursor-pointer flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                {letterSent ? 'Quarterly Memo Dispatched!' : 'Publish Quarterly Investor Memo'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Promotion Ladder / RoleCast Combine */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />
          Wall Street Hierarchy & Partner Auditions
        </h3>

        <div className="space-y-4">
          {stages.map((stage, idx) => {
            const isCurrent = idx === currentStageIndex;
            const isPassed = idx < currentStageIndex;
            const isNext = idx === currentStageIndex + 1;
            const meetsNetWorth = netWorth >= stage.minNetWorthReq;
            const meetsWinRate = winRate >= stage.minWinRateReq;
            const eligible = isNext && meetsNetWorth && meetsWinRate;

            return (
              <div
                key={stage.id}
                className={`p-4 rounded-xl border transition-all ${
                  isCurrent
                    ? 'bg-amber-500/10 border-amber-500/40 shadow-lg shadow-amber-500/5'
                    : isPassed
                    ? 'bg-slate-950/40 border-slate-800 opacity-70'
                    : isNext
                    ? 'bg-slate-950/80 border-slate-700 hover:border-slate-600'
                    : 'bg-slate-950/30 border-slate-900 opacity-50'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center font-bold font-mono text-sm">
                      {isPassed ? (
                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                      ) : isCurrent ? (
                        <span className="text-amber-400">{idx + 1}</span>
                      ) : (
                        <Lock className="w-4 h-4 text-slate-600" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-200 text-sm">{stage.title}</span>
                        {isCurrent && (
                          <span className="text-[10px] bg-amber-500 text-slate-950 font-black px-2 py-0.5 rounded-full">
                            CURRENT SEAT
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-400">{stage.firmName}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-xs tabular-nums">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block">Weekly Draw</span>
                      <span className="font-semibold text-slate-200">{formatCurrency(stage.weeklySalary)}</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block">Req Net Worth</span>
                      <span className={meetsNetWorth ? 'text-emerald-400 font-semibold' : 'text-slate-400'}>
                        {formatCurrency(stage.minNetWorthReq)}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block">Req Win Rate</span>
                      <span className={meetsWinRate ? 'text-emerald-400 font-semibold' : 'text-slate-400'}>
                        {stage.minWinRateReq}%
                      </span>
                    </div>

                    {isNext && (
                      <button
                        onClick={() => startInterview(idx)}
                        disabled={!eligible}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow-md cursor-pointer flex items-center gap-1.5 ${
                          eligible
                            ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        <span>Take Partner Pitch</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sector Mastery Cards */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-slate-100 mb-2 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          Sector Mastery & Industry Specialization
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Trade actively across diverse sectors to gain mastery levels and unlock lower slippage, insider research briefs, and syndicated allocations.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {(Object.keys(sectorMastery) as Sector[]).map((sector) => {
            const mastery = sectorMastery[sector];
            return (
              <div key={sector} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-semibold text-slate-200 text-xs truncate">{sector}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Tier {mastery.level} Specialist
                  </span>
                </div>

                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden mb-1">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
                    style={{ width: `${mastery.exp}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>{mastery.exp}/100 XP</span>
                  <span>{mastery.level >= 3 ? 'Institutional Whale' : 'Analyst Rank'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Partner Interview Modal Mini-Game */}
      {interview && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            {!interview.completed ? (
              <div>
                <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                      Partner Board Interview · Question {interview.currentQuestionIndex + 1} of 3
                    </span>
                    <h3 className="font-black text-slate-100 text-lg">
                      Evaluating: {stages[interview.targetStageIndex].title}
                    </h3>
                  </div>
                  <div className="text-xs font-mono font-bold text-slate-400">
                    Score: {interview.score} / {interview.currentQuestionIndex}
                  </div>
                </div>

                <p className="text-sm text-slate-200 font-medium mb-4 leading-relaxed">
                  "{INTERVIEW_QUESTIONS[interview.currentQuestionIndex % INTERVIEW_QUESTIONS.length].question}"
                </p>

                <div className="space-y-2.5 mb-5">
                  {INTERVIEW_QUESTIONS[interview.currentQuestionIndex % INTERVIEW_QUESTIONS.length].options.map((opt, oIdx) => {
                    const isSelected = selectedOption === oIdx;
                    return (
                      <button
                        key={oIdx}
                        disabled={answeredFeedback !== null}
                        onClick={() => handleSelectAnswer(oIdx)}
                        className={`w-full text-left p-3.5 rounded-xl border text-xs font-medium transition cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500/15 border-amber-500 text-slate-100'
                            : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        {opt.text}
                      </button>
                    );
                  })}
                </div>

                {answeredFeedback && (
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-700 text-xs text-amber-300 font-mono mb-4 animate-fade-in">
                    {answeredFeedback}
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={selectedOption === null || answeredFeedback !== null}
                    className={`px-6 py-2.5 rounded-xl font-bold text-xs tracking-wider uppercase transition cursor-pointer ${
                      selectedOption !== null && answeredFeedback === null
                        ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    Submit Thesis Answer
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                {interview.passed ? (
                  <>
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3 border border-emerald-500/30">
                      <Award className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-black text-slate-100">PROMOTION APPROVED!</h3>
                    <p className="text-xs text-slate-300 mt-2 max-w-sm mx-auto leading-relaxed">
                      The managing committee was impressed by your quantitative discipline. You are officially appointed as <strong>{stages[interview.targetStageIndex].title}</strong>!
                    </p>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-3 border border-rose-500/30">
                      <AlertCircle className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-black text-slate-100">PROMOTION DEFERRED</h3>
                    <p className="text-xs text-slate-300 mt-2 max-w-sm mx-auto leading-relaxed">
                      Your risk answers raised doubts with the senior partners. Strengthen your trading win rate and try the interview again next quarter.
                    </p>
                  </>
                )}

                <button
                  onClick={() => setInterview(null)}
                  className="mt-6 px-8 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs tracking-wider cursor-pointer"
                >
                  Return to Desk
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
