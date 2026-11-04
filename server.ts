import express from 'express';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(express.json());

// Challenge definitions
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

const INITIAL_MULTIPLAYER_STOCKS: MultiplayerStock[] = [
  { symbol: 'NVX', name: 'NovaX AI Chips', price: 420.5, previousPrice: 420.5, changePercent: 0, volatility: 0.12, sector: 'Big Tech & AI', isHot: true },
  { symbol: 'MEME', name: 'ApeMoon Dynamics', price: 42.0, previousPrice: 42.0, changePercent: 0, volatility: 0.28, sector: 'FinTech & Degens', isHot: true },
  { symbol: 'BIOX', name: 'Genesis BioPharma', price: 115.0, previousPrice: 115.0, changePercent: 0, volatility: 0.18, sector: 'BioPharma & Genomics' },
  { symbol: 'OILX', name: 'Hyperion Energy', price: 88.5, previousPrice: 88.5, changePercent: 0, volatility: 0.09, sector: 'Energy & Commodities' },
  { symbol: 'DEFN', name: 'Aegis Aerospace', price: 210.0, previousPrice: 210.0, changePercent: 0, volatility: 0.08, sector: 'Defense & Aerospace' },
  { symbol: 'LUX', name: 'Vanguard Luxury', price: 340.0, previousPrice: 340.0, changePercent: 0, volatility: 0.07, sector: 'Consumer & Luxury' },
];

const rooms: Map<string, ChallengeRoom> = new Map();
const socketToPlayerMap: Map<WebSocket, { roomId: string; playerId: string }> = new Map();

function broadcastToRoom(roomId: string, message: object) {
  const payload = JSON.stringify(message);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      const info = socketToPlayerMap.get(client);
      if (info && info.roomId === roomId) {
        client.send(payload);
      }
    }
  });
}

function getPublicRoomsSummary() {
  const summary: any[] = [];
  rooms.forEach((room) => {
    if (room.isPublic && room.status !== 'FINISHED') {
      summary.push({
        id: room.id,
        name: room.name,
        challengeType: room.challengeType,
        status: room.status,
        playerCount: Object.keys(room.players).length,
        totalRounds: room.totalRounds,
        currentRound: room.currentRound,
        startingCash: room.startingCash,
      });
    }
  });
  return summary;
}

function updateStockPricesForRoom(room: ChallengeRoom) {
  room.stocks = room.stocks.map((stock) => {
    let bias = 0;
    if (room.challengeType === 'BEAR_SURVIVAL') {
      bias = -0.05; // Bear market headwinds
    } else if (room.challengeType === 'SQUEEZE' && stock.symbol === 'MEME') {
      bias = (Math.random() - 0.3) * 0.25; // Super volatility
    }

    const fluctuation = (Math.random() - 0.48) * stock.volatility + bias;
    const oldPrice = stock.price;
    const newPrice = Math.max(1.0, Math.round(oldPrice * (1 + fluctuation) * 100) / 100);
    const changePct = Math.round(((newPrice - oldPrice) / oldPrice) * 10000) / 100;

    return {
      ...stock,
      previousPrice: oldPrice,
      price: newPrice,
      changePercent: changePct,
    };
  });

  // Re-calculate all player positions mark-to-market
  Object.values(room.players).forEach((player) => {
    let totalPositionValue = 0;
    player.positions = player.positions.map((pos) => {
      const currentStock = room.stocks.find((s) => s.symbol === pos.symbol);
      const currentPrice = currentStock ? currentStock.price : pos.averagePrice;
      const pnl = pos.type === 'LONG'
        ? (currentPrice - pos.averagePrice) * pos.shares * pos.leverage
        : (pos.averagePrice - currentPrice) * pos.shares * pos.leverage;
      const posMargin = (pos.shares * pos.averagePrice) / pos.leverage;
      const posEquity = Math.max(0, posMargin + pnl);
      totalPositionValue += posEquity;

      return {
        ...pos,
        currentPnL: Math.round(pnl * 100) / 100,
      };
    });

    player.portfolioValue = Math.round(totalPositionValue);
    player.netWorth = Math.round(player.cash + player.portfolioValue);
    player.roiPercent = Math.round(((player.netWorth - room.startingCash) / room.startingCash) * 10000) / 100;
  });
}

