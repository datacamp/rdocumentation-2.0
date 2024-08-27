import { Button } from '@datacamp/waffles/button';
import { Heading } from '@datacamp/waffles/heading';
import { mediaQuery } from '@datacamp/waffles/helpers';
import { ExternalLink } from '@datacamp/waffles/icon';
import { Link } from '@datacamp/waffles/link';
import {
  darkThemeStyle,
  lightThemeStyle,
  theme as themeTokens,
} from '@datacamp/waffles/theme';
import { tokens } from '@datacamp/waffles/tokens';
import styled from '@emotion/styled';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';

import AutoComplete from '../components/Autocomplete';
import HomeSearchBar from '../components/HomeSearchBar';
import Layout from '../components/Layout';
import { API_URL } from '../lib/utils';

import { ThemeContext } from './_app';

const SearchWrapper = styled.div({
  margin: tokens.spacing.medium,
  width: `calc(100% - 2 * ${tokens.spacing.medium}`,
  [mediaQuery.aboveMedium]: {
    margin: '0 auto',
    marginTop: '14rem',
    width: '65%',
  },
});

const ContentWrapper = styled.div({
  '&, &[data-theme="light"]': {
    ...lightThemeStyle,
  },
  '&[data-theme="dark"]': {
    ...darkThemeStyle,
  },
  display: 'grid',
  margin: '0 auto',
  padding: `0 ${tokens.spacing.large} ${tokens.spacing.large}`,
  [mediaQuery.aboveMedium]: {
    gridGap: tokens.spacing.large,
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    marginTop: tokens.spacing.xlarge,
  },
});

const Column = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: tokens.spacing.large,
});

const ListWrapper = styled.div(`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.small};
  `);

const linkStyle = {
  '&:hover': {
    backgroundColor: 'unset',
    border: 'none',
    boxShadow: 'none',
    textDecoration: 'underline',
  },
  backgroundColor: 'unset',
  border: 'none',
  color: themeTokens.text.main,
};

const buttonStyle = {};

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
        <Heading size="xlarge" style={{ color: themeTokens.text.main }}>
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
        size="xxlarge"
        style={{
          color: themeTokens.text.main,
          marginTop: tokens.spacing.xxlarge,
          textAlign: 'center',
        }}
      >
        Explore learning paths with DataCamp
      </Heading>
      <ContentWrapper data-theme={theme}>
        <Column>
          <Button
            as="a"
            href="https://www.datacamp.com/learn/r"
            iconRight={<ExternalLink />}
            style={buttonStyle}
          >
            Learn R
          </Button>
          <ListWrapper>
            <Link
              href="https://www.datacamp.com/courses/free-introduction-to-r"
              style={linkStyle}
            >
              Introduction to R Course
            </Link>
            <Link
              href="https://www.datacamp.com/blog/all-about-r"
              style={linkStyle}
            >
              What is R?
            </Link>
            <Link
              href="https://www.datacamp.com/tutorial/r-or-python-for-data-analysis"
              style={linkStyle}
            >
              R vs Python
            </Link>
          </ListWrapper>
        </Column>
        <Column>
          <Button
            as="a"
            href="https://www.datacamp.com/tutorial/category/r-programming"
            iconRight={<ExternalLink />}
            style={buttonStyle}
          >
            Popular R Tutorials
          </Button>
          <ListWrapper>
            <Link
              href="https://www.datacamp.com/tutorial/linear-regression-R"
              style={linkStyle}
            >
              Linear Regression in&nbsp;R
            </Link>
            <Link
              href="https://www.datacamp.com/tutorial/logistic-regression-R"
              style={linkStyle}
            >
              Logistic regression in&nbsp;R
            </Link>
            <Link
              href="https://www.datacamp.com/tutorial/pca-analysis-r"
              style={linkStyle}
            >
              Principal Component Analysis in&nbsp;R
            </Link>
            <Link
              href="https://www.datacamp.com/tutorial/make-histogram-basic-r"
              style={linkStyle}
            >
              Histograms in&nbsp;R
            </Link>
            <Link
              href="https://www.datacamp.com/tutorial/hierarchical-clustering-R"
              style={linkStyle}
            >
              Hierarchical Clustering in&nbsp;R
            </Link>
            <Link
              href="https://www.datacamp.com/tutorial/decision-trees-R"
              style={linkStyle}
            >
              Decision Trees in R
            </Link>
            <Link
              href="https://www.datacamp.com/tutorial/r-data-import-tutorial"
              style={linkStyle}
            >
              Importing Data into R
            </Link>
            <Link
              href="https://www.datacamp.com/tutorial/contingency-tables-r"
              style={linkStyle}
            >
              Contingency Tables in R
            </Link>
          </ListWrapper>
        </Column>
      </ContentWrapper>
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
