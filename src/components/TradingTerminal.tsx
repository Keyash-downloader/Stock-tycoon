import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Flame, 
  Zap, 
  ShieldAlert, 
  Info, 
  DollarSign, 
  Maximize2, 
  Activity,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  AlertCircle,
  Bell,
  BellRing,
  Trash2,
  Target
} from 'lucide-react';
import { Stock, Position, OptionContract, Sector, NetWorthSnapshot, MarketBriefing, PriceAlert } from '../types/game';
import { NetWorthD3Chart } from './NetWorthD3Chart';
import { MarketSentimentGauge } from './MarketSentimentGauge';
import { DailyMarketBriefing } from './DailyMarketBriefing';

interface TradingTerminalProps {
  stocks: Stock[];
  positions: Position[];
  options: OptionContract[];
  cash: number;
  netWorth: number;
  netWorthHistory: NetWorthSnapshot[];
  currentBriefing: MarketBriefing;
  briefingArchive: MarketBriefing[];
  alerts: PriceAlert[];
  onAddAlert: (alert: { symbol: string; targetPrice: number; condition: 'ABOVE' | 'BELOW' }) => void;
  onDeleteAlert: (id: string) => void;
  selectedStockSymbol?: string;
  onSelectStockSymbol?: (symbol: string) => void;
  maxLeverage: number;
  canTradeOptions: boolean;
  onExecuteTrade: (params: {
    symbol: string;
    shares: number;
    type: 'LONG' | 'SHORT';
    leverage: number;
  }) => void;
  onClosePosition: (symbol: string) => void;
  onBuyOption: (params: {
    symbol: string;
    type: 'CALL' | 'PUT';
    strikePrice: number;
    premiumPerShare: number;
    contracts: number;
  }) => void;
  onExerciseOption: (optionId: string) => void;
}

