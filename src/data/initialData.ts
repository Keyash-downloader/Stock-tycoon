import { Stock, CareerStage, Rival, LuxuryItem, Scandal, RomancePartner, FinTwitPost, Sector } from '../types/game';

// Helper to generate realistic candle history
function generateCandles(basePrice: number, volatility: number, weeks: number = 16) {
  const candles = [];
  let current = basePrice;
  for (let i = 1; i <= weeks; i++) {
    const change = (Math.random() - 0.48) * volatility * current;
    const open = Math.max(1, current);
    const close = Math.max(1, open + change);
    const high = Math.max(open, close) + Math.random() * (open * volatility * 0.5);
    const low = Math.max(0.5, Math.min(open, close) - Math.random() * (open * volatility * 0.5));
    const volume = Math.floor(1000000 + Math.random() * 5000000);
    candles.push({
      week: i,
      open: Math.round(open * 100) / 100,
      high: Math.round(high * 100) / 100,
      low: Math.round(low * 100) / 100,
      close: Math.round(close * 100) / 100,
      volume
    });
    current = close;
  }
  return candles;
}

export const INITIAL_STOCKS: Stock[] = [
  {
    symbol: 'NVX',
    name: 'NovaX Neural Silicon',
    sector: 'Big Tech & AI',
    price: 485.50,
    previousPrice: 472.10,
    changePercent: 2.84,
    volatility: 0.12,
    marketCap: 2150,
    peRatio: 54.2,
    dividendYield: 0.005,
    description: 'Premier AI hyperscaler chipmaker powering sovereign superclusters.',
    catalystNews: 'Hyperscalers boost capital expenditure guidance by 35%.',
    isHot: true,
    history: generateCandles(420, 0.12)
  },
  {
    symbol: 'APPLX',
    name: 'Apex Sphere Devices',
    sector: 'Big Tech & AI',
    price: 198.20,
    previousPrice: 201.40,
    changePercent: -1.59,
    volatility: 0.07,
    marketCap: 2950,
    peRatio: 31.8,
    dividendYield: 0.012,
    description: 'Consumer hardware juggernaut with an impenetrable services ecosystem.',
    catalystNews: 'Record subscription revenue cushions modest hardware sales.',
    history: generateCandles(185, 0.07)
  },
  {
    symbol: 'CURE',
    name: 'GenVax Cellular Bio',
    sector: 'BioPharma & Genomics',
    price: 42.80,
    previousPrice: 34.50,
    changePercent: 24.06,
    volatility: 0.28,
    marketCap: 12.4,
    peRatio: -1, // unprofitable
    dividendYield: 0,
    description: 'Clinical biotech with pivotal Phase 3 oncology trial data pending this quarter.',
    catalystNews: 'FDA grants Accelerated Breakthrough Review designation.',
    isHot: true,
    shortInterest: 31.5,
    history: generateCandles(28, 0.28)
  },
  {
    symbol: 'TITAN',
    name: 'Titan Global Energy',
    sector: 'Energy & Commodities',
    price: 112.40,
    previousPrice: 110.80,
    changePercent: 1.44,
    volatility: 0.08,
    marketCap: 410,
    peRatio: 11.2,
    dividendYield: 0.048,
    description: 'Integrated energy behemoth commanding deepwater LNG and Arctic oil rigs.',
    catalystNews: 'OPEC+ surprises market with output quotas, bolstering spot crude prices.',
    history: generateCandles(105, 0.08)
  },
  {
    symbol: 'AEGIS',
    name: 'Aegis Defense Dynamics',
    sector: 'Defense & Aerospace',
    price: 340.10,
    previousPrice: 338.00,
    changePercent: 0.62,
    volatility: 0.06,
    marketCap: 165,
    peRatio: 22.4,
    dividendYield: 0.021,
    description: 'Classified missile defense systems, hypersonic drones, and satellite surveillance.',
    catalystNews: 'Pentagon awards $14B multi-year orbital interceptor contract.',
    history: generateCandles(320, 0.06)
  },
  {
    symbol: 'LVMX',
    name: 'Luxe Valois Empire',
    sector: 'Consumer & Luxury',
    price: 825.00,
    previousPrice: 840.00,
    changePercent: -1.78,
    volatility: 0.09,
    marketCap: 380,
    peRatio: 27.5,
    dividendYield: 0.018,
    description: 'Parisian conglomerate owning couture houses, vintage champagne, and fine watches.',
    catalystNews: 'Asian luxury travel rebound drives high-margin leather goods sales.',
    history: generateCandles(790, 0.09)
  },
  {
    symbol: 'MEME',
    name: 'ApeForge Holdings',
    sector: 'FinTech & Degens',
    price: 18.50,
    previousPrice: 14.10,
    changePercent: 31.20,
    volatility: 0.42,
    marketCap: 3.2,
    peRatio: -1,
    dividendYield: 0,
    description: 'The epicenter of retail options mania, heavily shorted by Wall Street hedge funds.',
    catalystNews: 'Reddit forum coordinates gamma squeeze targeting institutional short sellers!',
    isHot: true,
    shortInterest: 42.8,
    history: generateCandles(12, 0.42)
  },
  {
    symbol: 'BLOCK',
    name: 'Satoshi Digital Bank',
    sector: 'FinTech & Degens',
    price: 74.30,
    previousPrice: 78.50,
    changePercent: -5.35,
    volatility: 0.22,
    marketCap: 28.5,
    peRatio: 45.1,
    dividendYield: 0,
    description: 'Institutional custody, stablecoin settlement, and high-frequency crypto liquidity.',
    catalystNews: 'Regulatory inquiry into yield staking causes temporary liquidity discount.',
    history: generateCandles(65, 0.22)
  }
];

