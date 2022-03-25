import '../styles/index.css';

import { GlobalFontFaces } from '@datacamp/waffles-text';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { createContext, useEffect, useState } from 'react';
import ReactGA from 'react-ga';

import * as gtag from '../lib/gtag';

export const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => null,
});

export default function MyApp({ Component, pageProps }: AppProps) {
  const [theme, setTheme] = useState('light');

  function toggleTheme() {
    if (theme === 'light') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  }

  // if we're client-side, check local storage on mount
  useEffect(() => {
    ReactGA.initialize(gtag.GA_TRACKING_ID);

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

  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = (url) => {
      gtag.pageview(url);
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      <GlobalFontFaces />
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <Component {...pageProps} />
      </ThemeContext.Provider>
    </>
  );
}
