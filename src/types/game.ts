export type Sector = 
  | 'Big Tech & AI'
  | 'BioPharma & Genomics'
  | 'Energy & Commodities'
  | 'Defense & Aerospace'
  | 'Consumer & Luxury'
  | 'FinTech & Degens';

export interface CandleData {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  week: number;
}

export interface Stock {
  symbol: string;
  name: string;
  sector: Sector;
  price: number;
  previousPrice: number;
  changePercent: number;
  history: CandleData[];
  volatility: number; // 0.05 to 0.40
  marketCap: number; // in billions
  peRatio: number;
  dividendYield: number; // e.g. 0.03 = 3%
  description: string;
  catalystNews?: string;
  isHot?: boolean;
  shortInterest?: number; // e.g. 24% for meme squeeze targets
}

export type OrderType = 'LONG' | 'SHORT';

export interface Position {
  symbol: string;
  shares: number;
  averagePrice: number;
  type: OrderType;
  leverage: number; // 1 to 50
  openedWeek: number;
  currentPnL: number;
  pnlPercent: number;
}

export interface OptionContract {
  id: string;
  symbol: string;
  type: 'CALL' | 'PUT';
  strikePrice: number;
  premiumPerShare: number;
  contracts: number; // 100 shares each
  expiryWeeksRemaining: number;
  purchasedWeek: number;
  currentPnL: number;
}

export interface PriceAlert {
  id: string;
  symbol: string;
  targetPrice: number;
  condition: 'ABOVE' | 'BELOW';
  createdWeek: number;
  triggered: boolean;
}

export interface PriceAlertNotification {
  id: string;
  symbol: string;
  targetPrice: number;
  currentPrice: number;
  condition: 'ABOVE' | 'BELOW';
  timestamp: string;
  week: number;
}

export interface CareerStage {
  id: number;
  title: string;
  firmName: string;
  weeklySalary: number;
  aumManaged: number;
  carryPercent: number; // profit split e.g. 20%
  minNetWorthReq: number;
  minWinRateReq: number;
  maxLeverageAllowed: number;
  description: string;
  perks: string[];
}

export interface InterviewQuestion {
  question: string;
  options: {
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}

export interface Rival {
  id: string;
  name: string;
  moniker: string;
  firm: string;
  avatar: string;
  netWorth: number;
  aum: number;
  strategy: string;
  weeklyQuote: string;
  isRivalOfTheYear?: boolean;
  statusBadge: string;
}

export interface LuxuryItem {
  id: string;
  name: string;
  category: 'WATCH' | 'VEHICLE' | 'ESTATE' | 'YACHT' | 'AIRCRAFT' | 'STAFF' | 'SYNDICATE';
  price: number;
  weeklyUpkeep: number;
  prestigeBonus: number;
  stressReduction: number;
  perkDescription: string;
  purchased: boolean;
  iconName: string;
}

export interface ScandalChoice {
  text: string;
  cost: number;
  secHeatChange: number;
  publicSentimentChange: number;
  stressChange: number;
  resolutionText: string;
  oddsOfSuccess: number; // 0 to 1
  failureText?: string;
}

export interface Scandal {
  id: string;
  title: string;
  headline: string;
  premise: string;
  prAdvisorBrief: string;
  choices: ScandalChoice[];
  resolved: boolean;
}

export interface FinTwitPost {
  id: string;
  author: string;
  handle: string;
  avatar: string;
  content: string;
  likes: number;
  retweets: number;
  tickerTag?: string;
  verified: boolean;
  isBullish?: boolean;
  week: number;
}

export type RelationshipStage = 'Crush' | 'Dating' | 'Exclusive' | 'Engaged' | 'Married';

export interface RomancePartner {
  id: string;
  name: string;
  profession: string;
  netWorth: number;
  avatar: string;
  personality: string;
  relationshipStage: RelationshipStage;
  affection: number; // 0 to 100
  powerCoupleMoniker: string;
  dialogue: string;
  perk: string;
}

export interface MarketEvent {
  id: string;
  headline: string;
  sector: Sector | 'ALL';
  impactPercentage: number;
  description: string;
  isBlackSwan?: boolean;
}

export interface MarketBriefing {
  id: string;
  headline: string;
  category: string;
  summary: string;
  affectedSector: Sector | 'Macro & Broad Market';
  sentiment: 'BULLISH' | 'BEARISH' | 'VOLATILE';
  week: number;
  year: number;
}

export interface SectorMastery {
  sector: Sector;
  exp: number; // 0 - 100
  level: number; // 1 to 5
}

export interface NetWorthSnapshot {
  week: number;
  netWorth: number;
  cash: number;
  portfolioValue: number;
}

export interface TraderProfile {
  name: string;
  firmTitle: string;
  cash: number;
  netWorth: number;
  portfolioValue: number;
  week: number;
  year: number;
  stress: number; // 0 to 100
  secHeat: number; // 0 to 100
  prestige: number; // 0 to 1000
  careerStageIndex: number;
  highYieldSavings: number; // earning 5% annual (approx 0.1% weekly)
  marginDebt: number; // borrowed funds
  activeCrisis: Scandal | null;
  romancePartnerId: string | null;
  isMarried: boolean;
  totalTrades: number;
  profitableTrades: number;
  peakNetWorth: number;
  lpApprovalRating: number; // 0 to 100
  gameStatus: 'TITLE' | 'PLAYING' | 'PAUSED' | 'VICTORY' | 'BANKRUPT' | 'ARRESTED';
  netWorthHistory: NetWorthSnapshot[];
}
