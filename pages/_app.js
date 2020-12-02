/* eslint-disable react/jsx-props-no-spreading */
import { useState, useEffect } from 'react';
import { GlobalFontFaces } from '@datacamp/waffles-text';
import '../styles/index.css';
import Layout from '../components/Layout';

function MyApp({ Component, pageProps }) {
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
    if (window) localStorage.setItem('darkMode', isDark);
  }, [isDark]);

  return (
    <>
      <GlobalFontFaces />
      <Layout isDark={isDark} setIsDark={setIsDark}>
        <Component {...pageProps} isDark={isDark} />
      </Layout>
    </>
  );
}

export default MyApp;