function simulateBotAction(room: ChallengeRoom) {
  const bots = Object.values(room.players).filter((p) => p.isBot);
  bots.forEach((bot) => {
    // Random bot trade action
    if (Math.random() > 0.4) {
      const randomStock = room.stocks[Math.floor(Math.random() * room.stocks.length)];
      const isLong = room.challengeType === 'BEAR_SURVIVAL' ? Math.random() > 0.7 : Math.random() > 0.3;
      const maxShares = Math.floor((bot.cash * 0.3) / randomStock.price);
      if (maxShares > 5) {
        const shares = Math.max(5, Math.floor(maxShares * (0.3 + Math.random() * 0.7)));
        const cost = shares * randomStock.price;
        if (cost <= bot.cash) {
          bot.cash -= cost;
          bot.totalTrades += 1;
          bot.positions.push({
            symbol: randomStock.symbol,
            shares,
            averagePrice: randomStock.price,
            type: isLong ? 'LONG' : 'SHORT',
            leverage: 1,
            currentPnL: 0,
          });

          room.recentTrades.unshift({
            id: `trade_${Date.now()}_${Math.random()}`,
            playerName: bot.name,
            action: `${isLong ? 'Bought' : 'Shorted'} ${shares} shares of $${randomStock.symbol} at $${randomStock.price.toFixed(2)}`,
            timestamp: new Date().toLocaleTimeString(),
          });
        }
      }
    }
  });
}

