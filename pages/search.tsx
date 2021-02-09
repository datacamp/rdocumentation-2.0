/* eslint-disable sonarjs/no-duplicate-string */
import fetch from 'isomorphic-fetch';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import ClickableCard from '../components/ClickableCard';
import Layout from '../components/Layout';

export default function SearchResults() {
  const router = useRouter();
  const [packageResults, setPackageResults] = useState([]);
  const [functionResults, setFunctionResults] = useState([]);
  const { q: searchTerm } = router.query;

  useEffect(() => {
    async function getResults() {
      const resPackages = await fetch(
        `https://www.rdocumentation.org/search_packages?q=${searchTerm}&page=1&latest=1`,
        {
          headers: {
            Accept: 'application/json',
          },
        },
      );
      const resFunctions = await fetch(
        `https://www.rdocumentation.org/search_functions?q=${searchTerm}&page=1&latest=1`,
        {
          headers: {
            Accept: 'application/json',
          },
        },
      );
      const { packages } = await resPackages.json();
      const { functions } = await resFunctions.json();
      setPackageResults(packages);
      setFunctionResults(functions);
    }
    getResults();
  }, [searchTerm]);

  return (
    <Layout title={`Results for '${searchTerm}'`}>
      <div className="w-full max-w-screen-lg mx-auto mt-8 md:mt-12">
        <h1 className="text-lg">Search results for '{searchTerm}':</h1>
        <div className="grid grid-cols-1 mt-5 md:grid-cols-2">
          <div className="pb-5 space-y-4 md:border-r md:space-y-5 md:pr-10">
            <h2 className="text-2xl">Packages</h2>
            {packageResults.map((p) => (
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
            {functionResults.map((f) => (
              <ClickableCard
                description={f.description}
                extraInfo={`version ${f.fields.version}`}
                href={`/packages/${f.fields.package_name}/versions/${f.fields.version}/topics/${f.fields.name}`}
                id={`${f.fields.name}-${f.fields.version}`}
                key={`${f.fields.name}-${f.fields.version}`}
                name={f.fields.name}
              />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
