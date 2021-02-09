/* eslint-disable no-console */
import Button, { ButtonGroup } from '@datacamp/waffles-button';
import { ArrowUpIcon } from '@datacamp/waffles-icons';
import fetch from 'isomorphic-fetch';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';

import ClickableCard from '../components/ClickableCard';
import Layout from '../components/Layout';

import { ThemeContext } from './_app';

type PackageResult = {
  description: string;
  fields: {
    maintainer: string[];
    package_name: string;
    version: string;
  };
  score: number;
};

type FunctionResult = {
  description: string;
  fields: {
    maintainer: string[];
    name: string;
    package_name: string;
    version: string;
  };
  score: number;
  title: string;
};

export default function SearchResults() {
  const router = useRouter();
  const { p: page, q: searchTerm } = router.query;
  const { theme } = useContext(ThemeContext);

  const [packageResults, setPackageResults] = useState<PackageResult[]>([]);
  const [functionResults, setFunctionResults] = useState<FunctionResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // if no page in query params, then we're on page 1
  const pageNumber = page ? Number(page) : 1;

  // fetch first page of results and add pages as requested
  useEffect(() => {
    async function fetchResults() {
      setIsLoading(true);
      console.log(`Fetching page ${pageNumber} for ${searchTerm}...`);
      try {
        // fetch the data
        const resPackages = await fetch(
          `https://www.rdocumentation.org/search_packages?q=${searchTerm}&page=${pageNumber}&latest=1`,
          {
            headers: {
              Accept: 'application/json',
            },
          },
        );
        const resFunctions = await fetch(
          `https://www.rdocumentation.org/search_functions?q=${searchTerm}&page=${pageNumber}&latest=1`,
          {
            headers: {
              Accept: 'application/json',
            },
          },
        );
        // extract the results
        const { packages } = await resPackages.json();
        const { functions } = await resFunctions.json();
        if (pageNumber === 1) {
          // if on first page, overwrite the results
          setPackageResults(packages);
          setFunctionResults(functions);
        } else {
          // otherwise, append to previous results
          setPackageResults((prevState) => [...prevState, ...packages]);
          setFunctionResults((prevState) => [...prevState, ...functions]);
        }
        // set loading state to false
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    }
    // get results once search term exists
    if (searchTerm) fetchResults();
  }, [searchTerm, pageNumber]);

  return (
    <Layout title={searchTerm ? `Results for '${searchTerm}'` : ''}>
      <div className="w-full max-w-screen-lg mx-auto mt-8 md:mt-12">
        <h1 className="text-lg">Search results for '{searchTerm}':</h1>
        <div className="grid grid-cols-1 mt-5 md:grid-cols-2">
          <div className="pb-5 space-y-4 md:border-r md:space-y-5 md:pr-10">
            <h2 className="text-2xl">Packages</h2>
            {isLoading || packageResults.length > 0 ? (
              <>
                {packageResults.map((p: PackageResult) => (
                  <ClickableCard
                    description={p.description}
                    extraInfo={`version ${p.fields.version}`}
                    href={`/packages/${p.fields.package_name}/versions/${p.fields.version}`}
                    id={`${p.fields.package_name}-${p.fields.version}`}
                    key={`${p.fields.package_name}-${p.fields.version}`}
                    name={p.fields.package_name}
                  />
                ))}
              </>
            ) : (
              <p className="italic text-gray-600">No packages found</p>
            )}
          </div>
          <div className="pb-5 mt-5 space-y-4 md:mt-0 md:space-y-5 md:pl-10">
            <h2 className="text-2xl">Functions</h2>
            {isLoading || functionResults.length > 0 ? (
              <>
                {functionResults.map((f: FunctionResult) => (
                  <ClickableCard
                    description={f.title}
                    extraInfo={f.fields.package_name}
                    href={`/packages/${f.fields.package_name}/versions/${f.fields.version}/topics/${f.fields.name}`}
                    id={`${f.fields.package_name}-${f.fields.name}-${f.fields.version}`}
                    key={`${f.fields.package_name}-${f.fields.name}-${f.fields.version}`}
                    name={f.fields.name}
                  />
                ))}
              </>
            ) : (
              <p className="italic text-gray-600">No functions found</p>
            )}
          </div>
        </div>
        {!isLoading && (
          <div className="flex justify-center mt-6">
            <ButtonGroup>
              <Button
                appearance={theme === 'light' ? 'default' : 'inverted'}
                onClick={() =>
                  router.push(
                    `/search?q=${searchTerm}&p=${pageNumber + 1}`,
                    undefined,
                    {
                      scroll: false,
                    },
                  )
                }
              >
                See More
              </Button>
              <Button
                appearance={theme === 'light' ? 'default' : 'inverted'}
                onClick={() => window.scrollTo({ behavior: 'smooth', top: 0 })}
              >
                <ArrowUpIcon />
                Back to Top
              </Button>
            </ButtonGroup>
          </div>
        )}
      </div>
    </Layout>
  );
}
