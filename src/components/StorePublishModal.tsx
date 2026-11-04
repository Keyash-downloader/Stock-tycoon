import React, { useState } from 'react';
import { 
  X, 
  Smartphone, 
  Check, 
  Copy, 
  Download, 
  ExternalLink, 
  ShieldCheck, 
  Terminal, 
  FileText, 
  Sparkles,
  Layers,
  ChevronRight,
  Info
} from 'lucide-react';

interface StorePublishModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StorePublishModal: React.FC<StorePublishModalProps> = ({ isOpen, onClose }) => {
  const [activeStoreTab, setActiveStoreTab] = useState<'PLAY_STORE' | 'APP_STORE' | 'CAPACITOR_SETUP'>('PLAY_STORE');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(key);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const playStoreData = {
    packageName: 'com.spotlightdream.stocks',
    appTitle: 'Spotlight Stocks: Market Titan',
    shortDesc: 'Rule Wall Street! Trade stocks, crush rivals, and build your financial empire.',
    category: 'Games > Simulation / Strategy',
    contentRating: 'Everyone (Contains simulated trading, no real-money gambling)',
    fullDesc: `From the creators of Spotlight Dream comes the definitive Wall Street career and stock market simulation!

Ascend from an ambitious bedroom day trader into a legendary hedge fund titan. Trade high-volatility equities, execute leveraged options, manage risk through macroeconomic shocks, and crush rival billionaires on the WallRich 400.

KEY FEATURES:
• REAL-TIME TRADING FLOOR: Real-time candlestick charts, moving averages, stop-loss orders, and options trading across 6 dynamic sectors (AI & Big Tech, BioPharma, Energy, Defense, Luxury, and Meme stocks).
• MULTIPLAYER ARENA: Compete head-to-head in real-time Trading Pit challenges vs live traders and Wall Street algorithmic bots.
• EMPIRE & LUXURY: Purchase private jets, penthouse suites, superyachts, and high-yield savings to climb the social ladder.
• WALLRICH 400 RIVALS: Go to war against ruthless titan rivals like Gordon Vance and Cassandra Short.
• SEC SCANDALS & PR WARFARE: Navigate insider trading investigations, short seller attack reports, and PR crises with high-stakes choices.
• HIGH SOCIETY & ROMANCE: Date and marry venture capitalists, tech heiresses, and supermodels to form Wall Street Power Couples.
• PERSISTENT DAILY WATCHLIST: Pin your highest-priority tickers with real-time target price alerts.

DISCLAIMER:
Spotlight Stocks: Market Titan is a strategy simulation game created for entertainment purposes. All equities, currencies, and trading operations are purely simulated credits and hold no real-world monetary value.`,
  };

  const appStoreData = {
    bundleId: 'com.spotlightdream.stocks',
    appName: 'Spotlight Stocks: Market Titan',
    subtitle: 'Wall Street Career & Trading',
    primaryCategory: 'Games / Strategy',
    secondaryCategory: 'Games / Simulation',
    keywords: 'stocks,wall street,trading,investing,simulator,career,finance,tycoon,billionaire,market titan,spotlight',
    supportUrl: 'https://spotlightdream.com/support',
    privacyPolicyUrl: `${window.location.origin}/privacy-policy`,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden relative text-slate-100">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-sky-500 to-indigo-500 p-0.5 shadow-md">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-xl">
                📱
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-lg text-slate-100 tracking-tight">App Store & Google Play Publishing Hub</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold uppercase">
                  Capacitor + TWA Ready
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Package Name: <strong className="text-amber-300 font-mono">com.spotlightdream.stocks</strong> (Spotlight Dream Studio)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Store Tabs */}
        <div className="px-5 pt-3 bg-slate-950/40 border-b border-slate-800 flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveStoreTab('PLAY_STORE')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition cursor-pointer border-b-2 ${
              activeStoreTab === 'PLAY_STORE'
                ? 'border-emerald-400 text-emerald-300 bg-emerald-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🤖 Google Play Store</span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded font-mono font-bold">
              AAB Ready
            </span>
          </button>

