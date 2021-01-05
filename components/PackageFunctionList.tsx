import { Input } from '@datacamp/waffles-form-elements';
import { useState } from 'react';

import ClickableCard from './ClickableCard';

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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{`Functions in ${packageName} (${packageVersion})`}</h2>
        </div>
        <Input
          className="w-72"
          name="functionSearch"
          onChange={setSearchInput}
          placeholder="Search all functions"
          size="small"
          value={searchInput}
        />
      </div>
      <div className="grid grid-cols-3 gap-5 mt-5">
        {filteredFunctions.map((f) => (
          <ClickableCard
            description={f.title}
            href={`/packages/${packageName}/versions/${packageVersion}/topics/${f.name}`}
            id={f.id}
            key={f.id}
            name={f.name}
          />
        ))}
      </div>
    </div>
  );
}
