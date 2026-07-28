import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Wifi, WifiOff, Download, Settings, RefreshCw, ShieldCheck } from 'lucide-react';
import ApiConfigModal from './Modals/ApiConfigModal';
import { syncOfflineQueue } from '../services/api';
import Swal from 'sweetalert2';

export default function Navbar({ pwaPrompt, isInstalled, onInstall }) {
  const { logout } = useAuth();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      handleAutoSync();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleAutoSync = async () => {
    setIsSyncing(true);
    const res = await syncOfflineQueue();
    setIsSyncing(false);
    if (res.synced > 0) {
      Swal.fire({
        icon: 'success',
        title: 'Offline Data Synced!',
        text: `Successfully synced ${res.synced} offline entries with Google Sheets.`,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
      });
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 py-3 shadow-xs transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-600 flex items-center justify-center text-white shadow-md shadow-green-600/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-slate-900 text-lg leading-tight tracking-tight">
                SUBI <span className="text-green-600 font-extrabold">Online Service</span>
              </h1>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                Shop Budget & Customer Management System
              </p>
            </div>
          </div>

          {/* Right Action Icons & Badges */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live Connection Status Badge */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                isOnline
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-red-50 text-red-700 border border-red-200 animate-pulse'
              }`}
              title={isOnline ? 'Connected to Google Sheets API' : 'Internet Disconnected'}
            >
              {isOnline ? (
                <Wifi className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <WifiOff className="w-3.5 h-3.5 text-red-600" />
              )}
              <span className="hidden xs:inline">
                {isOnline ? 'Sheets Connected' : 'Internet Required'}
              </span>
            </div>

            {/* Install PWA Button (Mobile & Chrome) */}
            {!isInstalled && pwaPrompt && (
              <button
                onClick={onInstall}
                className="flex items-center gap-1.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-md shadow-green-600/20 active:scale-95 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Install App</span>
              </button>
            )}

            {/* GAS API Settings Modal Button */}
            <button
              onClick={() => setShowConfigModal(true)}
              className="p-2 text-slate-600 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all"
              title="Google Apps Script Setup"
            >
              <Settings className="w-5 h-5" />
            </button>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-slate-600 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* GAS Config Modal */}
      {showConfigModal && (
        <ApiConfigModal onClose={() => setShowConfigModal(false)} />
      )}
    </>
  );
}
