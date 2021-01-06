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
    <header className="relative flex items-center justify-center h-20">
      {/* logo */}
      <div className="absolute left-0">
        <nav className="text-lg">
          <Link href="/">
            <a>RDocumentation</a>
          </Link>
        </nav>
      </div>
      {/* show search bar if relevant */}
      {showSearch && (
        <div>
          <form onSubmit={onSubmitSearch}>
            <Input
              className="w-96"
              name="navSearch"
              onChange={setSearchInput}
              placeholder="Search all packages and functions"
              size="small"
              value={searchInput}
            />
          </form>
        </div>
      )}
      {/* dark mode toggle */}
      <div className="absolute right-0">
        <button
          className="focus:outline-none"
          onClick={() => setIsDark(!isDark)}
          type="button"
        >
          {isDark ? <SunIcon /> : <MoonInvertedIcon />}
        </button>
      </div>
    </header>
  );
}
