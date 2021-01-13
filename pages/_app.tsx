import '../styles/index.css';

import { GlobalFontFaces } from '@datacamp/waffles-text';
import type { AppProps } from 'next/app';
import { useEffect, useState } from 'react';

export default function MyApp({ Component, pageProps }: AppProps) {
  const [isDark, setIsDark] = useState(false);

  // if we're client-side, check local storage on mount
  useEffect(() => {
    if (window) {
      let darkMode = false;
      darkMode = JSON.parse(localStorage.getItem('darkMode'));
      setIsDark(darkMode);
    }
  }, []);

  // run every time dark mode is toggled
  useEffect(() => {
    document.querySelector('html').classList.toggle('dark', isDark);
    if (window) localStorage.setItem('darkMode', String(isDark));
  }, [isDark]);

  return (
    <>
      <GlobalFontFaces />
      <Component {...pageProps} />
    </>
  );
}
