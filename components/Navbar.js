import { MoonInvertedIcon, SunIcon } from '@datacamp/waffles-icons';
import Link from 'next/link';

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
        onClick={() => setIsDark(!isDark)}
        type="button"
      >
        {isDark ? <SunIcon /> : <MoonInvertedIcon />}
      </button>
    </header>
  );
}
