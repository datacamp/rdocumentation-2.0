import '../styles/index.css';
import { GlobalFontFaces } from '@datacamp/waffles-text';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <GlobalFontFaces />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
