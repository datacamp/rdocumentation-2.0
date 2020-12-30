import { useState } from 'react';
import { Input } from '@datacamp/waffles-form-elements';
import CardList from './CardList';

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

  // reshape to play nicely with CardList
  const filteredFunctionsClean = filteredFunctions.map((f) => ({
    id: f.id,
    name: f.name,
    description: f.title,
    href: `/packages/${packageName}/versions/${packageVersion}/topics/${f.name}`,
  }));

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
      <CardList items={filteredFunctionsClean} />
    </div>
  );
}
