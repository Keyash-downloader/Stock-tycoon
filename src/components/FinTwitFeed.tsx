import React, { useState } from 'react';
import { 
  MessageSquare, 
  Heart, 
  Repeat2, 
  TrendingUp, 
  TrendingDown, 
  CheckCircle2, 
  Send, 
  Sparkles,
  Flame,
  ShieldAlert,
  Inbox
} from 'lucide-react';
import { FinTwitPost } from '../types/game';

interface FinTwitFeedProps {
  posts: FinTwitPost[];
  playerName: string;
  onPostTweet: (content: string, tickerTag?: string, isBullish?: boolean) => void;
}

export const FinTwitFeed: React.FC<FinTwitFeedProps> = ({
  posts,
  playerName,
  onPostTweet,
}) => {
  const [tweetContent, setTweetContent] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('NVX');
  const [isBullish, setIsBullish] = useState<boolean>(true);
  const [viewTab, setViewTab] = useState<'FEED' | 'DMS'>('FEED');

  const handlePublish = () => {
    if (!tweetContent.trim()) return;
    onPostTweet(tweetContent, selectedTag, isBullish);
    setTweetContent('');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-4 space-y-4">
      {/* StreetX Top Header */}
      <div className="flex items-center justify-between bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-100 flex items-center gap-2">
              STREET<span className="text-sky-400">X</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                LIVE TERMINAL FEED
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              The unfiltered digital square of Wall Street hedge funds, degenerate retail traders, and financial journalists.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setViewTab('FEED')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              viewTab === 'FEED' ? 'bg-sky-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Public Feed
          </button>
          <button
            onClick={() => setViewTab('DMS')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
              viewTab === 'DMS' ? 'bg-sky-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Inbox className="w-3.5 h-3.5" />
            Direct Messages (3)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Trending Wall Street Topics (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
            <h3 className="font-bold text-slate-200 text-sm mb-3 flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-400" />
              Trending Financial Topics
            </h3>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition">
                <span className="text-[10px] text-slate-500 block">Technology · Trending</span>
                <span className="font-bold text-slate-200">#NovaXHyperscale</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">48.2k posts · $NVX</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition">
                <span className="text-[10px] text-slate-500 block">Short Squeeze · Viral</span>
                <span className="font-bold text-rose-400">#ApeArmySqueeze</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">122.4k posts · $MEME</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition">
                <span className="text-[10px] text-slate-500 block">Regulatory · Alert</span>
                <span className="font-bold text-amber-400">#SECSubpoenaWave</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">18.9k posts</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition">
                <span className="text-[10px] text-slate-500 block">Biotech · Binary Event</span>
                <span className="font-bold text-emerald-400">#GenVaxFDA</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">34.1k posts · $CURE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center Column: Feed or DMs (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {viewTab === 'FEED' ? (
            <>
              {/* Compose Box */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-sm">
                    YOU
                  </div>
                  <div className="flex-1 space-y-3">
                    <textarea
                      rows={2}
                      value={tweetContent}
                      onChange={(e) => setTweetContent(e.target.value)}
                      placeholder="What is your market read? Share alpha, talk trash, or pump your book..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 text-xs focus:outline-none focus:border-sky-500 resize-none"
                    />

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800/60">
                      <div className="flex items-center gap-2 text-xs">
                        {/* Ticker Tag Selector */}
                        <select
                          value={selectedTag}
                          onChange={(e) => setSelectedTag(e.target.value)}
                          className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-300 text-xs focus:outline-none"
                        >
                          <option value="NVX">$NVX (NovaX)</option>
                          <option value="MEME">$MEME (ApeForge)</option>
                          <option value="CURE">$CURE (GenVax)</option>
                          <option value="TITAN">$TITAN (Titan Energy)</option>
                          <option value="LVMX">$LVMX (Luxe Empire)</option>
                        </select>

                        {/* Stance Toggle */}
                        <button
                          onClick={() => setIsBullish(!isBullish)}
                          className={`px-2.5 py-1 rounded-lg font-bold text-[11px] cursor-pointer flex items-center gap-1 ${
                            isBullish
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {isBullish ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {isBullish ? 'Bullish Call' : 'Bearish Call'}
                        </button>
                      </div>

                      <button
                        onClick={handlePublish}
                        disabled={!tweetContent.trim()}
                        className="px-5 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-bold text-xs tracking-wide transition cursor-pointer flex items-center gap-1.5 shadow-md shadow-sky-500/20"
                      >
                        <Send className="w-3.5 h-3.5" />
                        Broadcast
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feed Stream */}
              <div className="space-y-3">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-4 hover:border-slate-700 transition"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-xl shrink-0 shadow-inner">
                        {post.avatar}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-slate-100 text-sm">{post.author}</span>
                          {post.verified && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                          )}
                          <span className="text-xs text-slate-500">{post.handle}</span>
                          <span className="text-xs text-slate-600">· Wk {post.week}</span>

                          {post.tickerTag && (
                            <span className="ml-auto text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700">
                              ${post.tickerTag}
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                          {post.content}
                        </p>

                        <div className="flex items-center gap-6 mt-3 pt-2 border-t border-slate-800/60 text-xs text-slate-500 tabular-nums">
                          <button className="flex items-center gap-1 hover:text-rose-400 transition cursor-pointer">
                            <Heart className="w-3.5 h-3.5" />
                            <span>{post.likes}</span>
                          </button>
                          <button className="flex items-center gap-1 hover:text-emerald-400 transition cursor-pointer">
                            <Repeat2 className="w-3.5 h-3.5" />
                            <span>{post.retweets}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            /* Direct Messages Tab */
            <div className="space-y-3">
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg">
                    🕵️
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-200 text-sm">Anonymous Desk Whistleblower</span>
                      <span className="text-[10px] text-slate-500 font-mono">1h ago</span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">
                      "Heads up. Apex Sphere Devices is quietly trimming their next-gen headset component orders by 20%. Might want to hedge your tech long book before Thursday."
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-lg">
                    🦅
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-200 text-sm">Gordon Sterling</span>
                      <span className="text-[10px] text-slate-500 font-mono">3h ago</span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">
                      "I saw your options block on $CURE. Brave, but cute. When my team finishes borrowing the float, remember who put you out of business."
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center font-bold text-lg">
                    💼
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-200 text-sm">Elena Rostova</span>
                      <span className="text-[10px] text-slate-500 font-mono">Yesterday</span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">
                      "Caught your appearance on Bloomberg yesterday. You handled that arrogant anchor well. Let's do drinks at the Aman Penthouse when you're done trading this week."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
