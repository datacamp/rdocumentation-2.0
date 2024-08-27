import { MoonInvertedIcon, SunIcon } from '@datacamp/waffles-icons';
import { DataCampLogo } from '@datacamp/waffles/brand';
import { Button } from '@datacamp/waffles/button';
import { Heading } from '@datacamp/waffles/heading';
import { mediaQuery } from '@datacamp/waffles/helpers';
import { DataCampBrand } from '@datacamp/waffles/icon';
import { Input } from '@datacamp/waffles/input';
import { Paragraph } from '@datacamp/waffles/paragraph';
import {
  darkThemeStyle,
  lightThemeStyle,
  theme as themeTokens,
} from '@datacamp/waffles/theme';
import { tokens } from '@datacamp/waffles/tokens';
import styled from '@emotion/styled';
import Link from 'next/link';
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
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'column',
  gap: tokens.spacing.medium,
  justifyContent: 'center',
  margin: '0 auto',
  maxWidth: 1200,
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
  flexGrow: 1,
  gap: tokens.spacing.small,
});

const VerticalDivider = styled.hr(`
  border: 1px inset;
  color: ${themeTokens.border.strong};
  display: block;
  height: 30px;
  margin: 0 ${tokens.spacing.small};
  width: 1px;
`);

const inputStyle = { minWidth: '343px' };

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
        <Link href="/">
          <LogoWrapper>
            <Heading style={{ color: themeTokens.text.main }}>
              RDocumentation
            </Heading>
            <div>
              <VerticalDivider />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Paragraph
                style={{ color: themeTokens.text.secondary }}
                variant="secondary"
              >
                powered by
              </Paragraph>
              <DataCampLogo />
            </div>
          </LogoWrapper>
        </Link>
      </nav>

      <RightContainer>
        {showSearch && (
          <form onSubmit={onSubmitSearch}>
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
            onClick={toggleTheme}
            type="button"
          >
            {theme === 'light' ? <MoonInvertedIcon /> : <SunIcon />}
          </Button>
          <Button
            aria-label="github repository"
            as="a"
            href="https://github.com/datacamp/rdocumentation-2.0"
            rel="noopener noreferrer"
            target="_blank"
          >
            <FaGithub />
          </Button>
          <Button
            as="a"
            href="https://www.datacamp.com/learn/r"
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
