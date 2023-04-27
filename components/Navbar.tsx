import { Input } from '@datacamp/waffles-form-elements';
import { MoonInvertedIcon, SunIcon } from '@datacamp/waffles-icons';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import { FaGithub } from 'react-icons/fa';

import { ThemeContext } from '../pages/_app';

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
    <header className="relative block md:items-center md:justify-center md:flex md:pt-5">
      <div className="flex items-center justify-between mt-5 mb-3">
        {/* logo */}
        <div className="md:absolute md:left-0 md:top-6">
          <nav className="text-lg">
            <Link href="/">
              <a className="p-1 -ml-1">RDocumentation</a>
            </Link>
          </nav>
        </div>

        <div className="flex items-center space-x-3 md:absolute md:right-0 md:top-6">
          {/* dark mode toggle */}
          <button
            aria-label="toggle dark mode"
            className="p-1"
            onClick={toggleTheme}
            type="button"
          >
            {theme === 'light' ? <MoonInvertedIcon /> : <SunIcon />}
          </button>
          {/* github link */}
          <a
            aria-label="github repository"
            className="inline-block p-1 text-xl"
            href="https://github.com/datacamp/rdocumentation-2.0"
            rel="noopener noreferrer"
            target="_blank"
          >
            <FaGithub />
          </a>
          <a
            className="px-4 py-2 border-2 rounded-md hover:border-dc-navy dark:hover:border-dc-yellow focus:border-dc-navy dark:focus:border-dc-yellow focus:outline-none"
            href="https://www.datacamp.com/learn/r"
          >
            Learn R
          </a>
        </div>
      </div>

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
    </header>
  );
}
