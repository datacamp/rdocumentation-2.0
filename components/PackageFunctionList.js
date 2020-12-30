import { useState } from 'react';
import Link from 'next/link';
import { Input } from '@datacamp/waffles-form-elements';
import { Html } from '../lib/utils';

export default function PackageFunctionList({
  packageName,
  packageVersion,
  functions,
}) {
  const [searchInput, setSearchInput] = useState('');

  let filteredFunctions = functions;
  const cleanSearchValue = searchInput.trim().toLowerCase();

  if (searchInput !== '') {
    filteredFunctions = filteredFunctions.filter(
      (f) =>
        f.name.toLowerCase().indexOf(cleanSearchValue) > -1 ||
        f.title.toLowerCase().indexOf(cleanSearchValue) > -1
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{`Functions in ${packageName} (${packageVersion})`}</h2>
        </div>
        <Input
          name="functionSearch"
          size="small"
          className="w-72"
          value={searchInput}
          onChange={setSearchInput}
          placeholder="Search all functions"
        />
      </div>
      <div className="grid grid-cols-3 gap-5 mt-5">
        {filteredFunctions.map((f) => (
          <div
            key={f.id}
            className="border-2 rounded-md hover:border-dc-navy dark:hover:border-dc-yellow"
          >
            <Link
              href={`/packages/${packageName}/versions/${packageVersion}/topics/${f.name}`}
            >
              <a>
                <div className="px-4 py-3">
                  <div className="font-bold">{f.name}</div>
                  <div className="mt-2 text-sm">
                    <Html>{f.title}</Html>
                  </div>
                </div>
              </a>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
