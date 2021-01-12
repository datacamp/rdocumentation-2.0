import { Input } from '@datacamp/waffles-form-elements';
import { MoonInvertedIcon, SunIcon } from '@datacamp/waffles-icons';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

type Props = {
  isDark: boolean;
  setIsDark: (state: boolean) => void;
};

export default function Navbar({ isDark, setIsDark }: Props) {
  const [searchInput, setSearchInput] = useState('');
  const router = useRouter();

  function onSubmitSearch(e) {
    e.preventDefault();
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
              <a>RDocumentation</a>
            </Link>
          </nav>
        </div>

        {/* dark mode toggle */}
        <div className="md:absolute md:right-0 md:top-6">
          <button
            className="focus:outline-none"
            onClick={() => setIsDark(!isDark)}
            type="button"
          >
            {isDark ? <SunIcon /> : <MoonInvertedIcon />}
          </button>
        </div>
      </div>

      {/* show search bar if relevant */}
      {showSearch && (
        <form onSubmit={onSubmitSearch}>
          <div className="dc-input">
            <Input
              className="w-full md:w-80 lg:w-96"
              name="navSearch"
              onChange={setSearchInput}
              placeholder="Search all packages and functions"
              size="small"
              value={searchInput}
            />
          </div>
        </form>
      )}
    </header>
  );
}
