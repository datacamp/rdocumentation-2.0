import Button from '@datacamp/waffles-button';
import { useContext } from 'react';

import Layout from '../components/Layout';

import { ThemeContext } from './_app';

export default function Custom404() {
  const { theme } = useContext(ThemeContext);

  return (
    <Layout title="Page not found">
      <div className="flex flex-col items-center mt-32 md:mt-56">
        <h1 className="text-xl md:text-2xl">Oops, that page doesn't exist.</h1>
        <div className="mt-8">
          <Button
            appearance={theme === 'light' ? 'default' : 'primary'}
            href="/"
            intent={theme === 'light' ? 'neutral' : 'b2b'}
            size="large"
            type="link"
          >
            Go Home
          </Button>
        </div>
      </div>
    </Layout>
  );
}
