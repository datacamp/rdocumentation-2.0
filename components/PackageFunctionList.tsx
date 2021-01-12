import { Input } from '@datacamp/waffles-form-elements';
import { useState } from 'react';

import ClickableCard from './ClickableCard';
import GridListContainer from './GridListContainer';

type Props = {
  functions: Array<{
    api_uri: string;
    id: number;
    name: string;
    package_version_id: number;
    title: string;
    uri: string;
  }>;
  packageName: string;
  packageVersion: string;
};

export default function PackageFunctionList({
  functions,
  packageName,
  packageVersion,
}: Props) {
  const [searchInput, setSearchInput] = useState('');

  let filteredFunctions = functions;
  const cleanSearchValue = searchInput.trim().toLowerCase();

  if (searchInput !== '') {
    filteredFunctions = filteredFunctions.filter(
      (f) =>
        f.name.toLowerCase().indexOf(cleanSearchValue) > -1 ||
        f.title.toLowerCase().indexOf(cleanSearchValue) > -1,
    );
  }

  return (
    <div>
      <div className="block md:flex md:items-center md:justify-between">
        <h2 className="text-2xl font-bold">{`Functions in ${packageName} (${packageVersion})`}</h2>
        <div className="mt-3 dc-input md:mt-0">
          <Input
            className="w-full md:w-72"
            name="functionSearch"
            onChange={setSearchInput}
            placeholder="Search all functions"
            size="small"
            value={searchInput}
          />
        </div>
      </div>
      <GridListContainer>
        {filteredFunctions.map((f) => (
          <ClickableCard
            description={f.title}
            href={`/packages/${packageName}/versions/${packageVersion}/topics/${f.name}`}
            id={f.id}
            key={f.id}
            name={f.name}
          />
        ))}
      </GridListContainer>
    </div>
  );
}