export const CAREER_STAGES: CareerStage[] = [
  {
    id: 0,
    title: 'Bedroom Day Trader',
    firmName: 'Self-Employed (Mom\'s Basement)',
    weeklySalary: 600, // freelancing / side hustle
    aumManaged: 0,
    carryPercent: 1.0, // keeps 100% of own trading profits
    minNetWorthReq: 0,
    minWinRateReq: 0,
    maxLeverageAllowed: 2,
    description: 'Armed with a dual-monitor setup, energy drinks, and raw ambition. Every dollar is your own skin in the game.',
    perks: ['Cash trading on major equities', 'Up to 2x margin leverage', 'Active FinTwit community access']
  },
  {
    id: 1,
    title: 'Prop Firm Funded Trader',
    firmName: 'Apex Capital Combines',
    weeklySalary: 1500,
    aumManaged: 250000,
    carryPercent: 0.80, // 80% profit split
    minNetWorthReq: 25000,
    minWinRateReq: 50,
    maxLeverageAllowed: 5,
    description: 'Passed the grueling combine challenge. You now trade institutional firm capital with an 80/20 profit split.',
    perks: ['5x buying power on firm book', 'Weekly performance profit splits', 'Access to Level 2 order flow data']
  },
  {
    id: 2,
    title: 'Execution Desk Analyst',
    firmName: 'Vance & Sterling Partners',
    weeklySalary: 4200,
    aumManaged: 5000000,
    carryPercent: 0.12,
    minNetWorthReq: 100000,
    minWinRateReq: 55,
    maxLeverageAllowed: 10,
    description: 'Full Wall Street desk seat. Execution orders for institutional clients, dark pools, and syndicated offerings.',
    perks: ['10x institutional leverage', 'Dark pool liquidity (zero slippage)', 'Annual Wall Street Gala invitation']
  },
  {
    id: 3,
    title: 'Senior Portfolio Manager',
    firmName: 'Citadel Horizon Global',
    weeklySalary: 12500,
    aumManaged: 50000000,
    carryPercent: 0.18,
    minNetWorthReq: 500000,
    minWinRateReq: 60,
    maxLeverageAllowed: 20,
    description: 'Commanding your own multi-million dollar pod. Managing analysts and trading macro trends with high leverage.',
    perks: ['20x macro leverage', 'Call & Put Options trading desk', 'Access to private insider briefings']
  },
  {
    id: 4,
    title: 'Hedge Fund Founder & CIO',
    firmName: 'Alpha Dominion Capital',
    weeklySalary: 35000,
    aumManaged: 250000000,
    carryPercent: 0.20, // 2% mgmt fee + 20% carry
    minNetWorthReq: 2500000,
    minWinRateReq: 65,
    maxLeverageAllowed: 35,
    description: 'You run the fund. Outside LP billionaires deposit their wealth with you. You take 2% management fee and 20% performance carry.',
    perks: ['2% annual AUM management fee', '35x institutional syndicate leverage', 'Hostile activist campaigns']
  },
  {
    id: 5,
    title: 'Sovereign Market Titan',
    firmName: 'Global Macro Sovereign Reserve',
    weeklySalary: 120000,
    aumManaged: 1500000000,
    carryPercent: 0.25,
    minNetWorthReq: 15000000,
    minWinRateReq: 70,
    maxLeverageAllowed: 50,
    description: 'The highest echelon of financial power. Central bankers whisper to you; your tweets can trigger market-wide trading halts.',
    perks: ['50x god-tier leverage', 'Can initiate market halt & whale buybacks', 'Permanent seat on WallRich 400']
  }
];

