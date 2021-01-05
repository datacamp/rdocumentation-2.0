import { MoonInvertedIcon, SunIcon } from '@datacamp/waffles-icons';
import Link from 'next/link';

type Props = {
  isDark: boolean;
  setIsDark: (state: boolean) => void;
};

export default function Navbar({ isDark, setIsDark }: Props) {
  return (
    <header className="flex items-center justify-between h-20">
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