import { mediaQuery } from '@datacamp/waffles/helpers';
import { Input } from '@datacamp/waffles/input';
import styled from '@emotion/styled';
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

const FlexContainer = styled.div({
  [mediaQuery.aboveMedium]: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
  },
  display: 'block',
});

const Heading = styled.h2({
  fontSize: '1.5rem',
  fontWeight: 'bold',
});

const InputWrapper = styled.div({
  [mediaQuery.aboveMedium]: {
    marginTop: 0,
    width: 'max-content',
  },
  marginTop: '1.25rem',
  width: '100%',
});

const GridContainer = styled.div({
  [mediaQuery.aboveSmall]: {
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  },
  [mediaQuery.aboveMedium]: {
    gap: '1.25rem',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  },
  display: 'grid',
  gap: '1rem',
  gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
  marginTop: '1.25rem',
});

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
      <FlexContainer>
        <Heading>{`Functions in ${packageName} (${packageVersion})`}</Heading>
        <InputWrapper>
          <label className="sr-only" htmlFor="functionSearch">
            Search functions
          </label>
          <Input
            id="functionSearch"
            name="functionSearch"
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search all functions"
            value={searchInput}
          />
        </InputWrapper>
      </FlexContainer>
      <GridContainer>
        {filteredFunctions.map((fn) => (
          <ClickableCard
            description={fn.title}
            href={`/packages/${packageName}/versions/${packageVersion}/topics/${fn.name}`}
            id={fn.id}
            key={fn.id}
            name={fn.name}
          />
        ))}
      </GridContainer>
    </div>
  );
}
