import { GlobalFontFaces } from '@datacamp/waffles-text';
import '../styles/index.css';
import Layout from '../components/Layout';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <GlobalFontFaces />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

export default MyApp;
