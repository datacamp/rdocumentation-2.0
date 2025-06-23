/* eslint-disable no-console */
import { Button } from '@datacamp/waffles/button';
import { Heading } from '@datacamp/waffles/heading';
import { ArrowLeft, ArrowRight } from '@datacamp/waffles/icon';
import { tokens } from '@datacamp/waffles/tokens';
import styled from '@emotion/styled';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import ClickableCard from '../components/ClickableCard';
import Layout from '../components/Layout';
import { API_URL } from '../lib/utils';

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

const ButtonWrapper = styled.div(`
  display: flex;
  gap: ${tokens.spacing.medium};
  padding: ${tokens.spacing.large};
  justify-content: center;
`);

export default function SearchResults() {
  const router = useRouter();
  const { p: page, q: searchTerm } = router.query;

  const [packageResults, setPackageResults] = useState<PackageResult[]>([]);
  const [functionResults, setFunctionResults] = useState<FunctionResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const pageNumber = page ? Number(page) : 1;
  const onFirstPage = pageNumber === 1;
  const onLastPage = packageResults.length < 15 && functionResults.length < 15;

  // fetch first page of results and add pages as requested
  useEffect(() => {
    async function fetchResults() {
      try {
        setPackageResults([]);
        setFunctionResults([]);
        setIsLoading(true);
        // fetch the data
        const packagesEndpoint = `${API_URL}/search_packages?q=${searchTerm}&page=${pageNumber}&latest=1`;
        const functionsEndpoint = `${API_URL}/search_functions?q=${searchTerm}&page=${pageNumber}&latest=1`;

        const resPackages = await fetch(packagesEndpoint, {
          headers: {
            Accept: 'application/json',
          },
        });
        const resFunctions = await fetch(functionsEndpoint, {
          headers: {
            Accept: 'application/json',
          },
        });

        let packages = [];
        let functions = [];

        if (resPackages.ok) {
          const packagesData = await resPackages.json();
          packages = packagesData.packages || [];
        }

        if (resFunctions.ok) {
          const functionsData = await resFunctions.json();
          functions = functionsData.functions || [];
        }

        setPackageResults(packages);
        setFunctionResults(functions);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
    }

    if (!searchTerm) {
      setPackageResults([]);
      setFunctionResults([]);
      setIsLoading(false);
      return;
    }

    fetchResults();
  }, [searchTerm, pageNumber]);

  function handlePreviousPage() {
    if (onFirstPage) return;
    router.push(`/search?q=${searchTerm}&p=${pageNumber - 1}`);
  }

  function handleNextPage() {
    if (onLastPage) return;
    router.push(`/search?q=${searchTerm}&p=${pageNumber + 1}`);
  }

  return (
    <Layout title={searchTerm ? `Results for '${searchTerm}'` : ''}>
      <div className="mt-8 md:mt-12">
        <Heading size="large">
          Page {pageNumber} of results for '{searchTerm}':
        </Heading>
        <div className="grid grid-cols-1 mt-5 md:grid-cols-2">
          {/* package results */}
          <div className="pb-5 space-y-4 md:border-r md:space-y-5 md:pr-10">
            <h2 className="text-2xl">Packages</h2>
            {!isLoading && packageResults.length > 0 ? (
              <>
                {packageResults.map((p: PackageResult) => (
                  <ClickableCard
                    description={p.description}
                    extraInfo={`version: ${p.fields.version}`}
                    href={`/packages/${p.fields.package_name}/versions/${p.fields.version}`}
                    id={`${p.fields.package_name}-${p.fields.version}`}
                    key={`${p.fields.package_name}-${p.fields.version}`}
                    name={p.fields.package_name}
                  />
                ))}
              </>
            ) : (
              <p className="italic text-gray-600">
                {isLoading ? 'Loading results...' : 'No packages found'}
              </p>
            )}
          </div>

          {/* function results */}
          <div className="pb-5 mt-5 space-y-4 md:mt-0 md:space-y-5 md:pl-10">
            <h2 className="text-2xl">Functions</h2>
            {!isLoading && functionResults.length > 0 ? (
              <>
                {functionResults.map((f: FunctionResult) => (
                  <ClickableCard
                    description={f.description}
                    extraInfo={`package: ${f.fields.package_name}`}
                    href={`/packages/${f.fields.package_name}/versions/${f.fields.version}/topics/${f.fields.name}`}
                    id={`${f.fields.package_name}-${f.fields.name}-${f.fields.version}`}
                    key={`${f.fields.package_name}-${f.fields.name}-${f.fields.version}`}
                    name={f.fields.name}
                  />
                ))}
              </>
            ) : (
              <p className="italic text-gray-600">
                {isLoading ? 'Loading results...' : 'No functions found'}
              </p>
            )}
          </div>
        </div>

        {/* page toggle buttons */}
        {(packageResults.length > 0 || functionResults.length > 0) && (
          <ButtonWrapper>
            <Button disabled={onFirstPage} onClick={handlePreviousPage}>
              <ArrowLeft />
              Previous Page
            </Button>
            <Button disabled={onLastPage} onClick={handleNextPage}>
              Next Page
              <ArrowRight />
            </Button>
          </ButtonWrapper>
        )}
      </div>
    </Layout>
  );
}
