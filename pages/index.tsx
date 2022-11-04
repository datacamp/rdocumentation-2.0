import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';

import AutoComplete from '../components/Autocomplete';
import HomeSearchBar from '../components/HomeSearchBar';
import Layout from '../components/Layout';
import { API_URL } from '../lib/utils';

export default function HomePage({ packageCount }: { packageCount?: number }) {
  const [searchInput, setSearchInput] = useState('');

  const router = useRouter();

  function handleChangeSearchInput(e) {
    setSearchInput(e.target.value);
  }

  function onSubmitSearch(e) {
    e.preventDefault();
    if (!searchInput) return;
    router.push(`/search?q=${encodeURIComponent(searchInput)}`);
    setSearchInput('');
  }

  return (
    <Layout
      description="Easily search the documentation for every version of every R package on CRAN and Bioconductor."
      title="Home"
    >
      <div className="w-full max-w-4xl mx-auto mt-32 md:mt-56">
        <div className="text-xl md:text-2xl lg:text-3xl">
          {`Search all ${
            packageCount > 0
              ? `${packageCount.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}`
              : ''
          } R packages on CRAN and Bioconductor`}
        </div>
        <form onSubmit={onSubmitSearch}>
          <HomeSearchBar
            onChange={handleChangeSearchInput}
            value={searchInput}
          />
        </form>
        <AutoComplete searchInput={searchInput} />
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (_context) => {
  let packageCount;
  try {
    const response = await fetch(
      `${API_URL}/api/packages?limit=${Number.MAX_SAFE_INTEGER}`,
      {
        method: 'HEAD',
      },
    );
    packageCount = parseInt(response.headers.get('x-total-count'));
  } catch (error) {
    packageCount = null;
  }
  return {
    props: {
      packageCount,
    },
  };
};
