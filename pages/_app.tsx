import '../styles/index.css';

import { GlobalFontFaces } from '@datacamp/waffles-text';
import type { AppProps } from 'next/app';
import { createContext, useEffect, useState } from 'react';

export const ThemeContext = createContext('light');

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
    <>
      <GlobalFontFaces />
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <Component {...pageProps} />
      </ThemeContext.Provider>
    </>
  );
}
