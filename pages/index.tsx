import { Heading } from '@datacamp/waffles/heading';
import { mediaQuery } from '@datacamp/waffles/helpers';
import {
  darkThemeStyle,
  lightThemeStyle,
  theme as themeTokens,
} from '@datacamp/waffles/theme';
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
  '&, &[data-theme="light"]': {
    ...lightThemeStyle,
  },
  '&[data-theme="dark"]': {
    ...darkThemeStyle,
  },
  marginLeft: 'auto',
  marginRight: 'auto',
  [mediaQuery.aboveMedium]: {
    marginTop: '14rem',
    width: '65%',
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
      data-theme={theme}
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
      <div className="grid md:grid-cols-3 w-full max-w-4xl mx-auto px-8 mt-8 md:mt-16">
        <div className="flex flex-col">
          <a
            className="text-xl md:text-2xl lg:text-3xl"
            href="https://www.datacamp.com/learn/r"
          >
            <strong>Learn R</strong>
          </a>
          <ul className="list-inside list-disc">
            <li>
              <a
                className="underline"
                href="https://www.datacamp.com/courses/free-introduction-to-r"
              >
                Introduction to R Course
              </a>
            </li>
            <li>
              <a
                className="underline"
                href="https://www.datacamp.com/blog/all-about-r"
              >
                What is R?
              </a>
            </li>
            <li>
              <a
                className="underline"
                href="https://www.datacamp.com/tutorial/r-or-python-for-data-analysis"
              >
                R vs Python
              </a>
            </li>
          </ul>
        </div>
        <div className="col-span-2 mt-8 md:mt-0">
          <a
            className="text-xl md:text-2xl lg:text-3xl"
            href="https://www.datacamp.com/tutorial/category/r-programming"
          >
            <strong>Popular R Tutorials</strong>
          </a>
          <ol className="list-decimal md:grid-cols-2 grid list-inside gap-4">
            <li>
              <a
                className="underline"
                href="https://www.datacamp.com/tutorial/linear-regression-R"
              >
                Linear Regression in&nbsp;R
              </a>
            </li>
            <li>
              <a
                className="underline"
                href="https://www.datacamp.com/tutorial/logistic-regression-R"
              >
                Logistic regression in&nbsp;R
              </a>
            </li>
            <li>
              <a
                className="underline"
                href="https://www.datacamp.com/tutorial/pca-analysis-r"
              >
                Principal Component Analysis in&nbsp;R
              </a>
            </li>
            <li>
              <a
                className="underline"
                href="https://www.datacamp.com/tutorial/make-histogram-basic-r"
              >
                Histograms in&nbsp;R
              </a>
            </li>
            <li>
              <a
                className="underline"
                href="https://www.datacamp.com/tutorial/hierarchical-clustering-R"
              >
                Hierarchical Clustering in&nbsp;R
              </a>
            </li>
            <li>
              <a
                className="underline"
                href="https://www.datacamp.com/tutorial/decision-trees-R"
              >
                Decision Trees in R
              </a>
            </li>
            <li>
              <a
                className="underline"
                href="https://www.datacamp.com/tutorial/r-data-import-tutorial"
              >
                Importing Data into R
              </a>
            </li>
            <li>
              <a
                className="underline"
                href="https://www.datacamp.com/tutorial/contingency-tables-r"
              >
                Contingency Tables in R
              </a>
            </li>
          </ol>
        </div>
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
