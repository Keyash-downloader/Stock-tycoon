import React, { useState, useEffect } from 'react';
import { 
  Swords, 
  Users, 
  Zap, 
  Flame, 
  Trophy, 
  ArrowUpRight, 
  ArrowDownRight, 
  TrendingUp, 
  TrendingDown, 
  Send, 
  Bot, 
  Copy, 
  Check, 
  Play, 
  RefreshCw, 
  ShieldAlert, 
  DollarSign, 
  Crown, 
  AlertCircle,
  Clock,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useMultiplayerSocket } from '../hooks/useMultiplayerSocket';
import { ChallengeType, MultiplayerStock } from '../types/multiplayer';
import { sounds } from '../audio/soundEffects';

interface MultiplayerArenaProps {
  playerDefaultName: string;
  playerFirmTitle: string;
}

export const MultiplayerArena: React.FC<MultiplayerArenaProps> = ({
  playerDefaultName,
  playerFirmTitle,
}) => {
  const {
    status,
    rooms,
    currentRoom,
    playerId,
    errorMessage,
    clearError,
    refreshRooms,
    createRoom,
    joinRoom,
    addBotRival,
    toggleReady,
    startChallenge,
    executeTrade,
    closePosition,
    advanceRound,
    sendChat,
    leaveRoom,
  } = useMultiplayerSocket();

  // Local Form State
  const [playerName, setPlayerName] = useState<string>(playerDefaultName || 'Alex Vance');
  const [firmTitle, setFirmTitle] = useState<string>(playerFirmTitle || 'Bedroom Day Trader');
  const [selectedAvatar, setSelectedAvatar] = useState<string>('🐂');
  const [selectedChallengeType, setSelectedChallengeType] = useState<ChallengeType>('BLITZ');
  const [startingCash, setStartingCash] = useState<number>(50000);
  const [totalRounds, setTotalRounds] = useState<number>(5);
  const [joinRoomCode, setJoinRoomCode] = useState<string>('');
  const [chatInput, setChatInput] = useState<string>('');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Active Trade Form in Match
  const [selectedStockSymbol, setSelectedStockSymbol] = useState<string>('NVX');
  const [tradeShares, setTradeShares] = useState<number>(20);
  const [tradeType, setTradeType] = useState<'LONG' | 'SHORT'>('LONG');
  const [tradeLeverage, setTradeLeverage] = useState<number>(1);

  const avatars = ['🐂', '🦈', '🦅', '👑', '🚀', '⚡', '💎', '🦁'];

  const challengeDescriptions: Record<ChallengeType, { title: string; subtitle: string; icon: string; badge: string; rules: string }> = {
    BLITZ: {
      title: 'Speed Blitz Sprint',
      subtitle: '5 quick trading weeks. Highest ROI % wins before the closing bell.',
      icon: '⚡',
      badge: 'High Action',
      rules: '5 rounds • 3x Leverage allowed • Aggressive swing trades win',
    },
    SQUEEZE: {
      title: 'The Short Squeeze Duel',
      subtitle: 'Meme stocks with massive volatility. Longs vs Shorts war!',
      icon: '🚀',
      badge: 'Hyper Volatile',
      rules: '$MEME ticker volatility amplified • Liquidate your opponent',
    },
    NET_WORTH_RACE: {
      title: 'Titan Net Worth Race',
      subtitle: '8 synchronized market weeks. Compete for highest final capital.',
      icon: '👑',
      badge: 'Strategic',
      rules: '8 rounds • Balanced sector portfolio • Risk management is key',
    },
    BEAR_SURVIVAL: {
      title: 'Bear Market Survival',
      subtitle: 'Severe market crash (-30%). Short selling and cash preservation wins.',
      icon: '🐻',
      badge: 'Hardcore',
      rules: 'Persistent market headwinds • Hedging & Shorting rewarded',
    },
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleCopyCode = () => {
    if (currentRoom) {
      navigator.clipboard.writeText(currentRoom.id);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    sendChat(chatInput);
    setChatInput('');
  };

  const handleQuickMatch = () => {
    // If open rooms exist with status LOBBY, join first one, otherwise create
    const openLobby = rooms.find((r) => r.status === 'LOBBY' && r.playerCount < 8);
    if (openLobby) {
      joinRoom(openLobby.id, playerName, firmTitle, selectedAvatar);
      sounds.playTrade(true);
    } else {
      createRoom({
        playerName,
        firmTitle,
        avatar: selectedAvatar,
        roomName: `${playerName}'s Arena`,
        challengeType: 'BLITZ',
        startingCash: 50000,
        totalRounds: 5,
        isPublic: true,
      });
      sounds.playBell();
    }
  };

  // Current Player Object
  const myPlayer = currentRoom && playerId ? currentRoom.players[playerId] : null;
  const isHost = myPlayer?.isHost ?? false;
  const currentStock = currentRoom?.stocks.find((s) => s.symbol === selectedStockSymbol) || currentRoom?.stocks[0];

  // Ranked Players for Leaderboard
  const rankedPlayers = currentRoom
    ? Object.values(currentRoom.players).sort((a, b) => b.netWorth - a.netWorth)
    : [];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-4 space-y-4 select-none">
      {/* Upper Arena Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-500 p-0.5 shadow-lg">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-2xl">
              ⚔️
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-100 tracking-tight">The Trading Pit</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 uppercase tracking-wider">
                Multiplayer Arena
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Compete head-to-head in synchronized real-time stock market challenges vs live players and Wall Street AI rivals.
            </p>
          </div>
        </div>

        {/* Server Status Indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs font-mono">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                status === 'CONNECTED'
                  ? 'bg-emerald-400 animate-pulse'
                  : status === 'CONNECTING'
                  ? 'bg-amber-400 animate-ping'
                  : 'bg-rose-500'
              }`}
            />
            <span className={status === 'CONNECTED' ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
              {status === 'CONNECTED' ? 'Server Online' : status === 'CONNECTING' ? 'Connecting...' : 'Disconnected'}
            </span>
          </div>

          {!currentRoom && (
            <button
              onClick={refreshRooms}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
              title="Refresh Lobbies"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}

          {currentRoom && (
            <button
              onClick={() => {
                leaveRoom();
                sounds.playClick();
              }}
              className="px-3 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-bold transition cursor-pointer"
            >
              Leave Room
            </button>
          )}
        </div>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={clearError} className="text-rose-400 hover:text-white font-bold ml-2">
            ✕
          </button>
        </div>
      )}

      {/* VIEW 1: LOBBY BROWSER & CHALLENGE CREATION (When not in room) */}
      {!currentRoom && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Column: Player Identity & Create Challenge (5 cols) */}
          <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-400" />
                Player Profile
              </span>
              <span className="text-xs text-amber-400 font-mono font-bold">Ready to Battle</span>
            </div>

            {/* Profile Customization */}
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Trader Handle
                </label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  maxLength={20}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-sm text-slate-100 font-bold focus:outline-none"
                  placeholder="Enter your trader name"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Firm / Desk Title
                </label>
                <input
                  type="text"
                  value={firmTitle}
                  onChange={(e) => setFirmTitle(e.target.value)}
                  maxLength={25}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-sm text-slate-300 focus:outline-none"
                  placeholder="e.g. Apex Capital Manager"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Avatar Emblem
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {avatars.map((av) => (
                    <button
                      key={av}
                      onClick={() => setSelectedAvatar(av)}
                      className={`w-10 h-10 rounded-xl text-lg flex items-center justify-center border transition-all cursor-pointer ${
                        selectedAvatar === av
                          ? 'bg-emerald-500/20 border-emerald-500 shadow-md scale-110'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Create Challenge Options */}
            <div className="pt-3 border-t border-slate-800 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
                Select Multiplayer Challenge
              </span>

              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(challengeDescriptions) as ChallengeType[]).map((type) => {
                  const info = challengeDescriptions[type];
                  const isSelected = selectedChallengeType === type;
                  return (
                    <div
                      key={type}
                      onClick={() => {
                        setSelectedChallengeType(type);
                        setTotalRounds(type === 'BLITZ' ? 5 : 8);
                      }}
                      className={`p-3 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-950/60 border-indigo-500 shadow-lg shadow-indigo-500/10'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xl">{info.icon}</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold uppercase">
                          {info.badge}
                        </span>
                      </div>
                      <div className="font-bold text-xs text-slate-100">{info.title}</div>
                      <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-2">{info.subtitle}</p>
                    </div>
                  );
                })}
              </div>

              {/* Challenge Parameters */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                    Starting Capital
                  </label>
                  <select
                    value={startingCash}
                    onChange={(e) => setStartingCash(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-emerald-400 font-bold focus:outline-none"
                  >
                    <option value={25000}>$25,000</option>
                    <option value={50000}>$50,000</option>
                    <option value={100000}>$100,000</option>
                    <option value={250000}>$250,000</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                    Trading Weeks
                  </label>
                  <select
                    value={totalRounds}
                    onChange={(e) => setTotalRounds(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-amber-400 font-bold focus:outline-none"
                  >
                    <option value={3}>3 Weeks (Quick Sprint)</option>
                    <option value={5}>5 Weeks (Standard Blitz)</option>
                    <option value={8}>8 Weeks (Championship)</option>
                    <option value={12}>12 Weeks (Full Season)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => {
                    createRoom({
                      playerName,
                      firmTitle,
                      avatar: selectedAvatar,
                      roomName: `${playerName}'s Challenge`,
                      challengeType: selectedChallengeType,
                      startingCash,
                      totalRounds,
                      isPublic: true,
                    });
                    sounds.playBell();
                  }}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider transition shadow-lg shadow-emerald-500/20 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Swords className="w-4 h-4" />
                  <span>Host New Challenge</span>
                </button>

                <button
                  onClick={handleQuickMatch}
                  className="px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-indigo-600/20 cursor-pointer flex items-center gap-1.5"
                  title="Instantly Match with Open Lobbies"
                >
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>Quick Match</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Public Lobbies & Join with Room Code (7 cols) */}
          <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 flex flex-col h-full">
            {/* Quick Room Code Input */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="font-bold text-xs text-slate-200 block">Have a Private Room Code?</span>
                <span className="text-[11px] text-slate-400">Enter your friend's room ID to jump straight in.</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={joinRoomCode}
                  onChange={(e) => setJoinRoomCode(e.target.value.toUpperCase())}
                  placeholder="e.g. BULL-420"
                  className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-amber-300 font-mono font-bold tracking-wider uppercase focus:outline-none focus:border-amber-400 w-32"
                />
                <button
                  onClick={() => {
                    if (joinRoomCode.trim()) {
                      joinRoom(joinRoomCode.trim(), playerName, firmTitle, selectedAvatar);
                      sounds.playTrade(true);
                    }
                  }}
                  className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition cursor-pointer"
                >
                  Join
                </button>
              </div>
            </div>

            {/* Public Lobbies List */}
            <div className="flex-1 flex flex-col min-h-[360px]">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-rose-400" />
                  Open Multiplayer Challenges
                </span>
                <span className="text-xs text-slate-500">{rooms.length} Active Rooms</span>
              </div>

              {rooms.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-center text-2xl">
                    🏛️
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-200 text-sm">The Trading Floor is Quiet</h4>
                    <p className="text-xs text-slate-400 max-w-sm mt-1">
                      No public rooms are waiting right now. Host a challenge or click Quick Match to spawn a room instantly!
                    </p>
                  </div>
                  <button
                    onClick={handleQuickMatch}
                    className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs tracking-wider uppercase transition shadow-md shadow-emerald-500/20 cursor-pointer"
                  >
                    Host Instant Challenge
                  </button>
                </div>
              ) : (
                <div className="space-y-2 mt-3 overflow-y-auto max-h-[420px] pr-1">
                  {rooms.map((room) => {
                    const info = challengeDescriptions[room.challengeType];
                    return (
                      <div
                        key={room.id}
                        className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-xl">
                            {info.icon}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-slate-100">{room.name}</span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono font-bold">
                                {room.id}
                              </span>
                            </div>
                            <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                              <span className="text-emerald-400 font-semibold">{formatCurrency(room.startingCash)}</span>
                              <span>•</span>
                              <span>{room.totalRounds} Rounds</span>
                              <span>•</span>
                              <span className="text-indigo-400 font-medium">{info.title}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <span className="text-xs font-bold text-slate-200 flex items-center gap-1 justify-end">
                              <Users className="w-3.5 h-3.5 text-slate-400" />
                              {room.playerCount}/8
                            </span>
                            <span
                              className={`text-[10px] font-semibold uppercase ${
                                room.status === 'LOBBY' ? 'text-emerald-400' : 'text-amber-400'
                              }`}
                            >
                              {room.status === 'LOBBY' ? 'Waiting' : 'In Battle'}
                            </span>
                          </div>

                          {room.status === 'LOBBY' && (
                            <button
                              onClick={() => {
                                joinRoom(room.id, playerName, firmTitle, selectedAvatar);
                                sounds.playTrade(true);
                              }}
                              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition cursor-pointer shadow-md shadow-emerald-500/10"
                            >
                              Join Battle
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: PRE-BATTLE LOBBY (When room status === 'LOBBY') */}
      {currentRoom && currentRoom.status === 'LOBBY' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Column: Challenge Overview & Roster (8 cols) */}
          <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{challengeDescriptions[currentRoom.challengeType].icon}</span>
                  <h3 className="font-black text-lg text-slate-100">{currentRoom.name}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-mono font-bold">
                    Room {currentRoom.id}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {challengeDescriptions[currentRoom.challengeType].subtitle}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyCode}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold flex items-center gap-1.5 transition cursor-pointer"
                  title="Copy Room ID to invite friends"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>
            </div>

            {/* Match Rules Pill Box */}
            <div className="grid grid-cols-3 gap-3 text-xs bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Mode</span>
                <span className="font-bold text-indigo-400">{challengeDescriptions[currentRoom.challengeType].title}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Starting Capital</span>
                <span className="font-bold text-emerald-400">{formatCurrency(currentRoom.startingCash)}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Duration</span>
                <span className="font-bold text-amber-400">{currentRoom.totalRounds} Trading Weeks</span>
              </div>
            </div>

            {/* Player Roster */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Registered Traders ({Object.keys(currentRoom.players).length}/8)
                </span>
                {isHost && (
                  <button
                    onClick={() => {
                      addBotRival();
                      sounds.playClick();
                    }}
                    className="px-2.5 py-1 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
                  >
                    <Bot className="w-3.5 h-3.5" />
                    <span>Add AI Challenger</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.values(currentRoom.players).map((player) => (
                  <div
                    key={player.id}
                    className={`p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                      player.id === playerId
                        ? 'bg-slate-800/80 border-emerald-500/40'
                        : 'bg-slate-950/70 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{player.avatar}</span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-sm text-slate-100">{player.name}</span>
                          {player.isHost && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                              HOST
                            </span>
                          )}
                          {player.id === playerId && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                              YOU
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-400">{player.firmTitle}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          player.isReady
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {player.isReady ? 'Ready' : 'Not Ready'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  toggleReady();
                  sounds.playClick();
                }}
                className={`px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition cursor-pointer ${
                  myPlayer?.isReady
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20'
                }`}
              >
                {myPlayer?.isReady ? 'Cancel Ready' : 'Set Ready'}
              </button>

              {isHost ? (
                <button
                  onClick={() => {
                    startChallenge();
                    sounds.playBell();
                  }}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 hover:scale-105 active:scale-95 text-slate-950 font-black text-xs uppercase tracking-wider shadow-xl shadow-emerald-500/30 transition-all cursor-pointer flex items-center gap-2"
                >
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>Ring The Opening Bell (Start)</span>
                </button>
              ) : (
                <span className="text-xs text-slate-400 italic">Waiting for host to ring the bell...</span>
              )}
            </div>
          </div>

          {/* Right Column: In-Lobby Chat / Trash Talk (4 cols) */}
          <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col h-[520px]">
            <div className="pb-2 border-b border-slate-800 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Trading Pit Wire</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1 text-xs">
              {currentRoom.chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-2 rounded-lg ${
                    msg.sender === 'SYSTEM'
                      ? 'bg-amber-500/10 border border-amber-500/20 text-amber-300'
                      : 'bg-slate-950/60 border border-slate-800 text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mb-0.5">
                    <span className="font-bold text-slate-300">{msg.sender}</span>
                    <span>{msg.timestamp}</span>
                  </div>
                  <p>{msg.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendChat} className="mt-2 flex items-center gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Send trash talk..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* VIEW 3: LIVE BATTLE TRADING PIT (When room status === 'IN_PROGRESS') */}
      {currentRoom && currentRoom.status === 'IN_PROGRESS' && (
        <div className="space-y-4">
          {/* Live Match Top Dashboard Bar */}
          <div className="bg-slate-900/95 border border-indigo-500/40 rounded-2xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{challengeDescriptions[currentRoom.challengeType].icon}</span>
                <div>
                  <h3 className="font-black text-sm text-slate-100 uppercase tracking-tight">
                    {challengeDescriptions[currentRoom.challengeType].title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-amber-400 font-mono">
                    <span>Week {currentRoom.currentRound} of {currentRoom.totalRounds}</span>
                    <span>•</span>
                    <span className="text-slate-400">Room {currentRoom.id}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Advance Week Button */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  advanceRound();
                  sounds.playBell();
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/25 transition active:scale-95 cursor-pointer flex items-center gap-1.5"
                title="Advance week simulation for all players in this challenge"
              >
                <span>Advance Round</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Rivals Leaderboard Grid: Real-time Player Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {rankedPlayers.map((player, idx) => {
              const isLead = idx === 0;
              const isMe = player.id === playerId;
              const roiPositive = player.roiPercent >= 0;

              return (
                <div
                  key={player.id}
                  className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                    isMe
                      ? 'bg-slate-900/90 border-emerald-500/60 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/30'
                      : 'bg-slate-950/70 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{player.avatar}</span>
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-sm text-slate-100 truncate max-w-[110px]">{player.name}</span>
                          {isLead && <Crown className="w-3.5 h-3.5 text-amber-400" />}
                        </div>
                        <span className="text-[10px] text-slate-400">{player.firmTitle}</span>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-500">#{idx + 1}</span>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Net Worth:</span>
                      <span className="font-black text-slate-100">{formatCurrency(player.netWorth)}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Return (ROI):</span>
                      <span
                        className={`font-bold flex items-center gap-0.5 ${
                          roiPositive ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {roiPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {roiPositive ? '+' : ''}{player.roiPercent.toFixed(1)}%
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>Cash: {formatCurrency(player.cash)}</span>
                      <span>{player.positions.length} Active Pos</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Arena Trading Floor: Synchronized Tickers & Live Execution */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left: Synchronized Market Tickers (4 cols) */}
            <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col h-[520px]">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Synchronized Pit Tickers
                </span>
                <span className="text-[10px] text-slate-500">{currentRoom.stocks.length} Stocks</span>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {currentRoom.stocks.map((stock) => {
                  const isSelected = stock.symbol === selectedStockSymbol;
                  const isUp = stock.changePercent >= 0;

                  return (
                    <div
                      key={stock.symbol}
                      onClick={() => setSelectedStockSymbol(stock.symbol)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-slate-800 border-indigo-500/60 shadow-lg shadow-indigo-500/10'
                          : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/40 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-sm text-slate-100">${stock.symbol}</span>
                          {stock.isHot && (
                            <span className="text-[9px] bg-rose-500/20 text-rose-400 border border-rose-500/30 px-1 rounded flex items-center gap-0.5">
                              <Flame className="w-2.5 h-2.5" /> HOT
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400 truncate max-w-[130px] block">{stock.name}</span>
                      </div>

                      <div className="text-right">
                        <span className="font-bold text-slate-100 text-sm tabular-nums">
                          {formatCurrency(stock.price)}
                        </span>
                        <div
                          className={`text-xs font-semibold tabular-nums flex items-center justify-end gap-0.5 ${
                            isUp ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                          {isUp ? '+' : ''}{stock.changePercent.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Center/Right: Order Execution & Positions (8 cols) */}
            <div className="lg:col-span-8 flex flex-col gap-4">
              {/* Order Execution Desk */}
              {currentStock && (
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xl font-black text-slate-100">{currentStock.name}</h4>
                        <span className="px-2 py-0.5 rounded-md bg-slate-800 text-emerald-400 text-xs font-mono font-bold">
                          ${currentStock.symbol}
                        </span>
                        <span className="text-xs text-slate-400 px-2 py-0.5 bg-slate-800/60 rounded">
                          {currentStock.sector}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-black text-slate-100 tabular-nums">
                        {formatCurrency(currentStock.price)}
                      </div>
                      <div
                        className={`text-xs font-bold tabular-nums ${
                          currentStock.changePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {currentStock.changePercent >= 0 ? '+' : ''}{currentStock.changePercent.toFixed(2)}% this round
                      </div>
                    </div>
                  </div>

                  {/* Trade Action Controls */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-3 border-t border-slate-800">
                    <div className="sm:col-span-4 flex items-center gap-2">
                      <button
                        onClick={() => setTradeType('LONG')}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1 ${
                          tradeType === 'LONG'
                            ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                            : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>BUY (LONG)</span>
                      </button>

                      <button
                        onClick={() => setTradeType('SHORT')}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1 ${
                          tradeType === 'SHORT'
                            ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                            : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <TrendingDown className="w-3.5 h-3.5" />
                        <span>SHORT</span>
                      </button>
                    </div>

                    <div className="sm:col-span-4 flex items-center gap-2">
                      <input
                        type="number"
                        min={1}
                        value={tradeShares}
                        onChange={(e) => setTradeShares(Math.max(1, parseInt(e.target.value, 10) || 1))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-100 focus:outline-none focus:border-indigo-500"
                        placeholder="Shares"
                      />
                      <select
                        value={tradeLeverage}
                        onChange={(e) => setTradeLeverage(Number(e.target.value))}
                        className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs font-bold text-amber-400 focus:outline-none"
                      >
                        <option value={1}>1x</option>
                        <option value={2}>2x</option>
                        <option value={3}>3x</option>
                      </select>
                    </div>

                    <div className="sm:col-span-4 flex items-center">
                      <button
                        onClick={() => {
                          executeTrade(currentStock.symbol, tradeShares, tradeType, tradeLeverage);
                          sounds.playTrade(true);
                        }}
                        className={`w-full py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition shadow-md cursor-pointer ${
                          tradeType === 'LONG'
                            ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
                            : 'bg-rose-500 hover:bg-rose-400 text-white shadow-rose-500/20'
                        }`}
                      >
                        Execute {tradeType} ({formatCurrency((tradeShares * currentStock.price) / tradeLeverage)})
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Your Active Positions */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex-1">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Your Active Match Positions ({myPlayer?.positions.length || 0})
                  </span>
                  <span className="text-xs text-slate-400">
                    Available Cash: <strong className="text-emerald-400">{formatCurrency(myPlayer?.cash || 0)}</strong>
                  </span>
                </div>

                {!myPlayer || myPlayer.positions.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-500 italic">
                    No active positions held in this round. Execute trades above to start generating PnL!
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="text-slate-500 border-b border-slate-800/80">
                          <th className="pb-1.5 font-semibold">Ticker</th>
                          <th className="pb-1.5 font-semibold">Side</th>
                          <th className="pb-1.5 font-semibold">Shares</th>
                          <th className="pb-1.5 font-semibold">Entry</th>
                          <th className="pb-1.5 font-semibold">Current PnL</th>
                          <th className="pb-1.5 text-right font-semibold">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {myPlayer.positions.map((pos) => {
                          const isProfit = pos.currentPnL >= 0;
                          return (
                            <tr key={`${pos.symbol}_${pos.type}`} className="hover:bg-slate-800/40">
                              <td className="py-2 font-bold text-slate-100">${pos.symbol}</td>
                              <td className="py-2">
                                <span
                                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                    pos.type === 'LONG'
                                      ? 'bg-emerald-500/20 text-emerald-400'
                                      : 'bg-rose-500/20 text-rose-400'
                                  }`}
                                >
                                  {pos.type} {pos.leverage > 1 ? `${pos.leverage}x` : ''}
                                </span>
                              </td>
                              <td className="py-2 tabular-nums">{pos.shares}</td>
                              <td className="py-2 tabular-nums">${pos.averagePrice.toFixed(2)}</td>
                              <td className={`py-2 tabular-nums font-bold ${isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {isProfit ? '+' : ''}{formatCurrency(pos.currentPnL)}
                              </td>
                              <td className="py-2 text-right">
                                <button
                                  onClick={() => {
                                    closePosition(pos.symbol);
                                    sounds.playCash();
                                  }}
                                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold transition cursor-pointer"
                                >
                                  Close
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Live Wire Tape & Chat */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Live Pit Trade Tape (7 cols) */}
            <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 h-48 flex flex-col">
              <div className="pb-2 border-b border-slate-800 mb-2 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  Live Order Tape
                </span>
                <span className="text-[10px] text-slate-500">All Competitors</span>
              </div>
              <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 text-xs">
                {currentRoom.recentTrades.map((trade) => (
                  <div key={trade.id} className="p-1.5 rounded bg-slate-950/50 border border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-indigo-400">{trade.playerName}:</span>
                      <span className="text-slate-200">{trade.action}</span>
                    </div>
                    <span className="text-[10px] text-slate-500">{trade.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trash Talk Wire (5 cols) */}
            <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 h-48 flex flex-col">
              <div className="pb-2 border-b border-slate-800 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Trading Pit Wire</span>
              </div>
              <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 text-xs">
                {currentRoom.chatMessages.map((msg) => (
                  <div key={msg.id} className="p-1.5 rounded bg-slate-950/50 border border-slate-800/80 text-xs">
                    <span className="font-bold text-slate-400 mr-1.5">{msg.sender}:</span>
                    <span className="text-slate-200">{msg.text}</span>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSendChat} className="mt-2 flex items-center gap-1.5">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Trash talk rivals..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none"
                />
                <button
                  type="submit"
                  className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 4: PODIUM / POST-MATCH RESULTS (When room status === 'FINISHED') */}
      {currentRoom && currentRoom.status === 'FINISHED' && (
        <div className="bg-slate-900/95 border border-amber-500/50 rounded-3xl p-6 sm:p-10 shadow-2xl text-center space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-4xl shadow-xl shadow-amber-500/25 mx-auto">
            🏆
          </div>

          <div>
            <span className="text-xs uppercase tracking-widest text-amber-400 font-bold block mb-1">
              Challenge Concluded • Final Standings
            </span>
            <h3 className="text-3xl font-black text-slate-100">
              {rankedPlayers[0]?.id === playerId ? 'VICTORY! You Ruled The Pit' : `${rankedPlayers[0]?.name} Won The Challenge!`}
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              The closing bell has rung. Compare your final returns against rival Wall Street traders.
            </p>
          </div>

          {/* Podium Table */}
          <div className="max-w-2xl mx-auto bg-slate-950/80 border border-slate-800 rounded-2xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-900 border-b border-slate-800 text-slate-400">
                <tr>
                  <th className="p-3">Rank</th>
                  <th className="p-3">Trader</th>
                  <th className="p-3">Final Net Worth</th>
                  <th className="p-3">Total ROI</th>
                  <th className="p-3 text-right">Trades</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {rankedPlayers.map((player, idx) => (
                  <tr
                    key={player.id}
                    className={player.id === playerId ? 'bg-emerald-500/10 font-bold' : 'hover:bg-slate-900/40'}
                  >
                    <td className="p-3 font-mono">
                      {idx === 0 ? '🥇 #1' : idx === 1 ? '🥈 #2' : idx === 2 ? '🥉 #3' : `#${idx + 1}`}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span>{player.avatar}</span>
                        <div>
                          <span className="font-bold text-slate-100">{player.name}</span>
                          <span className="text-[10px] text-slate-400 block">{player.firmTitle}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 font-black text-amber-400">{formatCurrency(player.netWorth)}</td>
                    <td className={`p-3 font-bold ${player.roiPercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {player.roiPercent >= 0 ? '+' : ''}{player.roiPercent.toFixed(1)}%
                    </td>
                    <td className="p-3 text-right tabular-nums">{player.totalTrades}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-center gap-3 pt-4">
            <button
              onClick={() => {
                leaveRoom();
                sounds.playBell();
              }}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              Return To Lobby
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