export const INITIAL_RIVALS: Rival[] = [
  {
    id: 'gordon',
    name: 'Gordon "The Vulture" Sterling',
    moniker: 'The Corporate Raider',
    firm: 'Sterling Hostile Capital',
    avatar: '🦅',
    netWorth: 1450000000,
    aum: 6200000000,
    strategy: 'Predatory short selling and hostile board takeovers.',
    weeklyQuote: '"Greed isn\'t just good—it\'s the only mathematical constant in this casino."',
    isRivalOfTheYear: true,
    statusBadge: 'Billionaire Raider'
  },
  {
    id: 'victoria',
    name: 'Victoria "Iceberg" Vance',
    moniker: 'The Iceberg',
    firm: 'Vance Global Macro',
    avatar: '❄️',
    netWorth: 890000000,
    aum: 4800000000,
    strategy: 'Cold, surgical interest rate derivatives and sovereign FX traps.',
    weeklyQuote: '"Amateurs stare at tickers. Professionals read balance sheets and central bank transcripts."',
    statusBadge: 'Macro Queen'
  },
  {
    id: 'kenji',
    name: 'Dr. Kenji Sato',
    moniker: 'The Algo King',
    firm: 'Quanta Neural High-Freq',
    avatar: '⚡',
    netWorth: 620000000,
    aum: 3100000000,
    strategy: 'Sub-microsecond co-located fiber arbitrage and ML predictive models.',
    weeklyQuote: '"Human traders are just friction in the order book waiting to be liquidated."',
    statusBadge: 'Quant Pioneer'
  },
  {
    id: 'chad',
    name: 'Roaring Chad',
    moniker: 'Meme King',
    firm: 'Ape Army Syndicate',
    avatar: '🚀',
    netWorth: 185000000,
    aum: 650000000,
    strategy: 'Social media gamma squeezes and degenerate 0DTE call options.',
    weeklyQuote: '"Hedge funds have risk models. We have diamond hands and unhinged internet memes."',
    statusBadge: 'Retail Hero'
  },
  {
    id: 'chloe',
    name: 'Lady Chloe Davenport',
    moniker: 'The Old Money Heiress',
    firm: 'Davenport & Sons (Est. 1824)',
    avatar: '🏛️',
    netWorth: 95000000,
    aum: 850000000,
    strategy: 'Centuries-old private bank trusts, blue-chip dividends, and luxury art.',
    weeklyQuote: '"Fortunes built overnight disappear overnight. Class and Swiss compound interest are forever."',
    statusBadge: 'Aristocrat'
  }
];

