import '../styles/index.css';

import { GlobalFontFaces } from '@datacamp/waffles-text';
import type { AppProps /* , AppContext */ } from 'next/app';
import { FC, useEffect, useState } from 'react';

import Layout from '../components/Layout';

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
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
      <Layout isDark={isDark} setIsDark={setIsDark}>
        <Component {...pageProps} isDark={isDark} />
      </Layout>
    </>
  );
};

export default MyApp;
