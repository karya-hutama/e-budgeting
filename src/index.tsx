
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Log agar tahu script berjalan
console.log('App starting...');

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error("FATAL: Could not find root element to mount to");
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