export const INITIAL_ROMANCE_PARTNERS: RomancePartner[] = [
  {
    id: 'elena',
    name: 'Elena Rostova',
    profession: 'Venture Capital General Partner',
    netWorth: 45000000,
    avatar: '💼',
    personality: 'Sharp, visionary, fiercely competitive in Silicon Valley deals.',
    relationshipStage: 'Crush',
    affection: 20,
    powerCoupleMoniker: 'The Silicon Syndicate',
    dialogue: '"If you can beat my fund\'s IRR this quarter, maybe I\'ll let you buy me dinner in St. Moritz."',
    perk: '+15% profit boost on Tech & AI trades; early alerts on tech earnings beats.'
  },
  {
    id: 'marcus',
    name: 'Marcus Thorne',
    profession: 'Chief Anchor, Bloomberg Squawk',
    netWorth: 12000000,
    avatar: '🎙️',
    personality: 'Charismatic, investigative, knows every secret on Capitol Hill and Wall Street.',
    relationshipStage: 'Crush',
    affection: 15,
    powerCoupleMoniker: 'The Media Monopoly',
    dialogue: '"Give me the exclusive on your next big activist trade and I\'ll make sure the narrative is gold."',
    perk: 'Reduces SEC investigation threat by 25% and boosts PR crisis recovery.'
  },
  {
    id: 'aria',
    name: 'Aria Chen',
    profession: 'AI Unicorn Founder ($SYNTH)',
    netWorth: 85000000,
    avatar: '🧠',
    personality: 'Brilliant, quiet, obsessed with neural computation and quantum markets.',
    relationshipStage: 'Crush',
    affection: 25,
    powerCoupleMoniker: 'The Algorithmic Dynasty',
    dialogue: '"Markets are just collective hallucinations of human greed. Let\'s optimize them together."',
    perk: 'Unlocks proprietary AI trend signals that forecast next week\'s sector movers.'
  },
  {
    id: 'sebastian',
    name: 'Sebastian DeWitt',
    profession: 'Sotheby\'s Senior Art Director',
    netWorth: 28000000,
    avatar: '🎨',
    personality: 'Cultured, sophisticated, connected to Monaco royalty and old European dynasties.',
    relationshipStage: 'Crush',
    affection: 18,
    powerCoupleMoniker: 'The Gilded Empire',
    dialogue: '"Money is vulgar unless translated into Basquiat canvases and private vintage reserves."',
    perk: 'Doubles Prestige points and reduces weekly stress accumulation by 30%.'
  }
];

