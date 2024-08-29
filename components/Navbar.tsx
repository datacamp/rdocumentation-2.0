/** @jsxImportSource @emotion/react */
import { DataCampLogo } from '@datacamp/waffles/brand';
import { Button } from '@datacamp/waffles/button';
import { Heading } from '@datacamp/waffles/heading';
import { mediaQuery } from '@datacamp/waffles/helpers';
import { DataCampBrand, MoonSolid, SunSolid } from '@datacamp/waffles/icon';
import { Input } from '@datacamp/waffles/input';
import { Paragraph } from '@datacamp/waffles/paragraph';
import {
  darkThemeStyle,
  lightThemeStyle,
  theme as themeTokens,
} from '@datacamp/waffles/theme';
import { tokens } from '@datacamp/waffles/tokens';
import styled from '@emotion/styled';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import { FaGithub } from 'react-icons/fa';

import { ThemeContext } from '../pages/_app';

const Header = styled.header({
  '&[data-theme="dark"]': {
    ...darkThemeStyle,
  },
  '&[data-theme="light"]': {
    ...lightThemeStyle,
  },
  display: 'flex',
  flexDirection: 'column',
  gap: tokens.spacing.medium,
  margin: '0 auto',
  maxWidth: 1600, // make sure the header doesn't get too wide, but still get's wider than the content
  padding: `${tokens.spacing.large} ${tokens.spacing.medium}`,
  [mediaQuery.aboveMedium]: {
    alignItems: 'center',
    flexDirection: 'unset',
    gap: 0,
    justifyContent: 'space-between',
    padding: `${tokens.spacing.medium} 70px`,
  },
});

const LogoWrapper = styled.div(`
  display: flex;
  align-items: center;
  &:hover {
    cursor: pointer;
  }
`);

const RightContainer = styled.div({
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'column-reverse',
  gap: tokens.spacing.medium,
  [mediaQuery.aboveMedium]: {
    flexDirection: 'unset',
    justifyContent: 'space-between',
  },
});

const ButtonContainer = styled.div({
  display: 'flex',
  flex: '1 1 100%',
  flexGrow: 1,
  gap: tokens.spacing.small,
  width: '100%',
});

const VerticalDivider = styled.hr(`
  border: 1px inset;
  color: ${themeTokens.border.strong};
  display: block;
  height: 30px;
  margin: 0 ${tokens.spacing.small};
  width: 1px;
`);

const inputStyle = { flexGrow: 1, minWidth: '343px' };
const buttonStyle = {
  height: '36px',
};

export default function Navbar() {
  const [searchInput, setSearchInput] = useState('');
  const router = useRouter();
  const { theme, toggleTheme } = useContext(ThemeContext);

  function onSubmitSearch(e) {
    e.preventDefault();
    if (!searchInput) return;
    router.push(`/search?q=${encodeURIComponent(searchInput)}`);
    setSearchInput('');
  }

  const showSearch = router.pathname !== '/';

  return (
    <Header data-theme={theme}>
      <nav>
        <LogoWrapper>
          <a href="/">
            <Heading css={{ color: themeTokens.text.main, margin: 0 }}>
              Rdocumentation
            </Heading>
          </a>

          <div>
            <VerticalDivider />
          </div>
          <a
            css={{ display: 'flex', flexDirection: 'column' }}
            href="https://www.datacamp.com"
          >
            <Paragraph
              size="small"
              style={{
                color: themeTokens.text.secondary,
                marginBottom: 0,
              }}
              variant="secondary"
            >
              powered by
            </Paragraph>
            <DataCampLogo css={{ flexShrink: 0, height: 18, width: 86 }} />
          </a>
        </LogoWrapper>
      </nav>

      <RightContainer>
        {showSearch && (
          <form onSubmit={onSubmitSearch} style={{ width: '100%' }}>
            <Input
              id="searchBarNav"
              name="searchBarNav"
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search all packages and functions"
              size="medium"
              style={inputStyle}
              type="search"
              value={searchInput}
            />
          </form>
        )}
        <ButtonContainer>
          <Button
            aria-label="toggle dark mode"
            className="p-1"
            css={{ ...buttonStyle, padding: '12px' }}
            onClick={toggleTheme}
            type="button"
          >
            {theme === 'light' ? <MoonSolid /> : <SunSolid />}
          </Button>
          <Button
            aria-label="github repository"
            as="a"
            css={{ ...buttonStyle, padding: '12px' }}
            href="https://github.com/datacamp/rdocumentation-2.0"
            rel="noopener noreferrer"
            target="_blank"
          >
            <FaGithub />
          </Button>
          <Button
            as="a"
            css={{
              ...buttonStyle,
              flexGrow: 1,
              padding: `${tokens.spacing.small} ${tokens.spacing.medium}`,
            }}
            href="https://www.datacamp.com/category/r"
            iconLeft={<DataCampBrand />}
            variant="primary"
          >
            Learn R Programming
          </Button>
        </ButtonContainer>
      </RightContainer>
    </Header>
  );
}
