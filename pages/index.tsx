import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';

import HomeSearchBar from '../components/HomeSearchBar';

export default function HomePage() {
  const [searchInput, setSearchInput] = useState('');
  const router = useRouter();

  function handleChangeSearchInput(e) {
    setSearchInput(e.target.value);
  }

  function onSubmitSearch(e) {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(searchInput)}`);
    setSearchInput('');
  }

  return (
    <>
      <Head>
        <title>Home | RDocumentation</title>
        <meta
          content="Easily search the documentation for every version of every R package on CRAN and Bioconductor."
          name="description"
        />
      </Head>
      <div className="w-full max-w-4xl mx-auto mt-32 md:mt-56">
        <h1 className="text-xl md:text-2xl lg:text-3xl">
          Search all 22,432 R packages on CRAN and Bioconductor
        </h1>
        <form onSubmit={onSubmitSearch}>
          <HomeSearchBar
            onChange={handleChangeSearchInput}
            value={searchInput}
          />
        </form>
      </div>
    </>
  );
}