export const LUXURY_ITEMS: LuxuryItem[] = [
  {
    id: 'rolex_daytona',
    name: 'Rolex Daytona "Panda" Chronograph',
    category: 'WATCH',
    price: 38000,
    weeklyUpkeep: 50,
    prestigeBonus: 25,
    stressReduction: 5,
    perkDescription: 'Signals you are serious on the trading floor. +25 Prestige.',
    purchased: false,
    iconName: 'Watch'
  },
  {
    id: 'patek_nautilus',
    name: 'Patek Philippe Nautilus 5711',
    category: 'WATCH',
    price: 135000,
    weeklyUpkeep: 150,
    prestigeBonus: 75,
    stressReduction: 10,
    perkDescription: 'The crown jewel of hedge fund wrists. +75 Prestige.',
    purchased: false,
    iconName: 'Watch'
  },
  {
    id: 'porsche_gt3',
    name: 'Porsche 911 GT3 RS',
    category: 'VEHICLE',
    price: 285000,
    weeklyUpkeep: 450,
    prestigeBonus: 120,
    stressReduction: 18,
    perkDescription: 'Midnight drives across the Manhattan Bridge clear your trading mind. -18% Stress.',
    purchased: false,
    iconName: 'Car'
  },
  {
    id: 'ferrari_sp3',
    name: 'Ferrari Daytona SP3 Hypercar',
    category: 'VEHICLE',
    price: 2400000,
    weeklyUpkeep: 1800,
    prestigeBonus: 450,
    stressReduction: 25,
    perkDescription: 'V12 masterpiece. Causes junior analysts to freeze in admiration. +450 Prestige.',
    purchased: false,
    iconName: 'Zap'
  },
  {
    id: 'tribeca_loft',
    name: 'TriBeCa Duplex Penthouse',
    category: 'ESTATE',
    price: 8500000,
    weeklyUpkeep: 4500,
    prestigeBonus: 900,
    stressReduction: 35,
    perkDescription: 'Private elevator, panoramic skyline views, bespoke trading terminal room. +900 Prestige.',
    purchased: false,
    iconName: 'Building'
  },
  {
    id: 'hamptons_compound',
    name: 'Southampton Oceanfront Compound',
    category: 'ESTATE',
    price: 28000000,
    weeklyUpkeep: 12000,
    prestigeBonus: 2500,
    stressReduction: 50,
    perkDescription: 'Private heli-pad and beach frontage. Host elite LP summer summits. +2500 Prestige.',
    purchased: false,
    iconName: 'Landmark'
  },
  {
    id: 'bombardier_jet',
    name: 'Bombardier Global 7500 Jet',
    category: 'AIRCRAFT',
    price: 55000000,
    weeklyUpkeep: 25000,
    prestigeBonus: 5000,
    stressReduction: 40,
    perkDescription: 'Fly non-stop to Davos and Tokyo without customs delays. Unlocks global deals.',
    purchased: false,
    iconName: 'Send'
  },
  {
    id: 'superyacht',
    name: '210ft Megayacht "Margin Call"',
    category: 'YACHT',
    price: 110000000,
    weeklyUpkeep: 60000,
    prestigeBonus: 10000,
    stressReduction: 60,
    perkDescription: 'Helipad, submarine dock, and Michelin-star private chef. The ultimate titan flex.',
    purchased: false,
    iconName: 'Anchor'
  },
  {
    id: 'quant_staff',
    name: 'Elite MIT Quant Research Team',
    category: 'STAFF',
    price: 150000, // signing bonus
    weeklyUpkeep: 8000,
    prestigeBonus: 300,
    stressReduction: 15,
    perkDescription: 'Generates real-time probabilistic alpha signals before earnings calls.',
    purchased: false,
    iconName: 'Users'
  },
  {
    id: 'crisis_counsel',
    name: 'White-Shoe SEC Defense Retainer',
    category: 'STAFF',
    price: 300000,
    weeklyUpkeep: 12000,
    prestigeBonus: 200,
    stressReduction: 20,
    perkDescription: 'Reduces all SEC Investigation Heat accumulation by 50% permanently.',
    purchased: false,
    iconName: 'Shield'
  }
];

