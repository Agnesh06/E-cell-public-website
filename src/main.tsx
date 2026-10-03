import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { COLOR_TOKENS } from './lib/constants';
import './styles/globals.css';

const setTokenGroup = (
  group: string,
  values: Record<string, string>
): void => {
  Object.entries(values).forEach(([name, value]) => {
    const cssName = name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
    document.documentElement.style.setProperty(`--${group}-${cssName}`, value);
  });
};

setTokenGroup('theme', COLOR_TOKENS.theme);
setTokenGroup('line-waves', COLOR_TOKENS.lineWaves);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

