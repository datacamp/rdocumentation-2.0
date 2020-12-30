import Head from 'next/head';
import { useRouter } from 'next/router';
import ClickableCard from '../components/ClickableCard';

const fakeSearchResults = [
  {
    id: 1,
    name: 'dplyr',
    description: 'A Grammar of Data Manipulation',
    extraInfo: 'package',
    href: '/packages/dplyr',
  },
  {
    id: 2,
    name: 'data.table',
    description: 'Extension of Data.frame',
    extraInfo: 'package',
    href: '/packages/data.table',
  },
  {
    id: 3,
    name: 'mutate (dplyr)',
    description: 'Add new variables',
    extraInfo: 'function',
    href: '/packages/dplyr',
  },
  {
    id: 4,
    name: 'merge (data.table)',
    description: 'Merge two data.tables',
    extraInfo: 'function',
    href: '/packages/data.table',
  },
  {
    id: 5,
    name: 'stringr',
    description: 'Simple, Consistent Wrappers for Common String Operations',
    extraInfo: 'package',
    href: '/packages/stringr',
  },
  {
    id: 6,
    name: 'fread (data.table)',
    description: 'Fast and friendly file finagler',
    extraInfo: 'function',
    href: '/packages/data.table',
  },
  {
    id: 7,
    name: 'swirl',
    description: 'Learn R, in R',
    extraInfo: 'package',
    href: '/packages/swirl',
  },
  {
    id: 8,
    name: 'str_trunc (stringr)',
    description: 'Truncate a character string.',
    extraInfo: 'function',
    href: '/packages/stringr',
  },
];

export default function SearchResults() {
  const router = useRouter();
  const { q } = router.query;

  return (
    <>
      <Head>
        <title>Results for '{q}' | RDocumentation</title>
      </Head>
      <div className="w-full max-w-screen-lg mx-auto mt-12">
        <h1 className="text-xl">Search results for '{q}':</h1>
        <div className="grid grid-cols-3 gap-5 mt-5">
          {fakeSearchResults.map((result) => (
            <ClickableCard
              id={result.id}
              name={result.name}
              description={result.description}
              extraInfo={result.extraInfo}
              href={result.href}
            />
          ))}
        </div>
      </div>
    </>
  );
}
