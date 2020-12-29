import Button from '@datacamp/waffles-button';

export default function Custom404({ isDark }) {
  return (
    <div className="flex flex-col items-center mt-36">
      <h1 className="text-2xl">Oops, that page doesn't exist.</h1>
      <div className="mt-8">
        {/* <Link href="/">
          <a>
            <div className="px-4 py-3 text-xl font-bold border-2 rounded-md border-dc-navy dark:bg-dc-yellow dark:text-dc-navy">
              Go Home
            </div>
          </a>
        </Link> */}
        <Button
          type="link"
          appearance={isDark ? 'primary' : 'default'}
          intent={isDark ? 'b2b' : 'neutral'}
          size="large"
          href="/"
        >
          Go Home
        </Button>
      </div>
    </div>
  );
}
