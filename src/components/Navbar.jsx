import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LogOut,
  Wifi,
  WifiOff,
  Download,
  ShieldCheck,
  Globe,
  PlusCircle,
  BarChart3,
  LayoutDashboard
} from 'lucide-react';
import { syncOfflineQueue } from '../services/api';
import Swal from 'sweetalert2';

export default function Navbar({ pwaPrompt, isInstalled, onInstall }) {
  const { logout } = useAuth();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);

  const navItems = [
    { name: 'Service List', path: '/services', icon: Globe },
    { name: 'Data Entry', path: '/data-entry', icon: PlusCircle },
    { name: 'Data View', path: '/data-view', icon: BarChart3 },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  ];

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
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 py-3 shadow-xs transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-green-600 flex items-center justify-center text-white shadow-md shadow-green-600/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-slate-900 text-lg leading-tight tracking-tight">
                SUBI <span className="text-green-600 font-extrabold">Online Service</span>
              </h1>
              <p className="text-xs text-slate-500 font-medium hidden lg:block">
                Shop Budget & Customer Management System
              </p>
            </div>
          </div>

          {/* Desktop Main Navigation (Line to Line Horizontal Top Bar) */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/80 shadow-inner">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 whitespace-nowrap ${
                      isActive
                        ? 'bg-green-600 text-white shadow-md shadow-green-600/30 scale-102'
                        : 'text-slate-700 hover:text-green-700 hover:bg-white'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Right Action Icons & Badges */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
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
    </>
  );
}
