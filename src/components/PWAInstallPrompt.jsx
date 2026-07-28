import React, { useState } from 'react';
import { Smartphone, Download, X, CheckCircle } from 'lucide-react';

export default function PWAInstallPrompt({ deferredPrompt, onInstall }) {
  const [dismissed, setDismissed] = useState(false);

  if (!deferredPrompt || dismissed) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 md:bottom-6 md:right-6 md:left-auto md:max-w-sm z-50 animate-bounce-subtle">
      <div className="glass-card bg-slate-900 text-white p-4 rounded-3xl border border-slate-700/80 shadow-2xl relative">
        <button
          onClick={() => setDismissed(true)}
          className="absolute top-3 right-3 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-2xl bg-green-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-green-600/40">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-sm font-bold text-white">📱 Install SUBI App</span>
              <span className="bg-green-500/20 text-green-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-green-500/30">
                PWA
              </span>
            </div>
            <p className="text-xs text-slate-300 mb-3 leading-relaxed">
              Install SUBI Online Service on your mobile for faster, full-screen Android access without Play Store.
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={onInstall}
                className="flex-1 bg-green-600 hover:bg-green-500 text-white text-xs font-bold py-2 px-4 rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-green-600/30 transition-all active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>Install</span>
              </button>
              <button
                onClick={() => setDismissed(true)}
                className="text-xs font-semibold text-slate-400 hover:text-white px-3 py-2 rounded-xl transition-all"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