          <button
            onClick={() => setActiveStoreTab('APP_STORE')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition cursor-pointer border-b-2 ${
              activeStoreTab === 'APP_STORE'
                ? 'border-sky-400 text-sky-300 bg-sky-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🍎 Apple App Store</span>
            <span className="text-[10px] bg-sky-500/20 text-sky-400 px-1.5 py-0.2 rounded font-mono font-bold">
              Xcode Ready
            </span>
          </button>

          <button
            onClick={() => setActiveStoreTab('CAPACITOR_SETUP')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition cursor-pointer border-b-2 ${
              activeStoreTab === 'CAPACITOR_SETUP'
                ? 'border-indigo-400 text-indigo-300 bg-indigo-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-indigo-400" />
            <span>⚡ Build Commands & Config</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* TAB 1: GOOGLE PLAY STORE */}
          {activeStoreTab === 'PLAY_STORE' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-300 space-y-1">
                  <p className="font-bold text-slate-100 text-sm">Google Play Store Submission Package</p>
                  <p>
                    Your app is pre-configured with <strong>Capacitor Android</strong> and <strong>Trusted Web Activity (TWA)</strong> standards. Both methods generate an official signed <code>.aab</code> (Android App Bundle) accepted by the Google Play Console under your <em>Spotlight Dream</em> developer account.
                  </p>
                </div>
              </div>

              {/* Step-by-Step Build Pipeline */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block">
                  1. How to Generate Google Play .AAB Bundle
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {/* Option A: Capacitor Android */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-200">Option A: Native Capacitor (Recommended)</span>
                      <span className="text-[10px] bg-slate-800 text-emerald-400 font-bold px-1.5 py-0.5 rounded">
                        Full Native
                      </span>
                    </div>
                    <p className="text-slate-400 text-[11px]">
                      Produces a full Android Studio project folder with native splash screen, status bar, and back button support.
                    </p>
                    <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 font-mono text-[11px] text-emerald-300 space-y-1">
                      <div>npm run build:mobile</div>
                      <div>npx cap add android</div>
                      <div>npx cap open android</div>
                    </div>
                    <p className="text-[10px] text-slate-500">
                      In Android Studio: click <strong>Build &gt; Generate Signed Bundle / APK &gt; Android App Bundle (.aab)</strong>.
                    </p>
                  </div>

                  {/* Option B: PWABuilder (Instant APK & AAB) */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-300">Option B: 1-Click APK & AAB Generator</span>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-1.5 py-0.5 rounded">
                        Fastest • No Tools Needed
                      </span>
                    </div>
                    <p className="text-slate-300 text-[11px]">
                      <strong>PWABuilder</strong> packages this live app into both an <strong>APK</strong> (for direct Android phone installation) and a <strong>signed .AAB</strong> (for Google Play Console).
                    </p>
                    <a
                      href={`https://www.pwabuilder.com/reportcard?site=${encodeURIComponent(window.location.origin)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider transition shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1.5 cursor-pointer block text-center"
                    >
                      <Download className="w-3.5 h-3.5 inline" />
                      <span>Generate APK & AAB for Play Store</span>
                      <ExternalLink className="w-3 h-3 inline ml-1 opacity-70" />
                    </a>
                    <p className="text-[10px] text-slate-500">
                      *Note: Google Play Console requires <strong>.AAB</strong> (not .apk). Both are generated in the download package!
                    </p>
                  </div>
                </div>
              </div>

              {/* Pre-formatted Play Store Copy */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
                  2. Play Store Listing Metadata (Ready to Paste)
                </span>

                <div className="space-y-3 text-xs">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-slate-500 block">App Title (≤ 30 chars)</span>
                      <span className="font-bold text-slate-100 text-sm">{playStoreData.appTitle}</span>
                    </div>
                    <button
                      onClick={() => handleCopy('play_title', playStoreData.appTitle)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      {copiedField === 'play_title' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedField === 'play_title' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-slate-500 block">Short Description (≤ 80 chars)</span>
                      <span className="font-bold text-slate-100">{playStoreData.shortDesc}</span>
                    </div>
                    <button
                      onClick={() => handleCopy('play_short', playStoreData.shortDesc)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      {copiedField === 'play_short' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedField === 'play_short' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-wider text-slate-500">Full Description (SEO Optimized)</span>
                      <button
                        onClick={() => handleCopy('play_full', playStoreData.fullDesc)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold transition flex items-center gap-1 cursor-pointer"
                      >
                        {copiedField === 'play_full' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedField === 'play_full' ? 'Copied Description' : 'Copy Full Description'}</span>
                      </button>
                    </div>
                    <pre className="text-[11px] text-slate-300 font-sans whitespace-pre-wrap max-h-36 overflow-y-auto bg-slate-900 p-2.5 rounded-lg border border-slate-800/80">
                      {playStoreData.fullDesc}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: APPLE APP STORE */}
          {activeStoreTab === 'APP_STORE' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-sky-950/30 border border-sky-500/30 flex items-start gap-3">
                <Smartphone className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-300 space-y-1">
                  <p className="font-bold text-slate-100 text-sm">Apple App Store Submission (iOS / iPadOS)</p>
                  <p>
                    Capacitor wraps your application into a high-performance native iOS app using Apple's official WKWebView. The codebase supports iOS safe-area notches, dynamic islands, dark status bars, and offline caching out of the box.
                  </p>
                </div>
              </div>

              {/* Xcode Step-by-Step */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-400 block">
                  1. Xcode Build & App Store Connect Steps
                </span>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 font-bold flex items-center justify-center shrink-0">1</span>
                    <div>
                      <strong className="text-slate-100">Sync code to iOS project</strong>
                      <div className="bg-slate-900 p-2 rounded-lg font-mono text-[11px] text-sky-300 mt-1">
                        npm run build:mobile && npx cap add ios && npx cap open ios
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 font-bold flex items-center justify-center shrink-0">2</span>
                    <div>
                      <strong className="text-slate-100">Configure Signing in Xcode</strong>
                      <p className="text-slate-400 text-[11px] mt-0.5">
                        In Xcode &gt; Project Settings &gt; <em>Signing & Capabilities</em>, select your Apple Developer Team and Bundle ID: <code>com.spotlightdream.stocks</code>.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 font-bold flex items-center justify-center shrink-0">3</span>
                    <div>
                      <strong className="text-slate-100">Archive and Upload</strong>
                      <p className="text-slate-400 text-[11px] mt-0.5">
                        Select device <strong>Any iOS Device (arm64)</strong> &gt; Menu <strong>Product &gt; Archive</strong> &gt; click <strong>Distribute App &gt; App Store Connect</strong>.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* App Store Connect Metadata */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
                  2. App Store Connect Metadata
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block">App Name</span>
                      <span className="font-bold text-slate-100">{appStoreData.appName}</span>
                    </div>
                    <button
                      onClick={() => handleCopy('app_name', appStoreData.appName)}
                      className="p-1.5 rounded bg-slate-800 text-slate-300 hover:text-white"
                    >
                      {copiedField === 'app_name' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block">Subtitle</span>
                      <span className="font-bold text-slate-100">{appStoreData.subtitle}</span>
                    </div>
                    <button
                      onClick={() => handleCopy('app_sub', appStoreData.subtitle)}
                      className="p-1.5 rounded bg-slate-800 text-slate-300 hover:text-white"
                    >
                      {copiedField === 'app_sub' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block">Keywords</span>
                      <span className="font-bold text-slate-100 truncate max-w-[200px] block">{appStoreData.keywords}</span>
                    </div>
                    <button
                      onClick={() => handleCopy('app_kw', appStoreData.keywords)}
                      className="p-1.5 rounded bg-slate-800 text-slate-300 hover:text-white"
                    >
                      {copiedField === 'app_kw' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block">Privacy Policy URL (Verified)</span>
                      <span className="font-bold text-emerald-400 font-mono text-[11px] truncate max-w-[200px] block">
                        {appStoreData.privacyPolicyUrl}
                      </span>
                    </div>
                    <button
                      onClick={() => handleCopy('app_priv', appStoreData.privacyPolicyUrl)}
                      className="p-1.5 rounded bg-slate-800 text-slate-300 hover:text-white"
                    >
                      {copiedField === 'app_priv' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CAPACITOR SETUP & ASSETS */}
          {activeStoreTab === 'CAPACITOR_SETUP' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 flex items-start gap-3">
                <Terminal className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-100 text-sm">Automated Mobile Native Project Architecture</h4>
                  <p className="text-slate-300 mt-1">
                    Capacitor is already configured in <code>capacitor.config.ts</code> with your bundle ID (<code>com.spotlightdream.stocks</code>), status bar configurations, and splash screen styling.
                  </p>
                </div>
              </div>

              {/* CLI Commands Reference */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between pb-1 border-b border-slate-800">
                  <span className="font-bold text-slate-200">Terminal Command Sequence</span>
                  <button
                    onClick={() => handleCopy('commands', 'npm run build:mobile\nnpx cap add android\nnpx cap add ios\nnpx cap sync')}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition flex items-center gap-1 cursor-pointer"
                  >
                    {copiedField === 'commands' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copy Commands</span>
                  </button>
                </div>
                <div className="font-mono text-emerald-300 text-xs space-y-1.5">
                  <div><span className="text-slate-500"># 1. Build and sync web bundle into mobile container</span></div>
                  <div>npm run build:mobile</div>
                  <div><span className="text-slate-500"># 2. Add native iOS and Android projects</span></div>
                  <div>npx cap add android</div>
                  <div>npx cap add ios</div>
                  <div><span className="text-slate-500"># 3. Open in native IDEs (Android Studio / Xcode)</span></div>
                  <div>npx cap open android</div>
                  <div>npx cap open ios</div>
                </div>
              </div>

              {/* App Assets Overview */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <span className="font-bold text-slate-200 block">Generated App Assets in /public</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                    <span className="font-bold text-emerald-400 block">512×512 PNG</span>
                    <span className="text-slate-400">Play Store Icon</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                    <span className="font-bold text-emerald-400 block">180×180 PNG</span>
                    <span className="text-slate-400">Apple Touch Icon</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                    <span className="font-bold text-emerald-400 block">192×192 PNG</span>
                    <span className="text-slate-400">Android Launcher</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                    <span className="font-bold text-emerald-400 block">Vector SVG</span>
                    <span className="text-slate-400">Scalable Logo</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-emerald-400" />
            <span>Ready for both Google Play Console & Apple App Store Connect.</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition shadow-md shadow-emerald-500/20 cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
