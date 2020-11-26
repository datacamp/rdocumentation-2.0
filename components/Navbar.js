import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SunIcon, MoonInvertedIcon } from '@datacamp/waffles-icons';

export default function Navbar() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('dark', isDark);
  }, [isDark]);

  return (
    <header className="px-6 py-4 flex items-baseline justify-between">
      <nav className="text-lg">
        <Link href="/">
          <a>RDocumentation</a>
        </Link>
      </nav>
      <button
        className="focus:outline-none"
        type="button"
        onClick={() => setIsDark(!isDark)}
      >
        {isDark ? <SunIcon /> : <MoonInvertedIcon />}
      </button>
    </header>
  );
}
