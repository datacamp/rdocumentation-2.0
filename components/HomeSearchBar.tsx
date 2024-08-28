/** @jsxImportSource @emotion/react */
import { Button } from '@datacamp/waffles/button';
import { mediaQuery } from '@datacamp/waffles/helpers';
import { Search } from '@datacamp/waffles/icon';
import { Input } from '@datacamp/waffles/input';
import { tokens } from '@datacamp/waffles/tokens';
import styled from '@emotion/styled';
import { ChangeEvent } from 'react';

type Props = {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  value: string;
};

const PLACEHOLDERS = [
  { function: 'group_by', package: 'dplyr' },
  { function: 'fread', package: 'data.table' },
  { function: 'summary.glm', package: 'stats' },
  { function: 'geom_point', package: 'ggplot2' },
];

const Wrapper = styled.div(`
  display: flex;
  justify-content: space-between;
  margin-top: ${tokens.spacing.small};
  gap: ${tokens.spacing.small};
`);

export default function HomeSearchBar({ onChange, value }: Props) {
  // select a random placeholder
  const p = PLACEHOLDERS[Math.floor(Math.random() * PLACEHOLDERS.length)];

  return (
    <Wrapper>
      <Input
        iconLeft={<Search aria-label="Search all packages and functions" />}
        onChange={onChange}
        placeholder={`For example, try '${p.package}' or '${p.function}'`}
        size="large"
        value={value}
      />
      <Button
        css={{
          display: 'none',
          [mediaQuery.aboveMedium]: {
            display: 'block',
          },
        }}
        size="large"
        type="submit"
        variant="primary"
      >
        Search
      </Button>
    </Wrapper>
  );
}
