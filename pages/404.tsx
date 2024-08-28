import { Button } from '@datacamp/waffles/button';

import Layout from '../components/Layout';

export default function Custom404() {
  return (
    <Layout title="Page not found">
      <div className="flex flex-col items-center mt-32 md:mt-56">
        <h1 className="text-xl md:text-2xl">Oops, that page doesn't exist.</h1>
        <div className="mt-8">
          <Button as="a" href="/" size="large">
            Go Home
          </Button>
        </div>
      </div>
    </Layout>
  );
}
