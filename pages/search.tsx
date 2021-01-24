/* eslint-disable sonarjs/no-duplicate-string */
import { useRouter } from 'next/router';

import ClickableCard from '../components/ClickableCard';
import Layout from '../components/Layout';

const fakeSearchResults = {
  functions: [
    {
      description: 'Add new variables',
      extraInfo: 'function',
      href: '/packages/dplyr',
      id: 3,
      name: 'mutate (dplyr)',
    },
    {
      description: 'Merge two data.tables',
      extraInfo: 'function',
      href: '/packages/data.table',
      id: 4,
      name: 'merge (data.table)',
    },

    {
      description: 'Fast and friendly file finagler',
      extraInfo: 'function',
      href: '/packages/data.table',
      id: 6,
      name: 'fread (data.table)',
    },

    {
      description: 'Truncate a character string.',
      extraInfo: 'function',
      href: '/packages/stringr',
      id: 8,
      name: 'str_trunc (stringr)',
    },
  ],
  packages: [
    {
      description: 'A Grammar of Data Manipulation',
      extraInfo: 'package',
      href: '/packages/dplyr',
      id: 1,
      name: 'dplyr',
    },
    {
      description: 'Extension of Data.frame',
      extraInfo: 'package',
      href: '/packages/data.table',
      id: 2,
      name: 'data.table',
    },
    {
      description: 'Simple, Consistent Wrappers for Common String Operations',
      extraInfo: 'package',
      href: '/packages/stringr',
      id: 5,
      name: 'stringr',
    },
    {
      description: 'Learn R, in R',
      extraInfo: 'package',
      href: '/packages/swirl',
      id: 7,
      name: 'swirl',
    },
  ],
};

export default function SearchResults() {
  const router = useRouter();
  const { q } = router.query;

  return (
    <Layout title={`Results for '${q}'`}>
      <div className="w-full max-w-screen-lg mx-auto mt-8 md:mt-12">
        <h1 className="text-lg">Search results for '{q}':</h1>
        <div className="grid grid-cols-1 mt-5 md:grid-cols-2">
          <div className="pb-5 space-y-4 md:border-r md:space-y-5 md:pr-10">
            <h2 className="text-2xl">Packages</h2>
            {fakeSearchResults.packages.map((packageResult) => (
              <ClickableCard
                description={packageResult.description}
                extraInfo={packageResult.extraInfo}
                href={packageResult.href}
                id={packageResult.id}
                key={packageResult.id}
                name={packageResult.name}
              />
            ))}
          </div>
          <div className="pb-5 mt-5 space-y-4 md:mt-0 md:space-y-5 md:pl-10">
            <h2 className="text-2xl">Functions</h2>
            {fakeSearchResults.functions.map((functionResult) => (
              <ClickableCard
                description={functionResult.description}
                extraInfo={functionResult.extraInfo}
                href={functionResult.href}
                id={functionResult.id}
                key={functionResult.id}
                name={functionResult.name}
              />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
