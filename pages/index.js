import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import HomeSearchBar from '../components/HomeSearchBar';

export default function HomePage() {
  const [searchInput, setSearchInput] = useState('');
  const router = useRouter();

  function handleChangeSearchInput(e) {
    setSearchInput(e.target.value);
  }

  function onSubmitSearch(e) {
    e.preventDefault();
    router.push(`/search?q=${searchInput}`);
  }

  return (
    <>
      <Head>
        <title>Home | RDocumentation</title>
      </Head>
      <div className="w-3/4 mx-auto mt-56">
        <h1 className="text-3xl">
          Search all 22,432 R packages on CRAN and Bioconductor
        </h1>
        <form onSubmit={onSubmitSearch}>
          <HomeSearchBar
            value={searchInput}
            onChange={handleChangeSearchInput}
          />
        </form>
      </div>
    </>
  );
}
