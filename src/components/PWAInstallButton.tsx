import React, { useState } from 'react';
import { Download, Smartphone, X, CheckCircle, Share, PlusSquare } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  variant?: 'compact' | 'full';
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = 'compact',
  className = '',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  // If already running inside standalone PWA, suppress
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (success) {
        setInstallSuccess(true);
        setTimeout(() => setInstallSuccess(false), 3000);
      }
    } else {
      setShowInfoModal(true);
    }
  };

  return (
    <>
      <button
        onClick={handleInstallClick}
        className={`group relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md cursor-pointer select-none ${
          isInstallable
            ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-emerald-500/25 ring-1 ring-emerald-400/50 hover:scale-105 active:scale-95'
            : 'bg-slate-800/90 hover:bg-slate-700/90 text-emerald-400 border border-emerald-500/30 hover:border-emerald-400/60'
        } ${className}`}
        title="Install Spotlight Stocks as a desktop/mobile application"
      >
        <Download className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
        <span>{variant === 'full' ? 'Install Stock App' : 'Install App'}</span>
        {isInstallable && (
          <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping absolute -top-0.5 -right-0.5" />
        )}
      </button>

      {/* Installation Instruction Modal for iOS & Desktop fallback */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl p-6 max-w-sm w-full shadow-2xl relative text-slate-100">
            <button
              onClick={() => setShowInfoModal(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-100">Install Spotlight Stocks</h3>
                <p className="text-xs text-slate-400">Play offline & fullscreen like a native app</p>
              </div>
            </div>

            {isIOS ? (
              <div className="space-y-3 text-xs text-slate-300 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <p className="font-semibold text-emerald-400">On iPhone / iPad (Safari):</p>
                <div className="flex items-start gap-2">
                  <div className="p-1 rounded bg-slate-800 text-sky-400 shrink-0">
                    <Share className="w-3.5 h-3.5" />
                  </div>
                  <span>1. Tap the <strong>Share</strong> button in the bottom Safari bar.</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="p-1 rounded bg-slate-800 text-amber-400 shrink-0">
                    <PlusSquare className="w-3.5 h-3.5" />
                  </div>
                  <span>2. Scroll down and tap <strong>Add to Home Screen</strong>.</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="p-1 rounded bg-slate-800 text-emerald-400 shrink-0">
                    <CheckCircle className="w-3.5 h-3.5" />
                  </div>
                  <span>3. Launch the app directly from your home screen.</span>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-xs text-slate-300 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <p className="font-semibold text-emerald-400">On Chrome / Edge / Android:</p>
                <div className="flex items-start gap-2">
                  <div className="p-1 rounded bg-slate-800 text-emerald-400 shrink-0">
                    <Download className="w-3.5 h-3.5" />
                  </div>
                  <span>Click the <strong>Install</strong> icon in the address bar (or browser menu ⋮ &gt; <em>Install Spotlight Stocks</em>).</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  You will get an independent app window with fast loading, offline support, and low latency!
                </p>
              </div>
            )}

            <button
              onClick={() => setShowInfoModal(false)}
              className="mt-5 w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs tracking-wider uppercase transition shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              Got It
            </button>
          </div>
        </div>
      )}

      {/* Success banner if installed */}
      {installSuccess && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-600 text-white text-xs px-4 py-2 rounded-xl shadow-2xl flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>App installed successfully! Check your home screen or app launcher.</span>
        </div>
      )}
    </>
  );
};
