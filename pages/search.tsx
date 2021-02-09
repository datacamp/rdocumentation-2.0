import Button from '@datacamp/waffles-button';
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
  const { q: searchTerm } = router.query;
  const { theme } = useContext(ThemeContext);

  const [packageResults, setPackageResults] = useState<PackageResult[] | []>(
    [],
  );
  const [functionResults, setFunctionResults] = useState<FunctionResult[] | []>(
    [],
  );
  const [pagesShown, setPagesShown] = useState(1);

  // reset search results and page count when search term changes
  useEffect(() => {
    setPackageResults([]);
    setFunctionResults([]);
    setPagesShown(1);
  }, [searchTerm]);

  // fetch first page of results and add pages as requested
  useEffect(() => {
    async function getResults() {
      const resPackages = await fetch(
        `https://www.rdocumentation.org/search_packages?q=${searchTerm}&page=${pagesShown}&latest=1`,
        {
          headers: {
            Accept: 'application/json',
          },
        },
      );
      const resFunctions = await fetch(
        `https://www.rdocumentation.org/search_functions?q=${searchTerm}&page=${pagesShown}&latest=1`,
        {
          headers: {
            Accept: 'application/json',
          },
        },
      );
      const { packages } = await resPackages.json();
      const { functions } = await resFunctions.json();
      setPackageResults((prevState) => [...prevState, ...packages]);
      setFunctionResults((prevState) => [...prevState, ...functions]);
    }
    // get results once search term exists
    if (searchTerm) getResults();
  }, [searchTerm, pagesShown]);

  return (
    <Layout title={searchTerm ? `Results for '${searchTerm}'` : ''}>
      <div className="w-full max-w-screen-lg mx-auto mt-8 md:mt-12">
        <h1 className="text-lg">Search results for '{searchTerm}':</h1>
        <div className="grid grid-cols-1 mt-5 md:grid-cols-2">
          <div className="pb-5 space-y-4 md:border-r md:space-y-5 md:pr-10">
            <h2 className="text-2xl">Packages</h2>
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
          </div>
          <div className="pb-5 mt-5 space-y-4 md:mt-0 md:space-y-5 md:pl-10">
            <h2 className="text-2xl">Functions</h2>
            {functionResults.map((f: FunctionResult) => (
              <ClickableCard
                description={f.title}
                extraInfo={f.fields.package_name}
                href={`/packages/${f.fields.package_name}/versions/${f.fields.version}/topics/${f.fields.name}`}
                id={`${f.fields.name}-${f.fields.version}`}
                key={`${f.fields.name}-${f.fields.version}`}
                name={f.fields.name}
              />
            ))}
          </div>
        </div>
        {(functionResults.length > 0 || packageResults.length > 0) && (
          <div className="flex justify-center mt-6">
            <Button
              appearance={theme === 'light' ? 'default' : 'primary'}
              intent={theme === 'light' ? 'neutral' : 'b2b'}
              onClick={() => setPagesShown(pagesShown + 1)}
            >
              See More
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}