export const INITIAL_SCANDALS: Scandal[] = [
  {
    id: 'scandal_fda_leak',
    title: 'The Pre-Market Trial Leak',
    headline: 'BREAKING: SEC Probes Suspicious Call Option Surges Ahead of GenVax Bio Trial',
    premise: 'Bloomberg reports that an anonymous wallet accumulated 10,000 deep out-of-the-money call options 48 hours before FDA approval. All rumors point directly to your trading desk.',
    prAdvisorBrief: '"The optics are toxic. The SEC enforcement division is already knocking on our glass doors. How do we play this?"',
    resolved: false,
    choices: [
      {
        text: 'Go on CNBC Squawk Box: "I trade on mathematical conviction, not whispers. Short sellers are cowards!"',
        cost: 0,
        secHeatChange: 15,
        publicSentimentChange: 20,
        stressChange: 10,
        resolutionText: 'Your fiery TV appearance goes viral! Retail traders hail you as a folk hero, though the SEC opens a formal inquiry.',
        oddsOfSuccess: 0.75,
        failureText: 'The anchor caught you stammering on a direct question about your chat logs. The SEC accelerates subpoenas!'
      },
      {
        text: 'Retain Elite Crisis Counsel and submit voluntarily to internal audit ($150,000)',
        cost: 150000,
        secHeatChange: -25,
        publicSentimentChange: 10,
        stressChange: -15,
        resolutionText: 'The independent audit confirms no inside access. The SEC drops the matter with praise for your compliance.',
        oddsOfSuccess: 0.95
      },
      {
        text: 'Scapegoat a Junior Analyst: claim they executed unauthorized rogue paper trades ($50,000 severance)',
        cost: 50000,
        secHeatChange: -15,
        publicSentimentChange: -30,
        stressChange: 15,
        resolutionText: 'You fired the analyst publicly. The SEC focuses on them, but your reputation on Wall Street takes a ruthless hit.',
        oddsOfSuccess: 0.85
      },
      {
        text: 'Double down: Buy another $1M in equity to squeeze the short-selling rumor-mongers',
        cost: 0,
        secHeatChange: 35,
        publicSentimentChange: 30,
        stressChange: 25,
        resolutionText: 'The stock rockets 22%! You pocket immense profits, but SEC regulators now have you under 24/7 surveillance.',
        oddsOfSuccess: 0.65,
        failureText: 'The stock halts! The SEC slaps an emergency trading restriction while analyzing order logs.'
      },
      {
        text: 'Host a charity gala in the Hamptons and donate $250k to pediatric cardiology',
        cost: 250000,
        secHeatChange: -10,
        publicSentimentChange: 40,
        stressChange: -20,
        resolutionText: 'The tabloids headline your philanthropy. Social media forgives everything in exchange for champagne photos.',
        oddsOfSuccess: 0.90
      },
      {
        text: 'Go completely silent and invoke Fifth Amendment rights through legal counsel',
        cost: 75000,
        secHeatChange: -5,
        publicSentimentChange: -20,
        stressChange: 5,
        resolutionText: 'No charges stick, but the rumor mill simmers for weeks across FinTwit.',
        oddsOfSuccess: 0.85
      }
    ]
  },
  {
    id: 'scandal_short_seller_report',
    title: 'The 90-Page Short Seller Hit Piece',
    headline: 'Iceberg Research Alleges Accounting Irregularities in Your Flagship Holding!',
    premise: 'A notorious short-seller fund just published an explosive dossier alleging aggressive revenue recognition on your biggest holding. The stock dropped 14% at the pre-market bell.',
    prAdvisorBrief: '"This is coordinated market manipulation designed to trigger our stop-losses. We need a decisive counter-strike."',
    resolved: false,
    choices: [
      {
        text: 'Publish an immediate 5-point point-by-point forensic rebuttal refuting all allegations',
        cost: 30000,
        secHeatChange: -10,
        publicSentimentChange: 25,
        stressChange: -10,
        resolutionText: 'Your mathematical teardown exposes the short seller\'s shoddy methodology. Institutional buyers flood back in!',
        oddsOfSuccess: 0.85
      },
      {
        text: 'File an emergency defamation & market manipulation lawsuit in federal court ($200,000)',
        cost: 200000,
        secHeatChange: 0,
        publicSentimentChange: 15,
        stressChange: -5,
        resolutionText: 'The lawsuit sends a chill through Wall Street shorts. Several funds quietly cover their short positions.',
        oddsOfSuccess: 0.80
      },
      {
        text: 'Deploy $5M of fund liquidity to trigger an aggressive short squeeze on the attackers',
        cost: 0,
        secHeatChange: 20,
        publicSentimentChange: 35,
        stressChange: 20,
        resolutionText: 'The squeeze triggers! The short sellers are forced to cover at astronomical prices, handing you a legendary victory!',
        oddsOfSuccess: 0.70,
        failureText: 'The market sells off harder; your aggressive buying fails to stem the bleed, locking in paper losses.'
      },
      {
        text: 'Quietly cut your position in half at market open to preserve capital',
        cost: 0,
        secHeatChange: -5,
        publicSentimentChange: -15,
        stressChange: 10,
        resolutionText: 'You avoid further downside, but rival funds mock your lack of conviction on StreetX.',
        oddsOfSuccess: 0.95
      },
      {
        text: 'Host a Twitter Spaces with 50,000 listeners to roast the short seller live',
        cost: 0,
        secHeatChange: 10,
        publicSentimentChange: 30,
        stressChange: 0,
        resolutionText: 'A viral masterclass! Meme accounts create hundreds of victory clips and the stock rallies 12% in after-hours.',
        oddsOfSuccess: 0.75
      },
      {
        text: 'Invite the short-seller founder to a private dinner to negotiate an off-market truce',
        cost: 10000,
        secHeatChange: 5,
        publicSentimentChange: -10,
        stressChange: -15,
        resolutionText: 'Over expensive wagyu, you both agree to exit each other\'s trade targets peacefully.',
        oddsOfSuccess: 0.85
      }
    ]
  }
];

