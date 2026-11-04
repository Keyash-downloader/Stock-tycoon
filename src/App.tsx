/**
 * Spotlight Stocks: Market Titan
 * Wall Street Career & Life Simulator
 */

import React, { useState, useEffect, useCallback } from 'react';
import { TitleScreen } from './components/TitleScreen';
import { HeaderHUD } from './components/HeaderHUD';
import { TradingTerminal } from './components/TradingTerminal';
import { CareerDesk } from './components/CareerDesk';
import { EmpireLuxury } from './components/EmpireLuxury';
import { WallRichLeaderboard } from './components/WallRichLeaderboard';
import { FinTwitFeed } from './components/FinTwitFeed';
import { RomanceDesk } from './components/RomanceDesk';
import { ScandalPRModal } from './components/ScandalPRModal';
import { WeekSummaryModal } from './components/WeekSummaryModal';
import { GameOverModal } from './components/GameOverModal';
import { PriceAlertToast } from './components/PriceAlertToast';
import { MultiplayerArena } from './components/MultiplayerArena';
import { StorePublishModal } from './components/StorePublishModal';

import { 
  TraderProfile, 
  Stock, 
  Position, 
  OptionContract, 
  SectorMastery, 
  Sector, 
  ScandalChoice,
  MarketEvent,
  NetWorthSnapshot,
  MarketBriefing,
  PriceAlert,
  PriceAlertNotification
} from './types/game';

import { 
  INITIAL_STOCKS, 
  CAREER_STAGES, 
  INITIAL_RIVALS, 
  LUXURY_ITEMS, 
  INITIAL_SCANDALS, 
  INITIAL_ROMANCE_PARTNERS, 
  INITIAL_FINTWIT_POSTS,
  INITIAL_BRIEFING,
  BRIEFING_TEMPLATES
} from './data/initialData';

import { sounds } from './audio/soundEffects';

const INITIAL_NET_WORTH_HISTORY: NetWorthSnapshot[] = [
  { week: 1, netWorth: 5000, cash: 5000, portfolioValue: 0 },
  { week: 2, netWorth: 5600, cash: 4200, portfolioValue: 1400 },
  { week: 3, netWorth: 6100, cash: 3800, portfolioValue: 2300 },
  { week: 4, netWorth: 5900, cash: 3500, portfolioValue: 2400 },
  { week: 5, netWorth: 6800, cash: 4000, portfolioValue: 2800 },
  { week: 6, netWorth: 7900, cash: 4500, portfolioValue: 3400 },
  { week: 7, netWorth: 8500, cash: 5200, portfolioValue: 3300 },
  { week: 8, netWorth: 9600, cash: 6000, portfolioValue: 3600 },
  { week: 9, netWorth: 11200, cash: 7500, portfolioValue: 3700 },
  { week: 10, netWorth: 12800, cash: 8800, portfolioValue: 4000 },
  { week: 11, netWorth: 14100, cash: 10200, portfolioValue: 3900 },
  { week: 12, netWorth: 15000, cash: 15000, portfolioValue: 0 },
];

const INITIAL_PROFILE: TraderProfile = {
  name: 'Alex Vance',
  firmTitle: 'Bedroom Day Trader',
  cash: 15000,
  netWorth: 15000,
  portfolioValue: 0,
  week: 12,
  year: 1,
  stress: 15,
  secHeat: 5,
  prestige: 50,
  careerStageIndex: 0,
  highYieldSavings: 0,
  marginDebt: 0,
  activeCrisis: null,
  romancePartnerId: null,
  isMarried: false,
  totalTrades: 0,
  profitableTrades: 0,
  peakNetWorth: 15000,
  lpApprovalRating: 85,
  gameStatus: 'TITLE',
  netWorthHistory: INITIAL_NET_WORTH_HISTORY,
};

const INITIAL_SECTOR_MASTERY: Record<Sector, SectorMastery> = {
  'Big Tech & AI': { sector: 'Big Tech & AI', exp: 20, level: 1 },
  'BioPharma & Genomics': { sector: 'BioPharma & Genomics', exp: 10, level: 1 },
  'Energy & Commodities': { sector: 'Energy & Commodities', exp: 15, level: 1 },
  'Defense & Aerospace': { sector: 'Defense & Aerospace', exp: 10, level: 1 },
  'Consumer & Luxury': { sector: 'Consumer & Luxury', exp: 5, level: 1 },
  'FinTech & Degens': { sector: 'FinTech & Degens', exp: 30, level: 1 },
};