// WebSocket Connection handling
wss.on('connection', (ws: WebSocket) => {
  // Send list of rooms immediately on connect
  ws.send(JSON.stringify({ type: 'ROOMS_LIST', rooms: getPublicRoomsSummary() }));

  ws.on('message', (rawMessage: string) => {
    try {
      const data = JSON.parse(rawMessage);

      switch (data.type) {
        case 'GET_ROOMS': {
          ws.send(JSON.stringify({ type: 'ROOMS_LIST', rooms: getPublicRoomsSummary() }));
          break;
        }

        case 'CREATE_ROOM': {
          const roomId = `BULL-${Math.floor(100 + Math.random() * 900)}`;
          const startingCash = data.startingCash || 50000;
          const challengeType: ChallengeType = data.challengeType || 'BLITZ';
          const totalRounds = data.totalRounds || (challengeType === 'BLITZ' ? 5 : 8);

          const hostPlayer: PlayerState = {
            id: `player_${Date.now()}`,
            name: data.playerName || 'Wall St Bull',
            firmTitle: data.firmTitle || 'Managing Director',
            avatar: data.avatar || '🐂',
            isHost: true,
            isReady: true,
            cash: startingCash,
            portfolioValue: 0,
            netWorth: startingCash,
            roiPercent: 0,
            positions: [],
            totalTrades: 0,
            profitableTrades: 0,
          };

          const newRoom: ChallengeRoom = {
            id: roomId,
            name: data.roomName || `${hostPlayer.name}'s Challenge`,
            challengeType,
            status: 'LOBBY',
            startingCash,
            currentRound: 1,
            totalRounds,
            isPublic: data.isPublic !== false,
            stocks: JSON.parse(JSON.stringify(INITIAL_MULTIPLAYER_STOCKS)),
            players: { [hostPlayer.id]: hostPlayer },
            recentTrades: [],
            chatMessages: [
              {
                id: `msg_${Date.now()}`,
                sender: 'SYSTEM',
                text: `Welcome to ${challengeType} Challenge! Prepare your trading strategy.`,
                timestamp: new Date().toLocaleTimeString(),
              },
            ],
            winnerId: null,
          };

          rooms.set(roomId, newRoom);
          socketToPlayerMap.set(ws, { roomId, playerId: hostPlayer.id });

          ws.send(JSON.stringify({ type: 'ROOM_JOINED', room: newRoom, playerId: hostPlayer.id }));
          break;
        }

        case 'JOIN_ROOM': {
          const room = rooms.get(data.roomId);
          if (!room) {
            ws.send(JSON.stringify({ type: 'ERROR', message: 'Room not found.' }));
            return;
          }
          if (room.status !== 'LOBBY') {
            ws.send(JSON.stringify({ type: 'ERROR', message: 'Challenge has already started.' }));
            return;
          }
          if (Object.keys(room.players).length >= 8) {
            ws.send(JSON.stringify({ type: 'ERROR', message: 'Room is at maximum capacity (8 players).' }));
            return;
          }

          const newPlayerId = `player_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
          const player: PlayerState = {
            id: newPlayerId,
            name: data.playerName || `Trader ${Object.keys(room.players).length + 1}`,
            firmTitle: data.firmTitle || 'Senior Quant',
            avatar: data.avatar || '📈',
            isHost: false,
            isReady: false,
            cash: room.startingCash,
            portfolioValue: 0,
            netWorth: room.startingCash,
            roiPercent: 0,
            positions: [],
            totalTrades: 0,
            profitableTrades: 0,
          };

          room.players[newPlayerId] = player;
          socketToPlayerMap.set(ws, { roomId: room.id, playerId: newPlayerId });

          room.chatMessages.push({
            id: `msg_${Date.now()}`,
            sender: 'SYSTEM',
            text: `${player.name} (${player.firmTitle}) entered the trading pit!`,
            timestamp: new Date().toLocaleTimeString(),
          });

          ws.send(JSON.stringify({ type: 'ROOM_JOINED', room, playerId: newPlayerId }));
          broadcastToRoom(room.id, { type: 'ROOM_UPDATED', room });
          break;
        }

        case 'ADD_BOT_RIVAL': {
          const mapping = socketToPlayerMap.get(ws);
          if (!mapping) return;
          const room = rooms.get(mapping.roomId);
          if (!room || room.status !== 'LOBBY') return;

          const botNames = [
            { name: 'Gordon Gekko', title: 'Wall St Raider', avatar: '🦈' },
            { name: 'Chad Brofessor', title: 'YOLO Arbitrageur', avatar: '🚀' },
            { name: 'Cassandra Short', title: 'Black Swan Hunter', avatar: '🦅' },
            { name: 'Vance Sterling', title: 'Hedge Fund Titan', avatar: '👑' },
          ];

          const existingCount = Object.values(room.players).filter((p) => p.isBot).length;
          const botInfo = botNames[existingCount % botNames.length];
          const botId = `bot_${Date.now()}`;

          room.players[botId] = {
            id: botId,
            name: `${botInfo.name} [AI]`,
            firmTitle: botInfo.title,
            avatar: botInfo.avatar,
            isHost: false,
            isReady: true,
            isBot: true,
            cash: room.startingCash,
            portfolioValue: 0,
            netWorth: room.startingCash,
            roiPercent: 0,
            positions: [],
            totalTrades: 0,
            profitableTrades: 0,
          };

          room.chatMessages.push({
            id: `msg_${Date.now()}`,
            sender: 'SYSTEM',
            text: `${botInfo.name} [AI Rival] accepted the challenge!`,
            timestamp: new Date().toLocaleTimeString(),
          });

          broadcastToRoom(room.id, { type: 'ROOM_UPDATED', room });
          break;
        }

        case 'TOGGLE_READY': {
          const mapping = socketToPlayerMap.get(ws);
          if (!mapping) return;
          const room = rooms.get(mapping.roomId);
          if (!room || room.status !== 'LOBBY') return;

          const player = room.players[mapping.playerId];
          if (player) {
            player.isReady = !player.isReady;
            broadcastToRoom(room.id, { type: 'ROOM_UPDATED', room });
          }
          break;
        }

        case 'START_CHALLENGE': {
          const mapping = socketToPlayerMap.get(ws);
          if (!mapping) return;
          const room = rooms.get(mapping.roomId);
          if (!room || room.status !== 'LOBBY') return;

          const player = room.players[mapping.playerId];
          if (!player || !player.isHost) {
            ws.send(JSON.stringify({ type: 'ERROR', message: 'Only the host can start the challenge.' }));
            return;
          }

          room.status = 'IN_PROGRESS';
          room.currentRound = 1;
          room.chatMessages.push({
            id: `msg_${Date.now()}`,
            sender: 'SYSTEM',
            text: `🔔 THE OPENING BELL RINGS! Challenge started. Week 1 begins now.`,
            timestamp: new Date().toLocaleTimeString(),
          });

          broadcastToRoom(room.id, { type: 'ROOM_UPDATED', room });
          break;
        }

        case 'EXECUTE_TRADE': {
          const mapping = socketToPlayerMap.get(ws);
          if (!mapping) return;
          const room = rooms.get(mapping.roomId);
          if (!room || room.status !== 'IN_PROGRESS') return;

          const player = room.players[mapping.playerId];
          if (!player) return;

          const stock = room.stocks.find((s) => s.symbol === data.symbol);
          if (!stock) return;

          const shares = parseInt(data.shares, 10);
          const type = data.tradeType === 'SHORT' ? 'SHORT' : 'LONG';
          const leverage = Math.min(3, Math.max(1, parseInt(data.leverage, 10) || 1));
          const tradeCost = (shares * stock.price) / leverage;

          if (tradeCost > player.cash || shares <= 0) {
            ws.send(JSON.stringify({ type: 'ERROR', message: 'Insufficient cash margin for this trade.' }));
            return;
          }

          player.cash -= tradeCost;
          player.totalTrades += 1;

          // Check if existing position
          const existingPos = player.positions.find((p) => p.symbol === stock.symbol && p.type === type);
          if (existingPos) {
            const totalShares = existingPos.shares + shares;
            existingPos.averagePrice = (existingPos.averagePrice * existingPos.shares + stock.price * shares) / totalShares;
            existingPos.shares = totalShares;
          } else {
            player.positions.push({
              symbol: stock.symbol,
              shares,
              averagePrice: stock.price,
              type,
              leverage,
              currentPnL: 0,
            });
          }

          // Recalculate player totals
          let posTotal = 0;
          player.positions.forEach((pos) => {
            const curS = room.stocks.find((s) => s.symbol === pos.symbol);
            const curP = curS ? curS.price : pos.averagePrice;
            const pnl = pos.type === 'LONG'
              ? (curP - pos.averagePrice) * pos.shares * pos.leverage
              : (pos.averagePrice - curP) * pos.shares * pos.leverage;
            posTotal += Math.max(0, (pos.shares * pos.averagePrice) / pos.leverage + pnl);
          });
          player.portfolioValue = Math.round(posTotal);
          player.netWorth = Math.round(player.cash + player.portfolioValue);
          player.roiPercent = Math.round(((player.netWorth - room.startingCash) / room.startingCash) * 10000) / 100;

          room.recentTrades.unshift({
            id: `trade_${Date.now()}`,
            playerName: player.name,
            action: `${type === 'LONG' ? 'Went LONG' : 'Shorted'} ${shares} shares of $${stock.symbol} at $${stock.price.toFixed(2)}${leverage > 1 ? ` (${leverage}x leverage)` : ''}`,
            timestamp: new Date().toLocaleTimeString(),
          });
          if (room.recentTrades.length > 25) room.recentTrades.pop();

          broadcastToRoom(room.id, { type: 'ROOM_UPDATED', room });
          break;
        }

        case 'CLOSE_POSITION': {
          const mapping = socketToPlayerMap.get(ws);
          if (!mapping) return;
          const room = rooms.get(mapping.roomId);
          if (!room || room.status !== 'IN_PROGRESS') return;

          const player = room.players[mapping.playerId];
          if (!player) return;

          const posIndex = player.positions.findIndex((p) => p.symbol === data.symbol);
          if (posIndex === -1) return;

          const pos = player.positions[posIndex];
          const stock = room.stocks.find((s) => s.symbol === pos.symbol);
          const curP = stock ? stock.price : pos.averagePrice;
          const pnl = pos.type === 'LONG'
            ? (curP - pos.averagePrice) * pos.shares * pos.leverage
            : (pos.averagePrice - curP) * pos.shares * pos.leverage;

          const returnedCash = Math.max(0, (pos.shares * pos.averagePrice) / pos.leverage + pnl);
          player.cash += returnedCash;
          if (pnl > 0) player.profitableTrades += 1;
          player.positions.splice(posIndex, 1);

          let posTotal = 0;
          player.positions.forEach((p) => {
            const curS = room.stocks.find((s) => s.symbol === p.symbol);
            const cp = curS ? curS.price : p.averagePrice;
            const curPnl = p.type === 'LONG'
              ? (cp - p.averagePrice) * p.shares * p.leverage
              : (p.averagePrice - cp) * p.shares * p.leverage;
            posTotal += Math.max(0, (p.shares * p.averagePrice) / p.leverage + curPnl);
          });
          player.portfolioValue = Math.round(posTotal);
          player.netWorth = Math.round(player.cash + player.portfolioValue);
          player.roiPercent = Math.round(((player.netWorth - room.startingCash) / room.startingCash) * 10000) / 100;

          room.recentTrades.unshift({
            id: `trade_${Date.now()}`,
            playerName: player.name,
            action: `Closed ${pos.symbol} for ${pnl >= 0 ? '+' : ''}$${Math.round(pnl).toLocaleString()} PnL`,
            timestamp: new Date().toLocaleTimeString(),
          });

          broadcastToRoom(room.id, { type: 'ROOM_UPDATED', room });
          break;
        }

        case 'ADVANCE_ROUND': {
          const mapping = socketToPlayerMap.get(ws);
          if (!mapping) return;
          const room = rooms.get(mapping.roomId);
          if (!room || room.status !== 'IN_PROGRESS') return;

          // Only host or any player in synchronized rounds
          simulateBotAction(room);
          updateStockPricesForRoom(room);

          if (room.currentRound >= room.totalRounds) {
            // End challenge!
            room.status = 'FINISHED';

            // Find winner: highest net worth
            let bestPlayer: PlayerState | null = null;
            Object.values(room.players).forEach((p) => {
              if (!bestPlayer || p.netWorth > bestPlayer.netWorth) {
                bestPlayer = p;
              }
            });

            room.winnerId = bestPlayer ? (bestPlayer as PlayerState).id : null;
            room.chatMessages.push({
              id: `msg_${Date.now()}`,
              sender: 'SYSTEM',
              text: `🏆 THE CLOSING BELL HAS RUNG! Challenge champion: ${bestPlayer ? (bestPlayer as PlayerState).name : 'No winner'} with Net Worth of $${(bestPlayer ? (bestPlayer as PlayerState).netWorth : 0).toLocaleString()} (${bestPlayer ? (bestPlayer as PlayerState).roiPercent : 0}% ROI)!`,
              timestamp: new Date().toLocaleTimeString(),
            });
          } else {
            room.currentRound += 1;
            room.chatMessages.push({
              id: `msg_${Date.now()}`,
              sender: 'SYSTEM',
              text: `🔔 Advanced to Week ${room.currentRound} of ${room.totalRounds}! Prices updated.`,
              timestamp: new Date().toLocaleTimeString(),
            });
          }

          broadcastToRoom(room.id, { type: 'ROOM_UPDATED', room });
          break;
        }

        case 'SEND_CHAT': {
          const mapping = socketToPlayerMap.get(ws);
          if (!mapping) return;
          const room = rooms.get(mapping.roomId);
          if (!room) return;

          const player = room.players[mapping.playerId];
          if (!player) return;

          const text = (data.text || '').trim();
          if (!text) return;

          room.chatMessages.push({
            id: `msg_${Date.now()}`,
            sender: player.name,
            text: text.slice(0, 160),
            timestamp: new Date().toLocaleTimeString(),
          });
          if (room.chatMessages.length > 50) room.chatMessages.shift();

          broadcastToRoom(room.id, { type: 'ROOM_UPDATED', room });
          break;
        }

        case 'LEAVE_ROOM': {
          const mapping = socketToPlayerMap.get(ws);
          if (!mapping) return;
          const room = rooms.get(mapping.roomId);
          if (room) {
            delete room.players[mapping.playerId];
            if (Object.keys(room.players).length === 0) {
              rooms.delete(room.id);
            } else {
              broadcastToRoom(room.id, { type: 'ROOM_UPDATED', room });
            }
          }
          socketToPlayerMap.delete(ws);
          ws.send(JSON.stringify({ type: 'LEFT_ROOM' }));
          break;
        }
      }
    } catch (err) {
      console.error('WebSocket message error:', err);
    }
  });

  ws.on('close', () => {
    const mapping = socketToPlayerMap.get(ws);
    if (mapping) {
      const room = rooms.get(mapping.roomId);
      if (room) {
        delete room.players[mapping.playerId];
        if (Object.keys(room.players).length === 0) {
          rooms.delete(room.id);
        } else {
          broadcastToRoom(room.id, { type: 'ROOM_UPDATED', room });
        }
      }
      socketToPlayerMap.delete(ws);
    }
  });
});

// REST Health Check and stats endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', activeRooms: rooms.size, timestamp: Date.now() });
});

// Google Play Store Digital Asset Links for full-screen Trusted Web Activity (TWA)
app.get('/.well-known/assetlinks.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.json([
    {
      relation: ['delegate_permission/common.handle_all_urls'],
      target: {
        namespace: 'android_app',
        package_name: 'com.spotlightdream.stocks',
        sha256_cert_fingerprints: [
          // Users replace with their Google Play App Signing SHA-256 fingerprint upon store key generation
          '14:6D:E9:7D:0F:52:AB:AC:6E:7B:8A:2F:3A:4C:5D:6E:7F:80:91:A2:B3:C4:D5:E6:F7:08:19:2A:3B:4C:5D:6E',
        ],
      },
    },
  ]);
});

// Store-compliant Privacy Policy route for App Store & Google Play reviews
app.get('/privacy-policy', (req, res) => {
  res.send(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Privacy Policy - Spotlight Stocks: Market Titan</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 40px auto; padding: 0 20px; line-height: 1.6; color: #1e293b; background: #f8fafc; }
    h1 { color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; }
    h2 { color: #334155; margin-top: 24px; }
    .badge { display: inline-block; padding: 4px 10px; background: #10b981; color: white; border-radius: 9999px; font-size: 12px; font-weight: bold; }
  </style>
</head>
<body>
  <span class="badge">Store Verified</span>
  <h1>Privacy Policy for Spotlight Stocks: Market Titan</h1>
  <p><strong>Effective Date:</strong> November 4, 2026</p>
  <p><strong>Developer:</strong> Spotlight Dream Studio</p>

  <h2>1. Overview</h2>
  <p>Spotlight Stocks: Market Titan is a simulated financial career and stock trading strategy game. All in-game currency, securities, portfolios, dividends, and real-estate assets are purely virtual simulation credits and have no real-world monetary value.</p>

  <h2>2. Information Collection & Usage</h2>
  <p>We respect your privacy. The game does not collect personal identity information (PII), banking details, or real financial data. Game progression, achievements, and player nicknames are stored locally on your device or ephemerally during multiplayer challenge sessions.</p>

  <h2>3. Multiplayer & Networking</h2>
  <p>When participating in real-time multiplayer challenges, temporary socket identifiers and chosen handles are used exclusively for matchmaking and score coordination during the session.</p>

  <h2>4. Contact Us</h2>
  <p>If you have questions regarding this policy or the application, contact support at <strong>support@spotlightdream.com</strong>.</p>
</body>
</html>`);
});

// Dev / Prod Vite handling
async function startServer() {
  const PORT = Number(process.env.PORT) || 3000;

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Spotlight Stocks Full-Stack Server running on port ${PORT}`);
  });
}

startServer();