export const INITIAL_FINTWIT_POSTS: FinTwitPost[] = [
  {
    id: 'ft_1',
    author: 'NovaX Research',
    handle: '@NovaX_Intel',
    avatar: '💻',
    content: 'Data center GPU lead times extended to 48 weeks. Supply chain sources indicate sovereign cloud contracts accelerating. $NVX to the stratosphere 🚀',
    likes: 1420,
    retweets: 388,
    tickerTag: 'NVX',
    verified: true,
    isBullish: true,
    week: 1
  },
  {
    id: 'ft_2',
    author: 'Gordon Sterling',
    handle: '@VultureSterling',
    avatar: '🦅',
    content: 'Watching retail traders buy biotech at 40x sales is my favorite spectator sport. When the trial fails, I will be waiting at the bottom to harvest the carcasses. $CURE',
    likes: 3120,
    retweets: 940,
    tickerTag: 'CURE',
    verified: true,
    isBullish: false,
    week: 1
  },
  {
    id: 'ft_3',
    author: 'Roaring Chad',
    handle: '@ChadOfWallStreet',
    avatar: '🚀',
    content: 'THE HEDGE FUNDS BORROWED 42% OF THE FLOAT ON $MEME! IF WE HOLD TOGETHER THEY HAVE TO BUY FROM US AT WHATEVER PRICE WE NAME 💎🙌',
    likes: 8900,
    retweets: 2450,
    tickerTag: 'MEME',
    verified: true,
    isBullish: true,
    week: 1
  },
  {
    id: 'ft_4',
    author: 'Bloomberg Terminal Alerts',
    handle: '@BBGAlerts',
    avatar: '📊',
    content: '*FED CHAIR POWELL: "INFLATION EXPECTATIONS WELL-ANCHORED, ECONOMIC ACTIVITY REMAINS ROBUST" — BOND YIELDS SOFTEN',
    likes: 540,
    retweets: 210,
    verified: true,
    week: 1
  }
];

export const INITIAL_BRIEFING = {
  id: 'briefing_initial',
  headline: 'Wall Street Opens New Trading Quarter with Tech & Compute Leading Gains',
  category: 'Market Open',
  summary: 'Equities launch the week on constructive momentum as institutional desks allocate fresh quarterly capital into AI compute and dividend-bearing energy leaders.',
  affectedSector: 'Big Tech & AI' as const,
  sentiment: 'BULLISH' as const,
  week: 12,
  year: 1,
};