const MARKET_NEWS_POOL: MarketEvent[] = [
  {
    id: 'evt_1',
    headline: 'AI Hyperscalers Announce Sovereign Superclusters',
    sector: 'Big Tech & AI',
    impactPercentage: 0.12,
    description: 'Demand for next-gen silicon reaches unprecedented fever pitch. Chip suppliers jump.'
  },
  {
    id: 'evt_2',
    headline: 'OPEC+ Surprise Production Cuts',
    sector: 'Energy & Commodities',
    impactPercentage: 0.08,
    description: 'Global crude inventories tighten sharply, driving oil majors to fresh weekly highs.'
  },
  {
    id: 'evt_3',
    headline: 'Reddit Forum Targets Heavily Shorted Float',
    sector: 'FinTech & Degens',
    impactPercentage: 0.35,
    description: 'A massive gamma squeeze triggers forced liquidations across institutional short sellers.'
  },
  {
    id: 'evt_4',
    headline: 'Federal Reserve Holds Rates Steady at FOMC',
    sector: 'ALL',
    impactPercentage: 0.04,
    description: 'Chairman Powell indicates monetary policy remains calibrated for a soft landing.'
  },
  {
    id: 'evt_5',
    headline: 'FDA Issues Fast-Track Status for Oncology Therapy',
    sector: 'BioPharma & Genomics',
    impactPercentage: 0.28,
    description: 'Clinical pipeline breakthrough sends biotech speculative volume soaring.'
  }
];

