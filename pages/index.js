export default function Home({ downloadsLast30, trendingLast7 }) {
  return (
    <div className="flex">
      <div className="w-1/2">
        <h2 className="text-xl font-bold">Most Downloaded (Last 30 Days)</h2>
        <pre className="text-xs">
          {JSON.stringify(downloadsLast30, null, 2)}
        </pre>
      </div>
      <div className="w-1/2">
        <h2 className="text-xl font-bold">Trending (Last 7 Days)</h2>
        <pre className="text-xs">{JSON.stringify(trendingLast7, null, 2)}</pre>
      </div>
    </div>
  );
}

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export async function getStaticProps() {
  const downloadsLast30 = await fetcher(
    'https://cranlogs.r-pkg.org/top/last-month/10'
  );
  const trendingLast7 = await fetcher('https://cranlogs.r-pkg.org/trending');
  return {
    props: {
      downloadsLast30: downloadsLast30.downloads,
      trendingLast7: trendingLast7.slice(0, 10),
    },
  };
}
