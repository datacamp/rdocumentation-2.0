import Link from 'next/link';
import { SunIcon, MoonInvertedIcon } from '@datacamp/waffles-icons';

export default function Navbar({ isDark, setIsDark }) {
  return (
    <header className="flex justify-between items-center h-20">
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
