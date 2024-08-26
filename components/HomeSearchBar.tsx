import { Button } from '@datacamp/waffles/button';
import { Search } from '@datacamp/waffles/icon';
import { Input } from '@datacamp/waffles/input';
import { tokens } from '@datacamp/waffles/tokens';
import { css } from '@emotion/react';
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

export default function HomeSearchBar({ onChange, value }: Props) {
  // select a random placeholder
  const p = PLACEHOLDERS[Math.floor(Math.random() * PLACEHOLDERS.length)];

  return (
    <div style={css({ display: 'flex', justifyContent: 'space-between' })}>
      <Input
        iconLeft={<Search aria-label="Search all packages and functions" />}
        placeholder={`For example, try '${p.package}' or '${p.function}'`}
      />
      <Button
        css={{ marginTop: tokens.spacing.small }}
        type="submit"
        variant="primary"
      >
        Search
      </Button>
    </div>
  );
}
