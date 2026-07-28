import React, { useState, useEffect } from 'react';
import { X, Server, Check, Copy, ExternalLink, HelpCircle } from 'lucide-react';
import { getStoredGasUrl, setStoredGasUrl } from '../../services/api';
import Swal from 'sweetalert2';

export default function ApiConfigModal({ onClose }) {
  const [url, setUrl] = useState('');

  useEffect(() => {
    setUrl(getStoredGasUrl());
  }, []);

  const handleSave = () => {
    setStoredGasUrl(url);
    Swal.fire({
      icon: 'success',
      title: 'Settings Saved',
      text: 'Google Apps Script Web App URL updated!',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2500,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-2 rounded-full hover:bg-slate-100 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center font-bold">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Backend API Configuration</h2>
            <p className="text-xs text-slate-500">Connect to your Google Apps Script Web App</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Google Apps Script Web App URL
            </label>
            <input
              type="url"
              placeholder="https://script.google.com/macros/s/.../exec"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full glass-input px-4 py-3 rounded-2xl text-sm font-medium text-slate-800"
            />
            <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
              If left blank, the app functions seamlessly in <strong>IndexedDB Demo Mode</strong> locally.
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 text-xs text-slate-600 space-y-2">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-green-600" />
              <span>Setup Instructions:</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-slate-600 pl-1 text-[11px]">
              <li>Copy <code className="text-green-700 bg-green-50 font-mono px-1 py-0.5 rounded">google-apps-script/Code.gs</code></li>
              <li>Paste into Google Sheet Apps Script editor</li>
              <li>Deploy as Web App (Execute as: <strong>Me</strong>, Access: <strong>Anyone</strong>)</li>
              <li>Paste the generated URL above & save!</li>
            </ol>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-2xl text-sm transition-all shadow-md shadow-green-600/30 flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Save Configuration</span>
            </button>
            <button
              onClick={onClose}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-4 rounded-2xl text-sm transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
