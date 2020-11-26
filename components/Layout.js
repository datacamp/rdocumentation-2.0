import Link from 'next/link';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen">
      <header className="py-4 border-b">
        <nav className="px-6 text-lg">
          <Link href="/">
            <a>RDocumentation</a>
          </Link>
        </nav>
      </header>
      <div className="px-6 mt-6">{children}</div>
    </div>
  );
}