export const TradingTerminal: React.FC<TradingTerminalProps> = ({
  stocks,
  positions,
  options,
  cash,
  netWorth,
  netWorthHistory,
  currentBriefing,
  briefingArchive,
  alerts,
  onAddAlert,
  onDeleteAlert,
  selectedStockSymbol,
  onSelectStockSymbol,
  maxLeverage,
  canTradeOptions,
  onExecuteTrade,
  onClosePosition,
  onBuyOption,
  onExerciseOption,
}) => {
  const [selectedSymbol, setSelectedSymbol] = useState<string>(selectedStockSymbol || stocks[0]?.symbol || 'NVX');
  const [selectedSector, setSelectedSector] = useState<Sector | 'ALL'>('ALL');
  const [tradeAction, setTradeAction] = useState<'BUY' | 'SHORT' | 'OPTIONS'>('BUY');
  const [sharesInput, setSharesInput] = useState<number>(10);
  const [leverage, setLeverage] = useState<number>(1);
  const [chartType, setChartType] = useState<'CANDLE' | 'LINE'>('CANDLE');
  const [hoveredCandle, setHoveredCandle] = useState<number | null>(null);

  // Price Alert UI State
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [isAlertListOpen, setIsAlertListOpen] = useState(false);
  const [alertCondition, setAlertCondition] = useState<'ABOVE' | 'BELOW'>('ABOVE');
  const [alertTargetPrice, setAlertTargetPrice] = useState<number>(450);

  // Options state
  const [optionType, setOptionType] = useState<'CALL' | 'PUT'>('CALL');
  const [contractsCount, setContractsCount] = useState<number>(1);

  // Sync with selectedStockSymbol if provided externally
  React.useEffect(() => {
    if (selectedStockSymbol && selectedStockSymbol !== selectedSymbol) {
      setSelectedSymbol(selectedStockSymbol);
    }
  }, [selectedStockSymbol]);

  const currentStock = stocks.find((s) => s.symbol === selectedSymbol) || stocks[0];
  const activePosition = positions.find((p) => p.symbol === selectedSymbol);

  const filteredStocks = selectedSector === 'ALL' 
    ? stocks 
    : stocks.filter((s) => s.sector === selectedSector);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(val);
  };

  // Trade calculations
  const totalCost = (sharesInput * currentStock.price) / leverage;
  const maxAffordableShares = Math.max(0, Math.floor((cash * leverage) / currentStock.price));

  const handleQuickPercent = (pct: number) => {
    const calculated = Math.floor((cash * leverage * pct) / currentStock.price);
    setSharesInput(Math.max(1, calculated));
  };

  const handleExecute = () => {
    if (sharesInput <= 0 || totalCost > cash) return;
    onExecuteTrade({
      symbol: currentStock.symbol,
      shares: sharesInput,
      type: tradeAction === 'BUY' ? 'LONG' : 'SHORT',
      leverage,
    });
  };

  const handleOpenAlertModal = () => {
    setAlertTargetPrice(Math.round(currentStock.price * 1.05 * 10) / 10);
    setAlertCondition('ABOVE');
    setIsAlertModalOpen(true);
  };

  const handleSaveAlert = () => {
    if (alertTargetPrice <= 0) return;
    onAddAlert({
      symbol: currentStock.symbol,
      targetPrice: alertTargetPrice,
      condition: alertCondition,
    });
    setIsAlertModalOpen(false);
  };

  const activeAlertsForCurrentStock = alerts.filter(
    (a) => a.symbol === currentStock.symbol && !a.triggered
  );
  const allActiveAlerts = alerts.filter((a) => !a.triggered);

  // Option strike price tiers (e.g. at the money, out of the money)
  const strikeMultiplier = optionType === 'CALL' ? 1.08 : 0.92;
  const strikePrice = Math.round(currentStock.price * strikeMultiplier * 10) / 10;
  const premiumPerShare = Math.max(0.5, Math.round(currentStock.price * currentStock.volatility * 0.35 * 100) / 100);
  const totalOptionCost = premiumPerShare * 100 * contractsCount;

  const handleBuyOptionOrder = () => {
    if (totalOptionCost > cash || contractsCount <= 0) return;
    onBuyOption({
      symbol: currentStock.symbol,
      type: optionType,
      strikePrice,
      premiumPerShare,
      contracts: contractsCount,
    });
  };

  // SVG Chart Dimensions
  const chartHeight = 240;
  const chartWidth = 600;
  const candles = currentStock.history || [];
  const minPrice = Math.min(...candles.map((c) => c.low)) * 0.98;
  const maxPrice = Math.max(...candles.map((c) => c.high)) * 1.02;
  const priceRange = Math.max(1, maxPrice - minPrice);

  const getY = (val: number) => {
    return chartHeight - ((val - minPrice) / priceRange) * (chartHeight - 40) - 20;
  };

  const candleSpacing = chartWidth / (candles.length + 1);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-4 space-y-4">
      {/* Daily Market Briefing Wire */}
      <DailyMarketBriefing currentBriefing={currentBriefing} archive={briefingArchive} />

      {/* Ticker Selector Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {['ALL', 'Big Tech & AI', 'BioPharma & Genomics', 'Energy & Commodities', 'Defense & Aerospace', 'Consumer & Luxury', 'FinTech & Degens'].map((sec) => (
          <button
            key={sec}
            onClick={() => setSelectedSector(sec as Sector | 'ALL')}
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              selectedSector === sec
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {sec}
          </button>
        ))}
      </div>

      {/* Real-time Market Sentiment Gauge (Fear & Greed Index & Volatility) */}
      <MarketSentimentGauge stocks={stocks} />

      {/* Main Terminal Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Watchlist (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-3 flex flex-col h-[680px]">
          <div className="flex items-center justify-between px-2 pb-2 border-b border-slate-800/80 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              Watchlist
            </span>
            <span className="text-[10px] text-slate-500">{filteredStocks.length} Tickers</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
            {filteredStocks.map((stock) => {
              const isSelected = stock.symbol === selectedSymbol;
              const isUp = stock.changePercent >= 0;
              const hasPosition = positions.some((p) => p.symbol === stock.symbol);

              return (
                <div
                  key={stock.symbol}
                  onClick={() => setSelectedSymbol(stock.symbol)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-slate-800 border-emerald-500/50 shadow-lg shadow-emerald-500/5'
                      : 'bg-slate-950/50 border-slate-800/60 hover:bg-slate-800/40 hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-100 text-sm">{stock.symbol}</span>
                      {stock.isHot && (
                        <span className="text-[10px] bg-rose-500/20 text-rose-400 border border-rose-500/30 px-1 rounded flex items-center gap-0.5">
                          <Flame className="w-2.5 h-2.5" /> HOT
                        </span>
                      )}
                      {hasPosition && (
                        <span className="w-2 h-2 rounded-full bg-emerald-400" title="Active Position" />
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400 truncate max-w-[140px]">{stock.name}</span>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-slate-100 text-sm tabular-nums">
                      {formatCurrency(stock.price)}
                    </div>
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

        {/* Center/Right Column: Chart & Order Station (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {/* Top: Selected Stock Overview & Interactive Candlestick Chart */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
            {/* Stock Header Banner */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-black text-slate-100 tracking-tight">{currentStock.name}</h2>
                  <span className="px-2 py-0.5 rounded-md bg-slate-800 text-emerald-400 text-xs font-mono font-bold">
                    ${currentStock.symbol}
                  </span>
                  <span className="text-xs text-slate-400 px-2 py-0.5 bg-slate-800/80 rounded border border-slate-700">
                    {currentStock.sector}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 max-w-xl">{currentStock.description}</p>
              </div>

              <div className="text-right">
                <div className="text-3xl font-black text-slate-100 tabular-nums">
                  {formatCurrency(currentStock.price)}
                </div>
                <div
                  className={`text-sm font-bold tabular-nums flex items-center justify-end gap-1 ${
                    currentStock.changePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {currentStock.changePercent >= 0 ? '+' : ''}{currentStock.changePercent.toFixed(2)}% this week
                </div>

                {/* Price Alert Action Buttons */}
                <div className="flex items-center justify-end gap-2 mt-2">
                  <button
                    onClick={handleOpenAlertModal}
                    className="px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-[11px] font-bold transition cursor-pointer flex items-center gap-1 shadow-sm"
                    title={`Set Target Price Alert for ${currentStock.symbol}`}
                  >
                    <Bell className="w-3.5 h-3.5" />
                    <span>Set Price Alert</span>
                    {activeAlertsForCurrentStock.length > 0 && (
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse ml-0.5" />
                    )}
                  </button>

                  <button
                    onClick={() => setIsAlertListOpen(true)}
                    className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition cursor-pointer flex items-center gap-1 font-mono"
                    title="Manage Active Price Alerts"
                  >
                    <BellRing className="w-3.5 h-3.5 text-amber-400" />
                    <span>{allActiveAlerts.length} Active</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Catalyst Alert if present */}
            {currentStock.catalystNews && (
              <div className="mb-3 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                <span><strong>Catalyst Flash:</strong> {currentStock.catalystNews}</span>
              </div>
            )}

            {/* Chart Toolbar */}
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setChartType('CANDLE')}
                  className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer ${
                    chartType === 'CANDLE' ? 'bg-slate-800 text-emerald-400 border border-slate-700' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Candlesticks
                </button>
                <button
                  onClick={() => setChartType('LINE')}
                  className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer ${
                    chartType === 'LINE' ? 'bg-slate-800 text-sky-400 border border-slate-700' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Line View
                </button>
              </div>

              <div className="tabular-nums font-mono text-[11px] text-slate-500">
                Range: ${minPrice.toFixed(1)} - ${maxPrice.toFixed(1)}
              </div>
            </div>

            {/* SVG Candlestick / Line Chart Viewport */}
            <div className="relative w-full h-[240px] bg-slate-950 rounded-xl border border-slate-800/80 overflow-hidden flex items-center justify-center">
              <svg 
                viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
                className="w-full h-full"
                preserveAspectRatio="none"
              >
                {/* Horizontal Grid lines */}
                {[0.25, 0.5, 0.75].map((ratio) => (
                  <line
                    key={ratio}
                    x1="0"
                    y1={chartHeight * ratio}
                    x2={chartWidth}
                    y2={chartHeight * ratio}
                    stroke="#1e293b"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                ))}

                {/* Candles Rendering */}
                {chartType === 'CANDLE' &&
                  candles.map((candle, idx) => {
                    const cx = (idx + 1) * candleSpacing;
                    const isGreen = candle.close >= candle.open;
                    const topBody = getY(Math.max(candle.open, candle.close));
                    const bottomBody = getY(Math.min(candle.open, candle.close));
                    const bodyHeight = Math.max(2, bottomBody - topBody);
                    const wickTop = getY(candle.high);
                    const wickBottom = getY(candle.low);
                    const candleColor = isGreen ? '#10b981' : '#f43f5e';

                    return (
                      <g 
                        key={idx}
                        onMouseEnter={() => setHoveredCandle(idx)}
                        onMouseLeave={() => setHoveredCandle(null)}
                        className="cursor-pointer transition-opacity hover:opacity-80"
                      >
                        {/* Upper & Lower Wick */}
                        <line
                          x1={cx}
                          y1={wickTop}
                          x2={cx}
                          y2={wickBottom}
                          stroke={candleColor}
                          strokeWidth="1.5"
                        />
                        {/* Real Body */}
                        <rect
                          x={cx - 5}
                          y={topBody}
                          width="10"
                          height={bodyHeight}
                          fill={candleColor}
                          rx="1"
                        />
                      </g>
                    );
                  })}

                {/* Line Chart Rendering */}
                {chartType === 'LINE' && (
                  <>
                    <defs>
                      <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      d={
                        `M ${(1) * candleSpacing} ${getY(candles[0]?.close || 100)} ` +
                        candles.map((c, i) => `L ${(i + 1) * candleSpacing} ${getY(c.close)}`).join(' ') +
                        ` L ${(candles.length) * candleSpacing} ${chartHeight} L ${candleSpacing} ${chartHeight} Z`
                      }
                      fill="url(#areaGradient)"
                    />
                    <path
                      d={
                        `M ${(1) * candleSpacing} ${getY(candles[0]?.close || 100)} ` +
                        candles.map((c, i) => `L ${(i + 1) * candleSpacing} ${getY(c.close)}`).join(' ')
                      }
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </>
                )}
              </svg>

              {/* Hover Tooltip Overlay */}
              {hoveredCandle !== null && candles[hoveredCandle] && (
                <div className="absolute top-2 left-2 bg-slate-900/95 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-200 shadow-xl tabular-nums pointer-events-none flex items-center gap-3">
                  <span>Wk {candles[hoveredCandle].week}</span>
                  <span>O: ${candles[hoveredCandle].open}</span>
                  <span>H: ${candles[hoveredCandle].high}</span>
                  <span>L: ${candles[hoveredCandle].low}</span>
                  <span className={candles[hoveredCandle].close >= candles[hoveredCandle].open ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                    C: ${candles[hoveredCandle].close}
                  </span>
                </div>
              )}
            </div>

            {/* Quick Fundamentals Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-3 border-t border-slate-800 text-xs">
              <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">Market Cap</span>
                <span className="font-semibold text-slate-200">${currentStock.marketCap}B</span>
              </div>
              <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">P/E Ratio</span>
                <span className="font-semibold text-slate-200">{currentStock.peRatio > 0 ? currentStock.peRatio : 'N/A (Growth)'}</span>
              </div>
              <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">Weekly Div Yield</span>
                <span className="font-semibold text-emerald-400">
                  {(currentStock.dividendYield * 100).toFixed(1)}%
                  {currentStock.dividendYield > 0 && (
                    <span className="text-[10px] text-slate-400 font-mono ml-1">
                      (+${((currentStock.price * currentStock.dividendYield) / 52).toFixed(2)}/wk)
                    </span>
                  )}
                </span>
              </div>
              <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">Short Float</span>
                <span className={`font-semibold ${currentStock.shortInterest && currentStock.shortInterest > 20 ? 'text-rose-400' : 'text-slate-200'}`}>
                  {currentStock.shortInterest ? `${currentStock.shortInterest}% (High)` : 'Low (<5%)'}
                </span>
              </div>
            </div>
          </div>

          {/* Bottom: Order Execution Desk */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
            {/* Action Tabs: Long vs Short vs Options */}
            <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
              <button
                onClick={() => setTradeAction('BUY')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  tradeAction === 'BUY'
                    ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <ArrowUpRight className="w-4 h-4" />
                Buy (Long)
              </button>

              <button
                onClick={() => setTradeAction('SHORT')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  tradeAction === 'SHORT'
                    ? 'bg-rose-500 text-slate-950 shadow-lg shadow-rose-500/20'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <ArrowDownRight className="w-4 h-4" />
                Short (Sell Short)
              </button>

              <button
                onClick={() => setTradeAction('OPTIONS')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  tradeAction === 'OPTIONS'
                    ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <Layers className="w-4 h-4" />
                Options Desk
                {!canTradeOptions && <span className="text-[9px] px-1 bg-slate-800 text-slate-400 rounded">LOCKED</span>}
              </button>
            </div>

            {/* Standard Equities Long/Short Order Controls */}
            {tradeAction !== 'OPTIONS' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Shares Input */}
                  <div>
                    <label className="text-xs text-slate-400 font-semibold mb-1 block">Number of Shares</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        max={maxAffordableShares || 1}
                        value={sharesInput}
                        onChange={(e) => setSharesInput(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 font-bold tabular-nums text-sm focus:outline-none focus:border-emerald-500"
                      />
                      <button
                        onClick={() => setSharesInput(maxAffordableShares)}
                        className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold font-mono cursor-pointer"
                      >
                        MAX
                      </button>
                    </div>

                    {/* Quick percentage buttons */}
                    <div className="grid grid-cols-4 gap-1.5 mt-2">
                      {[0.25, 0.5, 0.75, 1.0].map((pct) => (
                        <button
                          key={pct}
                          onClick={() => handleQuickPercent(pct)}
                          className="py-1 rounded bg-slate-950 border border-slate-800/80 hover:border-slate-700 text-[11px] font-mono text-slate-400 hover:text-slate-200 cursor-pointer"
                        >
                          {pct * 100}%
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Leverage Selector */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs text-slate-400 font-semibold">Margin Leverage</label>
                      <span className="text-xs font-bold text-amber-400 font-mono">{leverage}x</span>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      {[1, 2, 5, 10, 20, 35, 50].map((lev) => {
                        const isUnlocked = lev <= maxLeverage;
                        return (
                          <button
                            key={lev}
                            disabled={!isUnlocked}
                            onClick={() => setLeverage(lev)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                              leverage === lev
                                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                                : isUnlocked
                                ? 'bg-slate-950 border border-slate-800 text-slate-300 hover:border-slate-700'
                                : 'bg-slate-950/40 border border-slate-900 text-slate-600 cursor-not-allowed'
                            }`}
                          >
                            {lev}x
                          </button>
                        );
                      })}
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      Max leverage ({maxLeverage}x) unlocked by your current Career Desk seat.
                    </span>
                  </div>
                </div>

                {/* Financial Summary & Execute CTA */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-800/80">
                  <div className="text-xs tabular-nums space-y-0.5">
                    <div className="text-slate-400">
                      Total Trade Value: <strong className="text-slate-200">{formatCurrency(sharesInput * currentStock.price)}</strong>
                    </div>
                    <div className="text-slate-400">
                      Required Margin Cash: <strong className="text-emerald-400">{formatCurrency(totalCost)}</strong>
                    </div>
                  </div>

                  <button
                    onClick={handleExecute}
                    disabled={totalCost > cash || sharesInput <= 0}
                    className={`px-8 py-3 rounded-xl font-black text-sm tracking-wide transition shadow-lg cursor-pointer flex items-center gap-2 ${
                      totalCost > cash
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : tradeAction === 'BUY'
                        ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/25'
                        : 'bg-rose-500 hover:bg-rose-400 text-slate-950 shadow-rose-500/25'
                    }`}
                  >
                    <span>EXECUTE {tradeAction === 'BUY' ? 'LONG' : 'SHORT'}</span>
                    <span className="font-mono">({formatCurrency(totalCost)})</span>
                  </button>
                </div>
              </div>
            )}

            {/* Options Desk Station */}
            {tradeAction === 'OPTIONS' && (
              <div>
                {!canTradeOptions ? (
                  <div className="p-6 text-center rounded-xl bg-slate-950/60 border border-slate-800">
                    <ShieldAlert className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                    <h3 className="font-bold text-slate-200 text-sm">Options Desk Locked</h3>
                    <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                      Options trading requires promotion to <strong>Senior Portfolio Manager</strong> or above. Check the Career & Desk tab to qualify!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Call vs Put */}
                      <div>
                        <label className="text-xs text-slate-400 font-semibold mb-1 block">Contract Direction</label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => setOptionType('CALL')}
                            className={`py-2 rounded-xl text-xs font-bold uppercase transition cursor-pointer ${
                              optionType === 'CALL'
                                ? 'bg-emerald-500 text-slate-950'
                                : 'bg-slate-950 text-slate-400 border border-slate-800'
                            }`}
                          >
                            CALL (Bullish Bet)
                          </button>
                          <button
                            onClick={() => setOptionType('PUT')}
                            className={`py-2 rounded-xl text-xs font-bold uppercase transition cursor-pointer ${
                              optionType === 'PUT'
                                ? 'bg-rose-500 text-slate-950'
                                : 'bg-slate-950 text-slate-400 border border-slate-800'
                            }`}
                          >
                            PUT (Bearish Crash Bet)
                          </button>
                        </div>
                      </div>

                      {/* Contracts count */}
                      <div>
                        <label className="text-xs text-slate-400 font-semibold mb-1 block">Contracts (100 sh/contract)</label>
                        <input
                          type="number"
                          min="1"
                          max="50"
                          value={contractsCount}
                          onChange={(e) => setContractsCount(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 font-bold tabular-nums text-sm focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs flex flex-wrap items-center justify-between gap-2 tabular-nums">
                      <div>
                        <span className="text-slate-500">Strike Price: </span>
                        <strong className="text-slate-200">{formatCurrency(strikePrice)}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500">Premium / Share: </span>
                        <strong className="text-amber-400">{formatCurrency(premiumPerShare)}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500">Expiry: </span>
                        <strong className="text-slate-200">4 Weeks</strong>
                      </div>
                      <div>
                        <span className="text-slate-500">Total Premium Cost: </span>
                        <strong className="text-emerald-400 font-bold">{formatCurrency(totalOptionCost)}</strong>
                      </div>
                    </div>

                    <button
                      onClick={handleBuyOptionOrder}
                      disabled={totalOptionCost > cash}
                      className={`w-full py-3 rounded-xl font-black text-sm tracking-wide transition shadow-lg cursor-pointer ${
                        totalOptionCost > cash
                          ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/25'
                      }`}
                    >
                      BUY {contractsCount}x {currentStock.symbol} {strikePrice} {optionType} OPTIONS ({formatCurrency(totalOptionCost)})
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* D3 Historical Net Worth Growth Visualization (Last 12 Weeks) */}
      <NetWorthD3Chart history={netWorthHistory} currentNetWorth={netWorth} />

      {/* Open Positions & Options Portfolio Section */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
        <h3 className="font-bold text-slate-200 text-sm mb-3 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            Active Portfolio Positions ({positions.length} Equities · {options.length} Options)
          </span>
        </h3>

        {positions.length === 0 && options.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs">
            No active positions. Execute a long, short, or options trade on the trading floor!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs tabular-nums">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 uppercase text-[10px]">
                  <th className="py-2 px-3">Asset</th>
                  <th className="py-2 px-3">Position</th>
                  <th className="py-2 px-3">Size / Qty</th>
                  <th className="py-2 px-3">Entry Price</th>
                  <th className="py-2 px-3">Current Price</th>
                  <th className="py-2 px-3">Weekly Div</th>
                  <th className="py-2 px-3">Unrealized PnL</th>
                  <th className="py-2 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {positions.map((pos) => {
                  const stock = stocks.find((s) => s.symbol === pos.symbol);
                  const currentPrice = stock ? stock.price : pos.averagePrice;
                  const isProfit = pos.currentPnL >= 0;

                  return (
                    <tr key={pos.symbol} className="hover:bg-slate-800/30 transition">
                      <td className="py-2.5 px-3 font-bold text-slate-200">
                        {pos.symbol}
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            pos.type === 'LONG'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {pos.type} {pos.leverage > 1 ? `${pos.leverage}x` : ''}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-300 font-semibold">
                        {pos.shares} sh
                      </td>
                      <td className="py-2.5 px-3 text-slate-400">
                        {formatCurrency(pos.averagePrice)}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-slate-200">
                        {formatCurrency(currentPrice)}
                      </td>
                      <td className="py-2.5 px-3 font-mono">
                        {stock && pos.type === 'LONG' && stock.dividendYield > 0 ? (
                          <span className="text-emerald-400 font-bold text-[11px] bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                            +${((pos.shares * stock.price * stock.dividendYield) / 52).toFixed(2)}/wk
                          </span>
                        ) : (
                          <span className="text-slate-600 text-[11px]">-</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 font-bold">
                        <span className={isProfit ? 'text-emerald-400' : 'text-rose-400'}>
                          {isProfit ? '+' : ''}{formatCurrency(pos.currentPnL)} ({pos.pnlPercent >= 0 ? '+' : ''}{pos.pnlPercent.toFixed(1)}%)
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={() => onClosePosition(pos.symbol)}
                          className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold transition cursor-pointer"
                        >
                          Close / Liquidate
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {/* Options Table Rows */}
                {options.map((opt) => {
                  const stock = stocks.find((s) => s.symbol === opt.symbol);
                  const currentPrice = stock ? stock.price : opt.strikePrice;
                  const isProfit = opt.currentPnL >= 0;

                  return (
                    <tr key={opt.id} className="hover:bg-slate-800/30 transition bg-amber-500/5">
                      <td className="py-2.5 px-3 font-bold text-amber-300">
                        {opt.symbol} {opt.type}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {opt.contracts}x Strike ${opt.strikePrice}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-300 font-semibold">
                        {opt.contracts * 100} sh equiv
                      </td>
                      <td className="py-2.5 px-3 text-slate-400">
                        Premium {formatCurrency(opt.premiumPerShare)}
                      </td>
                      <td className="py-2.5 px-3 text-slate-400">
                        {opt.expiryWeeksRemaining} wks left
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 font-mono text-[11px]">
                        -
                      </td>
                      <td className="py-2.5 px-3 font-bold">
                        <span className={isProfit ? 'text-emerald-400' : 'text-rose-400'}>
                          {isProfit ? '+' : ''}{formatCurrency(opt.currentPnL)}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={() => onExerciseOption(opt.id)}
                          className="px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-semibold transition cursor-pointer"
                        >
                          Cash Out
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

      {/* Price Alert Configuration Modal */}
      {isAlertModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-5 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-100 text-sm">
                    Set Price Alert · ${currentStock.symbol}
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    Current: <strong className="text-emerald-400">{formatCurrency(currentStock.price)}</strong>
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsAlertModalOpen(false)}
                className="text-slate-500 hover:text-slate-300 transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Trigger Condition: Above vs Below */}
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Trigger Condition</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setAlertCondition('ABOVE')}
                    className={`py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                      alertCondition === 'ABOVE'
                        ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                        : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    Crosses Above (≥)
                  </button>

                  <button
                    onClick={() => setAlertCondition('BELOW')}
                    className={`py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                      alertCondition === 'BELOW'
                        ? 'bg-rose-500 text-slate-950 shadow-md shadow-rose-500/20'
                        : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <ArrowDownRight className="w-3.5 h-3.5" />
                    Drops Below (≤)
                  </button>
                </div>
              </div>

              {/* Target Price Input */}
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Target Price ($)</label>
                <input
                  type="number"
                  step="0.5"
                  value={alertTargetPrice}
                  onChange={(e) => setAlertTargetPrice(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 font-bold tabular-nums text-sm focus:outline-none focus:border-amber-500"
                />

                {/* Quick Presets */}
                <div className="grid grid-cols-6 gap-1.5 mt-2">
                  {[0.05, 0.1, 0.2, -0.05, -0.1, -0.2].map((pct) => (
                    <button
                      key={pct}
                      onClick={() => {
                        const target = Math.round(currentStock.price * (1 + pct) * 10) / 10;
                        setAlertTargetPrice(target);
                        setAlertCondition(pct > 0 ? 'ABOVE' : 'BELOW');
                      }}
                      className="py-1 rounded bg-slate-950 border border-slate-800 hover:border-slate-700 text-[10px] font-mono font-semibold text-slate-400 hover:text-slate-200 cursor-pointer"
                    >
                      {pct > 0 ? `+${pct * 100}%` : `${pct * 100}%`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Summary note */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400">
                You will receive a real-time browser-style notification the moment ${currentStock.symbol} hits or exceeds{' '}
                <strong className="text-amber-300 font-mono">{formatCurrency(alertTargetPrice)}</strong> during weekly market updates.
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  onClick={() => setIsAlertModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSaveAlert}
                  disabled={alertTargetPrice <= 0}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow-md shadow-amber-500/20"
                >
                  <Bell className="w-3.5 h-3.5" />
                  Save Price Alert
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Price Alerts Manager Modal */}
      {isAlertListOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-5 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                  <BellRing className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-100 text-sm">
                    Active Price Alerts ({allActiveAlerts.length})
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    Watching simulated tickers across trading weeks
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsAlertListOpen(false)}
                className="text-slate-500 hover:text-slate-300 transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Alerts List */}
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1 mb-4">
              {allActiveAlerts.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs">
                  No active price alerts set. Open any stock and click "Set Price Alert" to track triggers.
                </div>
              ) : (
                allActiveAlerts.map((alert) => {
                  const stock = stocks.find((s) => s.symbol === alert.symbol);
                  const currentPrice = stock ? stock.price : 0;
                  const isAbove = alert.condition === 'ABOVE';

                  return (
                    <div
                      key={alert.id}
                      className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-slate-200">
                          ${alert.symbol}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.2 rounded flex items-center gap-0.5 ${
                                isAbove
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                              }`}
                            >
                              {isAbove ? '≥' : '≤'} {formatCurrency(alert.targetPrice)}
                            </span>
                            <span className="text-slate-500 text-[10px] font-mono">
                              Set W{alert.createdWeek}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400 mt-0.5 block font-mono">
                            Current: <strong className="text-slate-200">{formatCurrency(currentPrice)}</strong>
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedSymbol(alert.symbol);
                            setIsAlertListOpen(false);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition cursor-pointer"
                        >
                          View Ticker
                        </button>

                        <button
                          onClick={() => onDeleteAlert(alert.id)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition cursor-pointer"
                          title="Delete Alert"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => {
                  setIsAlertListOpen(false);
                  handleOpenAlertModal();
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs tracking-wide transition cursor-pointer"
              >
                + Set Alert on ${currentStock.symbol}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
