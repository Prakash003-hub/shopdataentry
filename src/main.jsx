import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Register Service Worker for PWA Offline Caching
const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('New version of SUBI Online Service available. Reload?')) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log('SUBI App is ready for offline use!');
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