export default function App() {
  const [profile, setProfile] = useState<TraderProfile>(INITIAL_PROFILE);
  const [stocks, setStocks] = useState<Stock[]>(INITIAL_STOCKS);
  const [positions, setPositions] = useState<Position[]>([]);
  const [options, setOptions] = useState<OptionContract[]>([]);
  const [rivals, setRivals] = useState(INITIAL_RIVALS);
  const [luxuryItems, setLuxuryItems] = useState(LUXURY_ITEMS);
  const [scandals, setScandals] = useState(INITIAL_SCANDALS);
  const [finTwitPosts, setFinTwitPosts] = useState(INITIAL_FINTWIT_POSTS);
  const [romancePartners, setRomancePartners] = useState(INITIAL_ROMANCE_PARTNERS);
  const [sectorMastery, setSectorMastery] = useState<Record<Sector, SectorMastery>>(INITIAL_SECTOR_MASTERY);
  
  const [activeTab, setActiveTab] = useState<'TRADING' | 'CAREER' | 'EMPIRE' | 'WALLRICH' | 'STREETX' | 'ROMANCE' | 'ARENA'>('TRADING');
  const [currentBriefing, setCurrentBriefing] = useState<MarketBriefing>(INITIAL_BRIEFING);
  const [briefingArchive, setBriefingArchive] = useState<MarketBriefing[]>([]);
  const [activeScandal, setActiveScandal] = useState<typeof INITIAL_SCANDALS[0] | null>(null);
  
  // Price Alerts State
  const [alerts, setAlerts] = useState<PriceAlert[]>([
    {
      id: 'alert_nvx_500',
      symbol: 'NVX',
      targetPrice: 500,
      condition: 'ABOVE',
      createdWeek: 12,
      triggered: false,
    },
    {
      id: 'alert_cure_50',
      symbol: 'CURE',
      targetPrice: 50,
      condition: 'ABOVE',
      createdWeek: 12,
      triggered: false,
    },
  ]);
  const [alertNotifications, setAlertNotifications] = useState<PriceAlertNotification[]>([]);
  const [selectedStockSymbol, setSelectedStockSymbol] = useState<string>('NVX');

  const [weekSummary, setWeekSummary] = useState<{
    tradingPnL: number;
    salaryEarned: number;
    savingsInterestEarned: number;
    dividendsEarned: number;
    upkeepDeducted: number;
    marginInterestDeducted: number;
    marketEvent: MarketEvent | null;
  } | null>(null);

  const [isMuted, setIsMuted] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    sounds.setMuted(next);
  };

  // Recalculate portfolio value and net worth dynamically
  useEffect(() => {
    let equityValue = 0;
    positions.forEach((pos) => {
      const stock = stocks.find((s) => s.symbol === pos.symbol);
      const currentPrice = stock ? stock.price : pos.averagePrice;
      const nominal = pos.shares * currentPrice;
      const pnl = pos.type === 'LONG'
        ? (currentPrice - pos.averagePrice) * pos.shares * pos.leverage
        : (pos.averagePrice - currentPrice) * pos.shares * pos.leverage;
      equityValue += Math.max(0, (pos.shares * pos.averagePrice) / pos.leverage + pnl);
    });

    let optionsValue = 0;
    options.forEach((opt) => {
      const stock = stocks.find((s) => s.symbol === opt.symbol);
      if (stock) {
        const intrinsic = opt.type === 'CALL'
          ? Math.max(0, stock.price - opt.strikePrice)
          : Math.max(0, opt.strikePrice - stock.price);
        optionsValue += intrinsic * opt.contracts * 100;
      }
    });

    const totalPortfolio = Math.round(equityValue + optionsValue);
    const luxuryAssetValue = luxuryItems.filter((i) => i.purchased).reduce((a, b) => a + b.price, 0);
    const totalNetWorth = Math.round(
      profile.cash + totalPortfolio + profile.highYieldSavings + luxuryAssetValue - profile.marginDebt
    );

    setProfile((prev) => ({
      ...prev,
      portfolioValue: totalPortfolio,
      netWorth: totalNetWorth,
      peakNetWorth: Math.max(prev.peakNetWorth, totalNetWorth),
    }));
  }, [stocks, positions, options, profile.cash, profile.highYieldSavings, profile.marginDebt, luxuryItems]);

  // Execute Equity Trade
  const handleExecuteTrade = ({
    symbol,
    shares,
    type,
    leverage,
  }: {
    symbol: string;
    shares: number;
    type: 'LONG' | 'SHORT';
    leverage: number;
  }) => {
    const stock = stocks.find((s) => s.symbol === symbol);
    if (!stock) return;

    const tradeMarginCost = (shares * stock.price) / leverage;
    if (tradeMarginCost > profile.cash) return;

    // Deduct cash margin
    setProfile((prev) => ({
      ...prev,
      cash: prev.cash - tradeMarginCost,
      totalTrades: prev.totalTrades + 1,
      stress: Math.min(100, prev.stress + Math.round(leverage * 0.8)),
    }));

    // Add or merge position
    setPositions((prev) => {
      const existing = prev.find((p) => p.symbol === symbol && p.type === type);
      if (existing) {
        const totalShares = existing.shares + shares;
        const avgPrice = (existing.averagePrice * existing.shares + stock.price * shares) / totalShares;
        return prev.map((p) => (p === existing ? { ...p, shares: totalShares, averagePrice: avgPrice } : p));
      }
      return [
        ...prev,
        {
          symbol,
          shares,
          averagePrice: stock.price,
          type,
          leverage,
          openedWeek: profile.week,
          currentPnL: 0,
          pnlPercent: 0,
        },
      ];
    });

    // Update sector mastery exp
    setSectorMastery((prev) => {
      const current = prev[stock.sector];
      const newExp = current.exp + 15;
      const newLevel = newExp >= 100 ? current.level + 1 : current.level;
      return {
        ...prev,
        [stock.sector]: {
          ...current,
          exp: newExp % 100,
          level: newLevel,
        },
      };
    });

    sounds.playTrade(true);
  };

  // Close Position
  const handleClosePosition = (symbol: string) => {
    const pos = positions.find((p) => p.symbol === symbol);
    if (!pos) return;
    const stock = stocks.find((s) => s.symbol === symbol);
    const currentPrice = stock ? stock.price : pos.averagePrice;

    const pnl = pos.type === 'LONG'
      ? (currentPrice - pos.averagePrice) * pos.shares * pos.leverage
      : (pos.averagePrice - currentPrice) * pos.shares * pos.leverage;

    const returnedCash = (pos.shares * pos.averagePrice) / pos.leverage + pnl;

    setProfile((prev) => ({
      ...prev,
      cash: Math.max(0, prev.cash + returnedCash),
      profitableTrades: pnl > 0 ? prev.profitableTrades + 1 : prev.profitableTrades,
      stress: Math.max(5, prev.stress - 5),
    }));

    setPositions((prev) => prev.filter((p) => p.symbol !== symbol));

    if (pnl > 0) {
      sounds.playCash();
    } else {
      sounds.playTrade(false);
    }
  };

  // Buy Option Contract
  const handleBuyOption = ({
    symbol,
    type,
    strikePrice,
    premiumPerShare,
    contracts,
  }: {
    symbol: string;
    type: 'CALL' | 'PUT';
    strikePrice: number;
    premiumPerShare: number;
    contracts: number;
  }) => {
    const totalCost = premiumPerShare * 100 * contracts;
    if (totalCost > profile.cash) return;

    setProfile((prev) => ({
      ...prev,
      cash: prev.cash - totalCost,
      totalTrades: prev.totalTrades + 1,
      stress: Math.min(100, prev.stress + 3),
    }));

    const newOption: OptionContract = {
      id: `opt_${Date.now()}`,
      symbol,
      type,
      strikePrice,
      premiumPerShare,
      contracts,
      expiryWeeksRemaining: 4,
      purchasedWeek: profile.week,
      currentPnL: 0,
    };

    setOptions((prev) => [...prev, newOption]);
    sounds.playTrade(true);
  };

  // Exercise / Cash Out Option
  const handleExerciseOption = (optionId: string) => {
    const opt = options.find((o) => o.id === optionId);
    if (!opt) return;
    const stock = stocks.find((s) => s.symbol === opt.symbol);
    if (!stock) return;

    const intrinsic = opt.type === 'CALL'
      ? Math.max(0, stock.price - opt.strikePrice)
      : Math.max(0, opt.strikePrice - stock.price);
    const cashPayout = intrinsic * opt.contracts * 100;

    setProfile((prev) => ({
      ...prev,
      cash: prev.cash + cashPayout,
      profitableTrades: cashPayout > (opt.premiumPerShare * 100 * opt.contracts) ? prev.profitableTrades + 1 : prev.profitableTrades,
    }));

    setOptions((prev) => prev.filter((o) => o.id !== optionId));
    sounds.playCash();
  };

  // Advance Week Simulation
  const handleAdvanceWeek = useCallback(() => {
    if (profile.gameStatus !== 'PLAYING') return;

    // 1. Pick a market news event
    const event = MARKET_NEWS_POOL[Math.floor(Math.random() * MARKET_NEWS_POOL.length)];

    // 2. Simulate next candle for all stocks
    let totalPositionsPnLDelta = 0;
    const updatedStocks = stocks.map((stock) => {
      let changeRate = (Math.random() - 0.49) * stock.volatility;

      // Event boost
      if (event.sector === 'ALL' || event.sector === stock.sector) {
        changeRate += (Math.random() - 0.2) * event.impactPercentage;
      }

      // Hot stock or meme pump boost
      if (stock.isHot && Math.random() > 0.5) {
        changeRate += Math.random() * 0.15;
      }

      const openPrice = stock.price;
      const closePrice = Math.max(0.5, Math.round(openPrice * (1 + changeRate) * 100) / 100);
      const highPrice = Math.max(openPrice, closePrice) + Math.random() * (openPrice * stock.volatility * 0.4);
      const lowPrice = Math.max(0.2, Math.min(openPrice, closePrice) - Math.random() * (openPrice * stock.volatility * 0.4));
      const volume = Math.floor(1500000 + Math.random() * 8000000);
      const changePct = ((closePrice - openPrice) / openPrice) * 100;

      const newCandle = {
        week: profile.week + 1,
        open: Math.round(openPrice * 100) / 100,
        high: Math.round(highPrice * 100) / 100,
        low: Math.round(lowPrice * 100) / 100,
        close: closePrice,
        volume,
      };

      return {
        ...stock,
        previousPrice: openPrice,
        price: closePrice,
        changePercent: Math.round(changePct * 100) / 100,
        history: [...stock.history.slice(-15), newCandle],
      };
    });

    setStocks(updatedStocks);

    // 2b. Evaluate Price Alerts
    const newAlertNotifs: PriceAlertNotification[] = [];
    const updatedAlerts = alerts.map((alert) => {
      if (alert.triggered) return alert;

      const matchingStock = updatedStocks.find((s) => s.symbol === alert.symbol);
      if (!matchingStock) return alert;

      const isHit = alert.condition === 'ABOVE'
        ? matchingStock.price >= alert.targetPrice
        : matchingStock.price <= alert.targetPrice;

      if (isHit) {
        newAlertNotifs.push({
          id: `notif_${alert.id}_${Date.now()}`,
          symbol: alert.symbol,
          targetPrice: alert.targetPrice,
          currentPrice: matchingStock.price,
          condition: alert.condition,
          timestamp: new Date().toLocaleTimeString(),
          week: profile.week + 1,
        });
        return { ...alert, triggered: true };
      }
      return alert;
    });

    if (newAlertNotifs.length > 0) {
      setAlertNotifications((prev) => [...newAlertNotifs, ...prev]);
    }
    setAlerts(updatedAlerts);

    // 3. Update positions mark-to-market
    const updatedPositions = positions.map((pos) => {
      const stock = updatedStocks.find((s) => s.symbol === pos.symbol);
      const currentPrice = stock ? stock.price : pos.averagePrice;
      const pnl = pos.type === 'LONG'
        ? (currentPrice - pos.averagePrice) * pos.shares * pos.leverage
        : (pos.averagePrice - currentPrice) * pos.shares * pos.leverage;
      const pnlPct = ((currentPrice - pos.averagePrice) / pos.averagePrice) * 100 * (pos.type === 'LONG' ? 1 : -1) * pos.leverage;

      totalPositionsPnLDelta += pnl;

      return {
        ...pos,
        currentPnL: Math.round(pnl),
        pnlPercent: Math.round(pnlPct * 10) / 10,
      };
    });

    setPositions(updatedPositions);

    // 4. Update options expiration
    const updatedOptions = options
      .map((opt) => ({
        ...opt,
        expiryWeeksRemaining: opt.expiryWeeksRemaining - 1,
      }))
      .filter((opt) => opt.expiryWeeksRemaining > 0);

    setOptions(updatedOptions);

    // 5. Financial cash flows
    const currentStage = CAREER_STAGES[profile.careerStageIndex];
    const weeklySalary = currentStage.weeklySalary;
    const weeklySavingsInterest = Math.round(profile.highYieldSavings * 0.001); // ~5.2% APY
    const weeklyUpkeep = luxuryItems.filter((i) => i.purchased).reduce((a, b) => a + b.weeklyUpkeep, 0);
    const weeklyMarginInterest = Math.round(profile.marginDebt * 0.0012); // ~6.2% margin rate

    // Calculate stock dividends for held long positions
    let weeklyDividendsTotal = 0;
    positions.forEach((pos) => {
      if (pos.type === 'LONG') {
        const stock = updatedStocks.find((s) => s.symbol === pos.symbol);
        if (stock && stock.dividendYield > 0) {
          const weeklyDivPerShare = (stock.price * stock.dividendYield) / 52;
          weeklyDividendsTotal += pos.shares * weeklyDivPerShare;
        }
      }
    });
    weeklyDividendsTotal = Math.round(weeklyDividendsTotal * 100) / 100;

    const netCashAddition = weeklySalary + weeklySavingsInterest + weeklyDividendsTotal - weeklyUpkeep - weeklyMarginInterest;

    // 6. Check SEC Heat natural drift / risk
    let newSecHeat = profile.secHeat;
    if (profile.marginDebt > 500000 || positions.some((p) => p.leverage >= 20)) {
      newSecHeat = Math.min(100, newSecHeat + 4);
    } else {
      newSecHeat = Math.max(0, newSecHeat - 2);
    }

    // 7. Check Rivals net worth updates (they make market gains too!)
    const updatedRivals = rivals.map((r) => {
      const rivalReturn = (Math.random() - 0.45) * 0.05;
      return {
        ...r,
        netWorth: Math.round(r.netWorth * (1 + rivalReturn)),
      };
    });
    setRivals(updatedRivals);

    // 8. Trigger Scandal check (if SEC heat > 40 or randomly after week 6)
    let nextCrisis = null;
    if (newSecHeat >= 50 && scandals.length > 0 && Math.random() > 0.4) {
      nextCrisis = scandals[Math.floor(Math.random() * scandals.length)];
      setActiveScandal(nextCrisis);
      sounds.playAlert();
    }

    // 9. Check Game Over / Victory Conditions
    const nextWeek = profile.week + 1;
    const nextYear = Math.floor(nextWeek / 52) + 1;
    const currentNetWorth = profile.netWorth;

    let nextGameStatus: TraderProfile['gameStatus'] = profile.gameStatus;
    if (newSecHeat >= 100) {
      nextGameStatus = 'ARRESTED';
      sounds.playGavel();
    } else if (profile.cash + profile.portfolioValue <= 0 && profile.marginDebt > 0) {
      nextGameStatus = 'BANKRUPT';
      sounds.playAlert();
    } else if (profile.careerStageIndex === 5 && currentNetWorth > rivals[0].netWorth) {
      nextGameStatus = 'VICTORY';
      sounds.playWin();
    }

    const newCash = Math.max(0, profile.cash + netCashAddition);
    const luxuryAssetVal = luxuryItems.filter((i) => i.purchased).reduce((a, b) => a + b.price, 0);
    const estimatedNewNetWorth = Math.round(
      newCash + profile.portfolioValue + totalPositionsPnLDelta + profile.highYieldSavings + luxuryAssetVal - profile.marginDebt
    );

    const newSnapshot: NetWorthSnapshot = {
      week: nextWeek,
      netWorth: estimatedNewNetWorth,
      cash: newCash,
      portfolioValue: Math.max(0, profile.portfolioValue + totalPositionsPnLDelta),
    };

    setProfile((prev) => ({
      ...prev,
      cash: newCash,
      week: nextWeek,
      year: nextYear,
      secHeat: newSecHeat,
      stress: Math.max(5, prev.stress - 3),
      gameStatus: nextGameStatus,
      netWorthHistory: [...prev.netWorthHistory.slice(-24), newSnapshot],
    }));

    // 10. Generate new Daily Market Briefing for the week
    const randomBriefingTemplate = BRIEFING_TEMPLATES[Math.floor(Math.random() * BRIEFING_TEMPLATES.length)];
    const newBriefing: MarketBriefing = {
      id: `briefing_${Date.now()}`,
      headline: randomBriefingTemplate.headline,
      category: randomBriefingTemplate.category,
      summary: randomBriefingTemplate.summary,
      affectedSector: randomBriefingTemplate.affectedSector,
      sentiment: randomBriefingTemplate.sentiment,
      week: nextWeek,
      year: nextYear,
    };

    setBriefingArchive((prev) => [currentBriefing, ...prev.slice(0, 15)]);
    setCurrentBriefing(newBriefing);

    // Trigger settlement modal
    setWeekSummary({
      tradingPnL: totalPositionsPnLDelta,
      salaryEarned: weeklySalary,
      savingsInterestEarned: weeklySavingsInterest,
      dividendsEarned: weeklyDividendsTotal,
      upkeepDeducted: weeklyUpkeep,
      marginInterestDeducted: weeklyMarginInterest,
      marketEvent: event,
    });

    sounds.playBell();
  }, [profile, stocks, positions, options, rivals, luxuryItems, scandals, currentBriefing, alerts]);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === 'Space') {
        e.preventDefault();
        if (profile.gameStatus === 'TITLE') {
          setProfile((p) => ({ ...p, gameStatus: 'PLAYING' }));
          sounds.playBell();
        } else if (weekSummary) {
          setWeekSummary(null);
        } else if (profile.gameStatus === 'PLAYING') {
          handleAdvanceWeek();
        }
      } else if (e.code === 'KeyT') {
        setActiveTab('TRADING');
        sounds.playClick();
      } else if (e.code === 'KeyC' || e.code === 'KeyP') {
        setActiveTab('CAREER');
        sounds.playClick();
      } else if (e.code === 'KeyE') {
        setActiveTab('EMPIRE');
        sounds.playClick();
      } else if (e.code === 'KeyR') {
        setActiveTab('WALLRICH');
        sounds.playClick();
      } else if (e.code === 'KeyN') {
        setActiveTab('STREETX');
        sounds.playClick();
      } else if (e.code === 'KeyH') {
        setActiveTab('ROMANCE');
        sounds.playClick();
      } else if (e.code === 'KeyM' || e.code === 'KeyA') {
        setActiveTab('ARENA');
        sounds.playClick();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [profile.gameStatus, weekSummary, handleAdvanceWeek]);

  // Luxury Item Purchase
  const handleBuyLuxury = (itemId: string) => {
    const item = luxuryItems.find((i) => i.id === itemId);
    if (!item || item.purchased || profile.cash < item.price) return;

    setProfile((prev) => ({
      ...prev,
      cash: prev.cash - item.price,
      prestige: prev.prestige + item.prestigeBonus,
      stress: Math.max(0, prev.stress - item.stressReduction),
    }));

    setLuxuryItems((prev) => prev.map((i) => (i.id === itemId ? { ...i, purchased: true } : i)));
    sounds.playCash();
  };

  // Banking
  const handleDepositSavings = (amt: number) => {
    if (amt <= 0 || amt > profile.cash) return;
    setProfile((prev) => ({
      ...prev,
      cash: prev.cash - amt,
      highYieldSavings: prev.highYieldSavings + amt,
    }));
    sounds.playCash();
  };

  const handleWithdrawSavings = (amt: number) => {
    if (amt <= 0 || amt > profile.highYieldSavings) return;
    setProfile((prev) => ({
      ...prev,
      cash: prev.cash + amt,
      highYieldSavings: prev.highYieldSavings - amt,
    }));
    sounds.playCash();
  };

  const handleBorrowMargin = (amt: number) => {
    if (amt <= 0) return;
    setProfile((prev) => ({
      ...prev,
      cash: prev.cash + amt,
      marginDebt: prev.marginDebt + amt,
      secHeat: Math.min(100, prev.secHeat + 3),
    }));
    sounds.playCash();
  };

  const handleRepayMargin = (amt: number) => {
    if (amt <= 0 || amt > profile.cash || profile.marginDebt <= 0) return;
    const repayment = Math.min(amt, profile.marginDebt);
    setProfile((prev) => ({
      ...prev,
      cash: prev.cash - repayment,
      marginDebt: prev.marginDebt - repayment,
      secHeat: Math.max(0, prev.secHeat - 3),
    }));
    sounds.playCash();
  };

  // Career Promotion
  const handlePromoteStage = (stageIdx: number) => {
    setProfile((prev) => ({
      ...prev,
      careerStageIndex: stageIdx,
      firmTitle: CAREER_STAGES[stageIdx].title,
      prestige: prev.prestige + 250,
      stress: Math.max(0, prev.stress - 20),
    }));
    sounds.playWin();
  };

  const handleSendInvestorLetter = () => {
    setProfile((prev) => ({
      ...prev,
      lpApprovalRating: Math.min(100, prev.lpApprovalRating + 12),
      prestige: prev.prestige + 40,
    }));
    sounds.playTrade(true);
  };

  // FinTwit Posting
  const handlePostTweet = (content: string, tickerTag?: string, isBullish?: boolean) => {
    const newPost = {
      id: `post_${Date.now()}`,
      author: profile.name,
      handle: `@${profile.name.replace(/\s+/g, '')}_CIO`,
      avatar: '📈',
      content,
      likes: Math.floor(100 + profile.prestige * 2.5),
      retweets: Math.floor(25 + profile.prestige * 0.8),
      tickerTag,
      verified: profile.careerStageIndex >= 2,
      isBullish,
      week: profile.week,
    };

    setFinTwitPosts((prev) => [newPost, ...prev]);

    // Slight price drift on the tagged ticker from your tweet!
    if (tickerTag) {
      setStocks((prev) =>
        prev.map((s) => {
          if (s.symbol === tickerTag) {
            const drift = (isBullish ? 1 : -1) * (0.01 + Math.random() * 0.03);
            const newPrice = Math.max(1, Math.round(s.price * (1 + drift) * 100) / 100);
            return { ...s, price: newPrice, changePercent: s.changePercent + drift * 100 };
          }
          return s;
        })
      );
    }

    setProfile((prev) => ({
      ...prev,
      prestige: prev.prestige + 10,
      secHeat: Math.min(100, prev.secHeat + 2),
    }));

    sounds.playClick();
  };

  // Romance Interactions
  const handleGoOnDate = (partnerId: string, cost: number, affectionGain: number) => {
    if (profile.cash < cost) return;
    setProfile((prev) => ({
      ...prev,
      cash: prev.cash - cost,
      stress: Math.max(0, prev.stress - 20),
      prestige: prev.prestige + 15,
    }));

    setRomancePartners((prev) =>
      prev.map((p) => {
        if (p.id === partnerId) {
          const newAffection = Math.min(100, p.affection + affectionGain);
          let newStage = p.relationshipStage;
          if (newAffection >= 80) newStage = 'Exclusive';
          else if (newAffection >= 50) newStage = 'Dating';
          return { ...p, affection: newAffection, relationshipStage: newStage };
        }
        return p;
      })
    );

    sounds.playCash();
  };

  const handleGiveGift = (partnerId: string, cost: number, affectionGain: number) => {
    if (profile.cash < cost) return;
    setProfile((prev) => ({
      ...prev,
      cash: prev.cash - cost,
      prestige: prev.prestige + 50,
    }));

    setRomancePartners((prev) =>
      prev.map((p) => (p.id === partnerId ? { ...p, affection: Math.min(100, p.affection + affectionGain) } : p))
    );

    sounds.playCash();
  };

  const handlePropose = (partnerId: string) => {
    const partner = romancePartners.find((p) => p.id === partnerId);
    if (!partner || profile.cash < 250000 || partner.affection < 80) return;

    setProfile((prev) => ({
      ...prev,
      cash: prev.cash - 250000,
      isMarried: true,
      romancePartnerId: partnerId,
      prestige: prev.prestige + 1000,
      stress: Math.max(0, prev.stress - 40),
    }));

    setRomancePartners((prev) =>
      prev.map((p) => (p.id === partnerId ? { ...p, relationshipStage: 'Married' } : p))
    );

    sounds.playWin();
  };

  // Scandal Resolution
  const handleResolveScandal = (choice: ScandalChoice, success: boolean) => {
    const cost = choice.cost;
    const secChange = success ? choice.secHeatChange : choice.secHeatChange + 15;
    const stressChange = success ? choice.stressChange : choice.stressChange + 20;

    setProfile((prev) => ({
      ...prev,
      cash: Math.max(0, prev.cash - cost),
      secHeat: Math.max(0, Math.min(100, prev.secHeat + secChange)),
      stress: Math.max(0, Math.min(100, prev.stress + stressChange)),
    }));

    setActiveScandal(null);
    sounds.playGavel();
  };

  const handleAddAlert = (alertData: { symbol: string; targetPrice: number; condition: 'ABOVE' | 'BELOW' }) => {
    const newAlert: PriceAlert = {
      id: `alert_${Date.now()}`,
      symbol: alertData.symbol,
      targetPrice: alertData.targetPrice,
      condition: alertData.condition,
      createdWeek: profile.week,
      triggered: false,
    };
    setAlerts((prev) => [newAlert, ...prev]);
    sounds.playTrade(true);
  };

  const handleDeleteAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const handleDismissNotification = (id: string) => {
    setAlertNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleSelectStockFromAlert = (symbol: string) => {
    setSelectedStockSymbol(symbol);
    setActiveTab('TRADING');
  };

  // Restart Game
  const handleRestart = () => {
    setProfile(INITIAL_PROFILE);
    setStocks(INITIAL_STOCKS);
    setPositions([]);
    setOptions([]);
    setRivals(INITIAL_RIVALS);
    setLuxuryItems(LUXURY_ITEMS);
    setScandals(INITIAL_SCANDALS);
    setFinTwitPosts(INITIAL_FINTWIT_POSTS);
    setRomancePartners(INITIAL_ROMANCE_PARTNERS);
    setCurrentBriefing(INITIAL_BRIEFING);
    setBriefingArchive([]);
    setAlertNotifications([]);
    setActiveScandal(null);
    setWeekSummary(null);
    sounds.playBell();
  };

  const winRate = profile.totalTrades > 0
    ? Math.round((profile.profitableTrades / profile.totalTrades) * 100)
    : 0;

  const currentPartner = romancePartners.find((p) => p.id === profile.romancePartnerId);

  // Render Title Screen
  if (profile.gameStatus === 'TITLE') {
    return (
      <>
        <TitleScreen
          onStartGame={() => {
            setProfile((prev) => ({ ...prev, gameStatus: 'PLAYING' }));
            sounds.playBell();
          }}
          isMuted={isMuted}
          onToggleMute={toggleMute}
          onOpenPublishModal={() => setIsPublishModalOpen(true)}
        />
        <StorePublishModal
          isOpen={isPublishModalOpen}
          onClose={() => setIsPublishModalOpen(false)}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans select-none">
      {/* Upper Status Perimeter Header */}
      <HeaderHUD
        profile={profile}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onAdvanceWeek={handleAdvanceWeek}
        isMuted={isMuted}
        onToggleMute={toggleMute}
        onOpenPublishModal={() => setIsPublishModalOpen(true)}
      />

      {/* Main Game Shell Viewport */}
      <main className="flex-1 pb-16">
        {activeTab === 'TRADING' && (
          <TradingTerminal
            stocks={stocks}
            positions={positions}
            options={options}
            cash={profile.cash}
            netWorth={profile.netWorth}
            netWorthHistory={profile.netWorthHistory}
            currentBriefing={currentBriefing}
            briefingArchive={briefingArchive}
            alerts={alerts}
            onAddAlert={handleAddAlert}
            onDeleteAlert={handleDeleteAlert}
            selectedStockSymbol={selectedStockSymbol}
            onSelectStockSymbol={setSelectedStockSymbol}
            maxLeverage={CAREER_STAGES[profile.careerStageIndex].maxLeverageAllowed}
            canTradeOptions={profile.careerStageIndex >= 3}
            onExecuteTrade={handleExecuteTrade}
            onClosePosition={handleClosePosition}
            onBuyOption={handleBuyOption}
            onExerciseOption={handleExerciseOption}
          />
        )}

        {activeTab === 'CAREER' && (
          <CareerDesk
            currentStageIndex={profile.careerStageIndex}
            stages={CAREER_STAGES}
            netWorth={profile.netWorth}
            winRate={winRate}
            sectorMastery={sectorMastery}
            lpApprovalRating={profile.lpApprovalRating}
            onPromoteStage={handlePromoteStage}
            onSendInvestorLetter={handleSendInvestorLetter}
          />
        )}

        {activeTab === 'EMPIRE' && (
          <EmpireLuxury
            cash={profile.cash}
            netWorth={profile.netWorth}
            highYieldSavings={profile.highYieldSavings}
            marginDebt={profile.marginDebt}
            prestige={profile.prestige}
            luxuryItems={luxuryItems}
            onBuyLuxuryItem={handleBuyLuxury}
            onDepositSavings={handleDepositSavings}
            onWithdrawSavings={handleWithdrawSavings}
            onBorrowMargin={handleBorrowMargin}
            onRepayMargin={handleRepayMargin}
          />
        )}

        {activeTab === 'WALLRICH' && (
          <WallRichLeaderboard
            playerNetWorth={profile.netWorth}
            playerName={profile.name}
            firmTitle={profile.firmTitle}
            rivals={rivals}
            partnerName={currentPartner ? currentPartner.name : null}
            partnerNetWorth={currentPartner ? currentPartner.netWorth : 0}
            isMarried={profile.isMarried}
            powerCoupleMoniker={currentPartner ? currentPartner.powerCoupleMoniker : null}
          />
        )}

        {activeTab === 'STREETX' && (
          <FinTwitFeed
            posts={finTwitPosts}
            playerName={profile.name}
            onPostTweet={handlePostTweet}
          />
        )}

        {activeTab === 'ROMANCE' && (
          <RomanceDesk
            partners={romancePartners}
            activePartnerId={profile.romancePartnerId}
            isMarried={profile.isMarried}
            cash={profile.cash}
            onGoOnDate={handleGoOnDate}
            onGiveGift={handleGiveGift}
            onPropose={handlePropose}
            onSelectPartner={(partnerId) => setProfile((p) => ({ ...p, romancePartnerId: partnerId }))}
          />
        )}

        {activeTab === 'ARENA' && (
          <MultiplayerArena
            playerDefaultName={profile.name}
            playerFirmTitle={profile.firmTitle}
          />
        )}
      </main>

      {/* Week Settlement Modal */}
      {weekSummary && (
        <WeekSummaryModal
          week={profile.week}
          year={profile.year}
          tradingPnL={weekSummary.tradingPnL}
          salaryEarned={weekSummary.salaryEarned}
          savingsInterestEarned={weekSummary.savingsInterestEarned}
          dividendsEarned={weekSummary.dividendsEarned}
          upkeepDeducted={weekSummary.upkeepDeducted}
          marginInterestDeducted={weekSummary.marginInterestDeducted}
          marketEvent={weekSummary.marketEvent}
          onClose={() => setWeekSummary(null)}
        />
      )}

      {/* SEC Scandal / Crisis Arc Modal */}
      {activeScandal && (
        <ScandalPRModal
          scandal={activeScandal}
          cash={profile.cash}
          onResolveChoice={handleResolveScandal}
        />
      )}

      {/* Game Over / Victory Modal */}
      {['VICTORY', 'BANKRUPT', 'ARRESTED'].includes(profile.gameStatus) && (
        <GameOverModal
          status={profile.gameStatus as 'VICTORY' | 'BANKRUPT' | 'ARRESTED'}
          profile={profile}
          winRate={winRate}
          onRestart={handleRestart}
        />
      )}

      {/* Real-time Browser-Style Price Alert Notifications */}
      <PriceAlertToast
        notifications={alertNotifications}
        onDismiss={handleDismissNotification}
        onSelectStock={handleSelectStockFromAlert}
      />

      {/* App Store & Google Play Publishing Hub Modal */}
      <StorePublishModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
      />

      {/* Bottom Global Status Bar */}
      <footer className="fixed bottom-0 left-0 right-0 z-20 bg-slate-950/90 border-t border-slate-800/80 px-4 py-2 flex items-center justify-between text-[11px] text-slate-500 font-mono">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            NYSE/NASDAQ SIMULATOR ACTIVE
          </span>
          <span>•</span>
          <span>Trades: {profile.totalTrades}</span>
          <span>•</span>
          <span>Win Rate: {winRate}%</span>
        </div>

        <div className="hidden sm:flex items-center gap-3 text-slate-400">
          <span>[SPACE] Next Week</span>
          <span>[T] Trading</span>
          <span>[C] Career</span>
          <span>[E] Empire</span>
          <span>[R] WallRich 400</span>
          <span>[N] StreetX</span>
        </div>
      </footer>
    </div>
  );
}
