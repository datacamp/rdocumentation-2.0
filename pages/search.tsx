/* eslint-disable no-console */
import { Button } from '@datacamp/waffles/button';
import { Heading } from '@datacamp/waffles/heading';
import { ArrowLeft, ArrowRight } from '@datacamp/waffles/icon';
import { Text } from '@datacamp/waffles/text';
import { tokens } from '@datacamp/waffles/tokens';
import styled from '@emotion/styled';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';

import ClickableCard from '../components/ClickableCard';
import Layout from '../components/Layout';
import {
  buildPackageFallbackEndpoint,
  buildSearchEndpoints,
  formatSearchHeading,
  packageNameCandidate,
  parseSearchQuery,
} from '../lib/searchQueryParser';
import { API_URL } from '../lib/utils';
import { keepNewestVersionPerKey } from '../lib/versionCompare';

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

const JSON_HEADERS = { Accept: 'application/json' };

/**
 * latest=1 drops packages whose latest_version flag is missing from the index
 * instead of showing an older version, which would make them undiscoverable.
 * When the query looks like a package name and no exact match came back,
 * recover it with one unfiltered request.
 *
 * Remove once COMM-10361 fixes the underlying data.
 */
async function recoverExactPackageMatch(
  parsed: ReturnType<typeof parseSearchQuery>,
  pageNumber: number,
  deduplicatedPackages: PackageResult[],
): Promise<PackageResult[]> {
  if (pageNumber !== 1) return deduplicatedPackages;

  const candidate = packageNameCandidate(parsed);
  if (!candidate) return deduplicatedPackages;

  const candidateLower = candidate.toLowerCase();
  const alreadyPresent = deduplicatedPackages.some(
    (p) => p?.fields?.package_name?.toLowerCase() === candidateLower,
  );
  if (alreadyPresent) return deduplicatedPackages;

  const endpoint = buildPackageFallbackEndpoint(API_URL, parsed, pageNumber);
  const response = await fetch(endpoint, { headers: JSON_HEADERS });
  if (!response.ok) return deduplicatedPackages;

  const data = await response.json();
  const exactMatches = (data.packages || []).filter(
    (p: PackageResult) =>
      p?.fields?.package_name?.toLowerCase() === candidateLower,
  );
  const recovered = keepNewestVersionPerKey(
    exactMatches,
    (p: PackageResult) => p?.fields?.package_name,
    (p: PackageResult) => p?.fields?.version,
  );

  return recovered.length > 0
    ? [...recovered, ...deduplicatedPackages]
    : deduplicatedPackages;
}

export default function SearchResults() {
  const router = useRouter();
  const { p: page, q: searchTerm } = router.query;

  const [packageResults, setPackageResults] = useState<PackageResult[]>([]);
  const [functionResults, setFunctionResults] = useState<FunctionResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const pageNumber = page ? Number(page) : 1;
  const onFirstPage = pageNumber === 1;
  const onLastPage = packageResults.length < 15 && functionResults.length < 15;

  const parsedQuery = useMemo(
    () => parseSearchQuery(searchTerm as string),
    [searchTerm],
  );

  useEffect(() => {
    async function fetchResults() {
      try {
        setPackageResults([]);
        setFunctionResults([]);
        setIsLoading(true);

        const { functionsEndpoint, packagesEndpoint } = buildSearchEndpoints(
          API_URL,
          parsedQuery,
          pageNumber,
        );

        const resPackages = await fetch(packagesEndpoint, {
          headers: JSON_HEADERS,
        });
        const resFunctions = await fetch(functionsEndpoint, {
          headers: JSON_HEADERS,
        });

        let packages: PackageResult[] = [];
        let functions: FunctionResult[] = [];

        if (resPackages.ok) {
          const packagesData = await resPackages.json();
          packages = packagesData.packages || [];
        }

        if (resFunctions.ok) {
          const functionsData = await resFunctions.json();
          functions = functionsData.functions || [];
        }

        // The API can still return more than one version per package or
        // function. Keep the newest one rather than the first one returned,
        // because equal relevance scores are tied-broken by index insertion
        // order, which puts the oldest release first.
        const deduplicatedPackages = keepNewestVersionPerKey(
          packages,
          (p) => p?.fields?.package_name,
          (p) => p?.fields?.version,
        );

        const deduplicatedFunctions = keepNewestVersionPerKey(
          functions,
          (f) =>
            f?.fields?.name && f?.fields?.package_name
              ? `${f.fields.name}@${f.fields.package_name}`
              : null,
          (f) => f?.fields?.version,
        );

        const finalPackages = await recoverExactPackageMatch(
          parsedQuery,
          pageNumber,
          deduplicatedPackages,
        );

        setPackageResults(finalPackages);
        setFunctionResults(deduplicatedFunctions);
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
  }, [searchTerm, pageNumber, parsedQuery]);

  function handlePreviousPage() {
    if (onFirstPage) return;
    router.push(`/search?q=${searchTerm}&p=${pageNumber - 1}`);
  }

  function handleNextPage() {
    if (onLastPage) return;
    router.push(`/search?q=${searchTerm}&p=${pageNumber + 1}`);
  }

  const pageTitle = parsedQuery.isScoped
    ? `Results for '${parsedQuery.functionName}' in '${parsedQuery.packageName}'`
    : `Results for '${parsedQuery.rawQuery}'`;

  return (
    <Layout title={searchTerm ? pageTitle : ''}>
      <div className="mt-8 md:mt-12">
        <Heading size="large">
          {formatSearchHeading(parsedQuery, pageNumber)}
        </Heading>
        <Text className="text-gray-500 mt-2 block">
          Tip: Search for functions using function(package) format, e.g.
          lm(stats)
        </Text>
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
