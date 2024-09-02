import { Input } from '@datacamp/waffles/input';
import { useState } from 'react';

import ClickableCard from './ClickableCard';
import CourseAds from './CourseAds';

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
  const cleanSearchValue = searchInput.trim().toLowerCase();
  const filteredFunctions =
    searchInput !== ''
      ? [...functions].filter(
          (f) =>
            f.name.toLowerCase().indexOf(cleanSearchValue) > -1 ||
            f.title.toLowerCase().indexOf(cleanSearchValue) > -1,
        )
      : functions;

  return (
    <div>
      <CourseAds />
      <div className="block md:flex md:items-center md:justify-between">
        <h2 className="text-2xl font-bold">{`Functions in ${packageName} (${packageVersion})`}</h2>
        <div className="mt-5 dc-input md:mt-0">
          <label className="sr-only" htmlFor="functionSearch">
            Search functions
          </label>
          <Input
            className="w-full md:w-72"
            id="functionSearch"
            name="functionSearch"
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search all functions"
            value={searchInput}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 mt-5 sm:grid-cols-2 md:grid-cols-3 md:gap-5">
        {filteredFunctions.map((fn) => (
          <ClickableCard
            description={fn.title}
            href={`/packages/${packageName}/versions/${packageVersion}/topics/${fn.name}`}
            id={fn.id}
            key={fn.id}
            name={fn.name}
          />
        ))}
      </div>
    </div>
  );
}
