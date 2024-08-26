import { Input } from '@datacamp/waffles-form-elements';
import { MoonInvertedIcon, SunIcon } from '@datacamp/waffles-icons';
import { DataCampLogo } from '@datacamp/waffles/brand';
import { Button } from '@datacamp/waffles/button';
import { Heading } from '@datacamp/waffles/heading';
import { mediaQuery } from '@datacamp/waffles/helpers';
import { Paragraph } from '@datacamp/waffles/paragraph';
import { darkThemeStyle, lightThemeStyle } from '@datacamp/waffles/theme';
import { tokens } from '@datacamp/waffles/tokens';
import styled from '@emotion/styled';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import { FaGithub } from 'react-icons/fa';

import { ThemeContext } from '../pages/_app';

const Header = styled.header({
  '&, &[data-theme="light"]': {
    ...lightThemeStyle,
  },
  '&[data-theme="dark"]': {
    ...darkThemeStyle,
  },
  '[data-theme="dark"]': {
    border: `1px solid ${tokens.colors.greyLight}`,
  },
  '[data-theme="light"]': {
    border: `1px solid ${tokens.colors.navy}`,
  },
  display: 'block',
  position: 'relative',
  [mediaQuery.aboveMedium]: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    paddingTop: tokens.spacing.small,
  },
});

const LogoWrapper = styled.div(`
  display: flex;
  align-items: center;
`);

const VerticalDivider = styled.hr(`
  border: 1px inset;
  color: ${tokens.colors.white};
  display: block;
  height: 30px;
  margin: 0 ${tokens.spacing.small};
  width: 1px;
`);

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
    <Header data-theme={theme ? 'dark' : 'light'}>
      <div className="flex items-center justify-between mt-5 mb-3">
        {/* logo */}
        <div className="md:absolute md:left-0 md:top-6">
          <nav className="text-lg">
            <Link href="/">
              <LogoWrapper>
                <Heading>RDocumentation</Heading>
                <div>
                  {' '}
                  <VerticalDivider />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <Paragraph variant="secondary">powered by</Paragraph>
                  <DataCampLogo />
                </div>
              </LogoWrapper>
            </Link>
          </nav>
        </div>

        <div className="flex items-center space-x-3 md:absolute md:right-0 md:top-6">
          {/* dark mode toggle */}
          <Button
            aria-label="toggle dark mode"
            className="p-1"
            onClick={toggleTheme}
            type="button"
          >
            {theme === 'light' ? <MoonInvertedIcon /> : <SunIcon />}
          </Button>
          {/* github link */}
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
            variant="primary"
          >
            Learn R Programming
          </Button>
        </div>
      </div>

      {/* TODO: check what this exactly is */}
      {/* show search bar if relevant */}
      {showSearch && (
        <form onSubmit={onSubmitSearch}>
          <div className="dc-input">
            <label className="sr-only" htmlFor="searchBarNav">
              Search all packages and functions
            </label>
            <Input
              className="w-full md:w-80 lg:w-96"
              id="searchBarNav"
              name="searchBarNav"
              onChange={setSearchInput}
              placeholder="Search all packages and functions"
              size="small"
              type="search"
              value={searchInput}
            />
          </div>
        </form>
      )}
    </Header>
  );
}
