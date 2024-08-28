/** @jsxImportSource @emotion/react */
import { Heading } from '@datacamp/waffles/heading';
import { mediaQuery } from '@datacamp/waffles/helpers';
import { theme as themeTokens } from '@datacamp/waffles/theme';
import { tokens } from '@datacamp/waffles/tokens';
import styled from '@emotion/styled';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';

import AutoComplete from '../components/Autocomplete';
import { HomePageLinks } from '../components/HomePageLinks';
import HomeSearchBar from '../components/HomeSearchBar';
import Layout from '../components/Layout';
import { API_URL } from '../lib/utils';

import { ThemeContext } from './_app';

const SearchWrapper = styled.div({
  margin: tokens.spacing.medium,
  width: `calc(100% - 2 * ${tokens.spacing.medium})`,
  [mediaQuery.aboveMedium]: {
    margin: `${tokens.spacing.xxlarge} auto`,
    width: '70%',
  },
});

export default function HomePage({ packageCount }: { packageCount?: number }) {
  const [searchInput, setSearchInput] = useState('');
  const router = useRouter();
  const { theme } = useContext(ThemeContext);

  function handleChangeSearchInput(e) {
    setSearchInput(e.target.value);
  }

  function onSubmitSearch(e) {
    e.preventDefault();
    if (!searchInput) return;
    router.push(`/search?q=${encodeURIComponent(searchInput)}`);
    setSearchInput('');
  }

  const numberOfPackages =
    packageCount > 0
      ? `${packageCount.toLocaleString(undefined, {
          maximumFractionDigits: 0,
        })}`
      : '';

  return (
    <Layout
      description="Easily search the documentation for every version of every R package on CRAN and Bioconductor."
      title="Home"
    >
      <SearchWrapper data-theme={theme}>
        <Heading as="h2" size="xlarge" style={{ color: themeTokens.text.main }}>
          {`Search from ${numberOfPackages} R packages on CRAN and Bioconductor`}
        </Heading>
        <form onSubmit={onSubmitSearch}>
          <HomeSearchBar
            onChange={handleChangeSearchInput}
            value={searchInput}
          />
        </form>
        <AutoComplete searchInput={searchInput} />
      </SearchWrapper>
      <Heading
        as="h3"
        size="large"
        style={{
          color: themeTokens.text.main,
          fontWeight: tokens.fontWeights.regular,
          textAlign: 'center',
        }}
      >
        Explore learning paths with DataCamp
      </Heading>
      <HomePageLinks />
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
    packageCount = parseInt(response.headers.get('x-total-count'), 10);
  } catch (error) {
    packageCount = null;
  }
  return {
    props: {
      packageCount,
    },
  };
};
