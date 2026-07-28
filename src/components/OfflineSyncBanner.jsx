import React, { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';

export default function OfflineSyncBanner() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="bg-gradient-to-r from-red-600 to-rose-600 text-white px-4 py-2.5 text-xs font-semibold shadow-md flex items-center justify-between transition-all">
      <div className="flex items-center gap-2 max-w-4xl mx-auto w-full">
        <WifiOff className="w-4 h-4 text-red-100 shrink-0" />
        <span>
          <strong>Internet Disconnected:</strong> An active internet connection is required to read and save data directly to Google Sheets & Drive.
        </span>
      </div>
    </div>
  );
}
