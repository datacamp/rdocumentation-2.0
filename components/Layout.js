import Link from 'next/link';

export default function Layout({ children }) {
  return (
    <div className="relative min-h-screen">
      <header className="py-4">
        <nav className="px-6 text-lg">
          <Link href="/">
            <a>RDocumentation</a>
          </Link>
        </nav>
      </header>
      <div className="px-6 mt-6">{children}</div>
      <footer className="absolute bottom-0 inset-x-0 flex justify-center pb-4 text-center">
        <div>
          Powered by{' '}
          <a
            className="underline"
            href="https://www.datacamp.com/"
            target="_blank"
            rel="noreferrer"
          >
            DataCamp
          </a>
        </div>
      </footer>
    </div>
  );
}
