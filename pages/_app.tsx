import '../styles/index.css';

import { ToastProvider } from '@datacamp/waffles/toast';
import type { AppProps } from 'next/app';
import { createContext, useEffect, useState } from 'react';
import ReactGA4 from 'react-ga4';

import * as gtag from '../lib/gtag';

export const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => null,
});

export default function MyApp({ Component, pageProps }: AppProps) {
  const [theme, setTheme] = useState<string>();

  function toggleTheme() {
    if (theme === 'light') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  }

  // if we're client-side, check local storage on mount
  useEffect(() => {
    ReactGA4.initialize(gtag.GA4_TRACKING_ID);

    if (window) {
      const savedTheme = localStorage.getItem('theme');
      setTheme(savedTheme || 'light');
    }
  }, []);

  // run every time theme is toggled
  useEffect(() => {
    document.querySelector('html').classList.toggle('dark', theme === 'dark');
    if (window) localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <ToastProvider>
        <Component {...pageProps} />
      </ToastProvider>
    </ThemeContext.Provider>
  );
}
