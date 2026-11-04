export type ChallengeType = 'BLITZ' | 'SQUEEZE' | 'NET_WORTH_RACE' | 'BEAR_SURVIVAL';

export interface MultiplayerStock {
  symbol: string;
  name: string;
  price: number;
  previousPrice: number;
  changePercent: number;
  volatility: number;
  sector: string;
  isHot?: boolean;
}

export interface MultiplayerPosition {
  symbol: string;
  shares: number;
  averagePrice: number;
  type: 'LONG' | 'SHORT';
  leverage: number;
  currentPnL: number;
}

export interface PlayerState {
  id: string;
  name: string;
  firmTitle: string;
  avatar: string;
  isHost: boolean;
  isReady: boolean;
  isBot?: boolean;
  cash: number;
  portfolioValue: number;
  netWorth: number;
  roiPercent: number;
  positions: MultiplayerPosition[];
  totalTrades: number;
  profitableTrades: number;
}

export interface ChallengeRoom {
  id: string;
  name: string;
  challengeType: ChallengeType;
  status: 'LOBBY' | 'IN_PROGRESS' | 'FINISHED';
  startingCash: number;
  currentRound: number;
  totalRounds: number;
  isPublic: boolean;
  stocks: MultiplayerStock[];
  players: Record<string, PlayerState>;
  recentTrades: Array<{
    id: string;
    playerName: string;
    action: string;
    timestamp: string;
  }>;
  chatMessages: Array<{
    id: string;
    sender: string;
    text: string;
    timestamp: string;
  }>;
  winnerId: string | null;
}

export interface PublicRoomSummary {
  id: string;
  name: string;
  challengeType: ChallengeType;
  status: 'LOBBY' | 'IN_PROGRESS' | 'FINISHED';
  playerCount: number;
  totalRounds: number;
  currentRound: number;
  startingCash: number;
}
