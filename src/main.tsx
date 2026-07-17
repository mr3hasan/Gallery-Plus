import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Intercept window.fetch for Capacitor/WebView native mobile wrapper
const isCapacitor = typeof window !== 'undefined' && (
  (window as any).Capacitor !== undefined ||
  window.location.protocol === 'file:' ||
  (window.location.hostname === 'localhost' && window.location.port !== '3000' && window.location.port !== '5173')
);

if (isCapacitor) {
  const originalFetch = window.fetch;
  window.fetch = function (input: RequestInfo | URL, init?: RequestInit) {
    if (typeof input === 'string' && input.startsWith('/api/')) {
      const savedServer = localStorage.getItem('custom_sync_server') || 'https://ais-pre-6j26bomybh3mrhngsz7myx-655499886291.asia-east1.run.app';
      const base = savedServer.endsWith('/') ? savedServer.slice(0, -1) : savedServer;
      const targetUrl = `${base}${input}`;
      console.log(`[Capacitor Fetch Redirect] Intercepted relative path: ${input} -> Redirecting to remote backend: ${targetUrl}`);
      return originalFetch(targetUrl, init);
    }
    return originalFetch(input, init);
  };
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