export const BRIEFING_TEMPLATES = [
  {
    category: 'Central Banking',
    headline: 'Federal Reserve Signals Dovish Pivot as Inflation Metrics Soften',
    summary: 'Treasury yields decline sharply across the curve, igniting broad-based risk appetite across growth tech and leveraged equities.',
    affectedSector: 'Macro & Broad Market' as const,
    sentiment: 'BULLISH' as const,
  },
  {
    category: 'Artificial Intelligence',
    headline: 'Sovereign Cloud Hyperscalers Expand GPU CapEx Orders by $40 Billion',
    summary: 'Semiconductor backlogs stretch into next year as frontier AI training models demand unprecedented compute capacity.',
    affectedSector: 'Big Tech & AI' as const,
    sentiment: 'BULLISH' as const,
  },
  {
    category: 'Biotech Breakthrough',
    headline: 'FDA Grants Fast-Track Review for GenVax Cellular Oncology Pipeline',
    summary: 'Phase 3 trial endpoints demonstrate robust clinical efficacy; institutional short sellers scramble to cover borrow positions.',
    affectedSector: 'BioPharma & Genomics' as const,
    sentiment: 'BULLISH' as const,
  },
  {
    category: 'OPEC Energy Shock',
    headline: 'OPEC+ Ministers Announce Unexpected Voluntary Crude Output Cuts',
    summary: 'Brent crude and spot LNG prices rally 6%; integrated energy giants prepare for substantial cash dividend windfalls.',
    affectedSector: 'Energy & Commodities' as const,
    sentiment: 'BULLISH' as const,
  },
  {
    category: 'Defense Procurement',
    headline: 'Pentagon Finalizes Multi-Year Orbital & Hypersonic Interceptor Contracts',
    summary: 'Aerospace defense contractors secure non-cancellable backlog orders amid rising global geopolitical commitments.',
    affectedSector: 'Defense & Aerospace' as const,
    sentiment: 'BULLISH' as const,
  },
  {
    category: 'Retail Mania',
    headline: 'Reddit Option Traders Coordinate Massive Gamma Squeeze on Shorted Float',
    summary: 'Call options volume shatters exchange records as retail crowds overpower institutional short-seller syndicates.',
    affectedSector: 'FinTech & Degens' as const,
    sentiment: 'VOLATILE' as const,
  },
  {
    category: 'Regulatory Scrutiny',
    headline: 'SEC Enforcement Division Launches Inter-Agency Probe into Dark Pool Liquidity',
    summary: 'Regulators seek trading logs on high-frequency market-making firms; bid-ask spreads widen amid cautious execution.',
    affectedSector: 'Macro & Broad Market' as const,
    sentiment: 'BEARISH' as const,
  },
  {
    category: 'Consumer Luxury',
    headline: 'Ultra-High-Net-Worth Spending Surges at European Flagship Ateliers',
    summary: 'Haute couture houses report record margins on rare leather goods and haute horology, defying broad economic headwinds.',
    affectedSector: 'Consumer & Luxury' as const,
    sentiment: 'BULLISH' as const,
  },
  {
    category: 'Bond Market Flash',
    headline: 'Sovereign Bond Yields Spike on Stronger-Than-Expected Employment Reports',
    summary: 'Higher-for-longer interest rate repricing pressures rate-sensitive equities while boosting short-duration cash yields.',
    affectedSector: 'Macro & Broad Market' as const,
    sentiment: 'BEARISH' as const,
  },
  {
    category: 'Crypto Liquidity',
    headline: 'Institutional Custody Inflows Surge into Regulated Digital Asset Reserves',
    summary: 'Major investment banks activate spot clearing rails, driving sudden liquidity expansion across fintech infrastructure.',
    affectedSector: 'FinTech & Degens' as const,
    sentiment: 'BULLISH' as const,
  }
];
