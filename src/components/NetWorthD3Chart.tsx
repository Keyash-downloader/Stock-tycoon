import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { NetWorthSnapshot } from '../types/game';
import { TrendingUp, TrendingDown, DollarSign, Activity, Maximize2, Layers } from 'lucide-react';

interface NetWorthD3ChartProps {
  history: NetWorthSnapshot[];
  currentNetWorth: number;
}

export const NetWorthD3Chart: React.FC<NetWorthD3ChartProps> = ({ history, currentNetWorth }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  
  const [activeMetric, setActiveMetric] = useState<'NET_WORTH' | 'ALL'>('NET_WORTH');
  const [hoveredData, setHoveredData] = useState<NetWorthSnapshot | null>(null);

  // Take the last 12 weeks of data
  const data = history.slice(-12);

  const startValue = data[0]?.netWorth || currentNetWorth;
  const latestValue = data[data.length - 1]?.netWorth || currentNetWorth;
  const netDelta = latestValue - startValue;
  const percentDelta = startValue > 0 ? (netDelta / startValue) * 100 : 0;
  const isPositive = netDelta >= 0;

  const formatCurrency = (val: number) => {
    if (val >= 1000000) {
      return `$${(val / 1000000).toFixed(2)}M`;
    }
    if (val >= 1000) {
      return `$${(val / 1000).toFixed(1)}k`;
    }
    return `$${Math.round(val)}`;
  };

  const formatFullCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    // Dimensions
    const width = 640;
    const height = 220;
    const margin = { top: 20, right: 24, bottom: 30, left: 54 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    svg.attr('viewBox', `0 0 ${width} ${height}`);

    // Container Group
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // X Scale (Weeks)
    const xScale = d3
      .scalePoint<number>()
      .domain(data.map((d) => d.week))
      .range([0, innerWidth])
      .padding(0.1);

    // Y Scale (Values)
    const allValues = activeMetric === 'ALL'
      ? data.flatMap((d) => [d.netWorth, d.cash, d.portfolioValue])
      : data.map((d) => d.netWorth);

    const minVal = Math.min(...allValues);
    const maxVal = Math.max(...allValues);
    const yPadding = Math.max(1000, (maxVal - minVal) * 0.15);

    const yScale = d3
      .scaleLinear()
      .domain([Math.max(0, minVal - yPadding), maxVal + yPadding])
      .range([innerHeight, 0])
      .nice();

    // Defs for gradients & shadow filters
    const defs = svg.append('defs');

    // Net worth glowing gradient
    const netWorthGradient = defs
      .append('linearGradient')
      .attr('id', 'd3NetWorthGradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    netWorthGradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', isPositive ? '#10b981' : '#f43f5e')
      .attr('stop-opacity', 0.4);

    netWorthGradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', isPositive ? '#10b981' : '#f43f5e')
      .attr('stop-opacity', 0.0);

    // Grid lines (horizontal)
    const yTicks = yScale.ticks(4);
    g.append('g')
      .attr('class', 'grid')
      .selectAll('line')
      .data(yTicks)
      .enter()
      .append('line')
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', (d) => yScale(d))
      .attr('y2', (d) => yScale(d))
      .attr('stroke', '#1e293b')
      .attr('stroke-dasharray', '3 3')
      .attr('stroke-width', 1);

    // Area generator for primary Net Worth
    const areaGenerator = d3
      .area<NetWorthSnapshot>()
      .x((d) => xScale(d.week) || 0)
      .y0(innerHeight)
      .y1((d) => yScale(d.netWorth))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(data)
      .attr('fill', 'url(#d3NetWorthGradient)')
      .attr('d', areaGenerator);

    // Line generator for Net Worth
    const lineGenerator = d3
      .line<NetWorthSnapshot>()
      .x((d) => xScale(d.week) || 0)
      .y((d) => yScale(d.netWorth))
      .curve(d3.curveMonotoneX);

    // Render Net Worth Line
    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', isPositive ? '#10b981' : '#f43f5e')
      .attr('stroke-width', 2.5)
      .attr('stroke-linecap', 'round')
      .attr('d', lineGenerator);

    // If "ALL" metric is toggled: also render Portfolio Value line (Sky) and Cash line (Amber)
    if (activeMetric === 'ALL') {
      const portfolioLine = d3
        .line<NetWorthSnapshot>()
        .x((d) => xScale(d.week) || 0)
        .y((d) => yScale(d.portfolioValue))
        .curve(d3.curveMonotoneX);

      g.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', '#38bdf8')
        .attr('stroke-width', 1.8)
        .attr('stroke-dasharray', '4 2')
        .attr('d', portfolioLine);

      const cashLine = d3
        .line<NetWorthSnapshot>()
        .x((d) => xScale(d.week) || 0)
        .y((d) => yScale(d.cash))
        .curve(d3.curveMonotoneX);

      g.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', '#fbbf24')
        .attr('stroke-width', 1.8)
        .attr('stroke-dasharray', '2 2')
        .attr('d', cashLine);
    }

    // Interactive Hover Vertical Bar & Dot
    const focusGroup = g.append('g').style('display', 'none');

    // Vertical rule
    const focusLine = focusGroup
      .append('line')
      .attr('y1', 0)
      .attr('y2', innerHeight)
      .attr('stroke', '#94a3b8')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '3 3');

    // Circle at current net worth
    const focusCircle = focusGroup
      .append('circle')
      .attr('r', 5)
      .attr('fill', isPositive ? '#10b981' : '#f43f5e')
      .attr('stroke', '#0f172a')
      .attr('stroke-width', 2);

    // X Axis
    const xAxis = d3.axisBottom(xScale).tickFormat((d) => `W${d}`);
    const xAxisGroup = g
      .append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis);

    xAxisGroup.select('.domain').attr('stroke', '#334155');
    xAxisGroup.selectAll('.tick line').attr('stroke', '#334155');
    xAxisGroup
      .selectAll('.tick text')
      .attr('fill', '#94a3b8')
      .attr('font-size', '10px')
      .attr('font-family', 'monospace');

    // Y Axis
    const yAxis = d3
      .axisLeft(yScale)
      .ticks(4)
      .tickFormat((d) => formatCurrency(Number(d)));

    const yAxisGroup = g.append('g').call(yAxis);
    yAxisGroup.select('.domain').attr('stroke', '#334155');
    yAxisGroup.selectAll('.tick line').attr('stroke', '#334155');
    yAxisGroup
      .selectAll('.tick text')
      .attr('fill', '#94a3b8')
      .attr('font-size', '10px')
      .attr('font-family', 'monospace');

    // Interactive Overlay for pointer tracking
    const overlay = g
      .append('rect')
      .attr('width', innerWidth)
      .attr('height', innerHeight)
      .attr('fill', 'transparent')
      .attr('cursor', 'crosshair');

    overlay.on('pointermove', function (event) {
      const [pointerX] = d3.pointer(event);
      // Find closest week point
      const domain = data.map((d) => d.week);
      let closestSnapshot = data[0];
      let minDistance = Infinity;

      data.forEach((d) => {
        const xPos = xScale(d.week) || 0;
        const dist = Math.abs(xPos - pointerX);
        if (dist < minDistance) {
          minDistance = dist;
          closestSnapshot = d;
        }
      });

      const targetX = xScale(closestSnapshot.week) || 0;
      const targetY = yScale(closestSnapshot.netWorth);

      focusGroup.style('display', null);
      focusLine.attr('x1', targetX).attr('x2', targetX);
      focusCircle.attr('cx', targetX).attr('cy', targetY);

      setHoveredData(closestSnapshot);
    });

    overlay.on('pointerleave', function () {
      focusGroup.style('display', 'none');
      setHoveredData(null);
    });
  }, [data, activeMetric, isPositive]);

  return (
    <div
      ref={containerRef}
      className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl"
    >
      {/* Top Header & Metrics Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-400" />
              12-Week Historical Net Worth Growth (D3.js)
            </span>
          </div>
          <span className="text-[11px] text-slate-500 block mt-0.5">
            Rolling audited trajectory across career desks, trading returns, and asset acquisitions
          </span>
        </div>

        {/* Metric Mode Toggle */}
        <div className="flex items-center gap-2">
          <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px] flex items-center gap-1">
            <button
              onClick={() => setActiveMetric('NET_WORTH')}
              className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                activeMetric === 'NET_WORTH'
                  ? 'bg-emerald-500 text-slate-950'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Net Worth
            </button>
            <button
              onClick={() => setActiveMetric('ALL')}
              className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer flex items-center gap-1 ${
                activeMetric === 'ALL'
                  ? 'bg-sky-500 text-slate-950'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3 h-3" />
              Multi-Asset Split
            </button>
          </div>
        </div>
      </div>

      {/* Numerical Performance Readouts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3 text-xs tabular-nums">
        <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
          <span className="text-[10px] text-slate-500 uppercase block">12-Wk Starting NW</span>
          <span className="font-bold text-slate-300">{formatFullCurrency(startValue)}</span>
        </div>

        <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
          <span className="text-[10px] text-slate-500 uppercase block">Current NW</span>
          <span className="font-bold text-amber-400">{formatFullCurrency(latestValue)}</span>
        </div>

        <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
          <span className="text-[10px] text-slate-500 uppercase block">12-Wk Net Delta</span>
          <span
            className={`font-black flex items-center gap-1 ${
              isPositive ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            {isPositive ? '+' : ''}{formatFullCurrency(netDelta)}
          </span>
        </div>

        <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
          <span className="text-[10px] text-slate-500 uppercase block">Growth Return</span>
          <span
            className={`font-bold ${
              isPositive ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {isPositive ? '+' : ''}{percentDelta.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Legend if Multi-Asset is active */}
      {activeMetric === 'ALL' && (
        <div className="flex items-center gap-4 text-[11px] mb-2 px-1 text-slate-400 font-mono">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-emerald-400 rounded-full" />
            Net Worth (Combined)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-sky-400 rounded-full" />
            Portfolio Equity
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-amber-400 rounded-full" />
            Liquid Cash
          </span>
        </div>
      )}

      {/* D3 SVG Viewport */}
      <div className="relative w-full h-[220px] bg-slate-950 rounded-xl border border-slate-800/80 overflow-hidden flex items-center justify-center">
        <svg ref={svgRef} className="w-full h-full select-none" />

        {/* Floating Tooltip Pill */}
        {hoveredData && (
          <div className="absolute top-2 right-2 bg-slate-900/95 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-200 shadow-2xl tabular-nums pointer-events-none flex items-center gap-3 animate-in fade-in duration-100">
            <span className="text-amber-400 font-bold">Week {hoveredData.week}</span>
            <span>NW: <strong className="text-emerald-400">{formatFullCurrency(hoveredData.netWorth)}</strong></span>
            {activeMetric === 'ALL' && (
              <>
                <span className="text-slate-400">Cash: {formatCurrency(hoveredData.cash)}</span>
                <span className="text-slate-400">Port: {formatCurrency(hoveredData.portfolioValue)}</span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
