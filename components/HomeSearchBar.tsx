/** @jsxImportSource @emotion/react */
import { Button } from '@datacamp/waffles/button';
import { mediaQuery } from '@datacamp/waffles/helpers';
import { Search } from '@datacamp/waffles/icon';
import { Input } from '@datacamp/waffles/input';
import { lightThemeStyle } from '@datacamp/waffles/theme';
import { tokens } from '@datacamp/waffles/tokens';
import styled from '@emotion/styled';
import { ChangeEvent } from 'react';

type Props = {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  value: string;
};

const Wrapper = styled.div(`
  display: flex;
  justify-content: space-between;
  margin-top: ${tokens.spacing.small};
  gap: ${tokens.spacing.small};
`);

export default function HomeSearchBar({ onChange, value }: Props) {
  return (
    <Wrapper
      css={{
        '&, &[data-theme="light"] *': {
          ...lightThemeStyle,
        },
      }}
      data-theme={'light'}
    >
      <Input
        iconLeft={<Search aria-label="Search all packages and functions" />}
        onChange={onChange}
        placeholder="For example, try 'ggplot2' or 'lm(stats)'"
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
