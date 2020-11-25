export default function Home({
  topDownloadsLast30,
  topTrendingLast7,
  allDownloadsLast30,
  allRDownloadsLast30,
  latestRVersion,
}) {
  // console.log({
  //   topDownloadsLast30,
  //   topTrendingLast7,
  //   allDownloadsLast30,
  //   allRDownloadsLast30,
  //   latestRVersion,
  // });
  return (
    <>
      <div className="flex justify-around">
        <div>
          <h2>Most Downloaded (Last 30 Days)</h2>
          <pre className="text-xs">
            {JSON.stringify(topDownloadsLast30, null, 2)}
          </pre>
        </div>
        <div>
          <h2>Trending (Last 7 Days)</h2>
          <pre className="text-xs">
            {JSON.stringify(topTrendingLast7, null, 2)}
          </pre>
        </div>
      </div>
      <div className="flex justify-around mt-10">
        <div>
          <h2>Total Package Downloads (Last 30 Days)</h2>
          <pre className="text-xs">
            {JSON.stringify(allDownloadsLast30, null, 2)}
          </pre>
        </div>
        <div>
          <h2>Total R Downloads (Last 30 Days)</h2>
          <pre className="text-xs">
            {JSON.stringify(allRDownloadsLast30, null, 2)}
          </pre>
        </div>
        <div>
          <h2>Latest R Version</h2>
          <pre className="text-xs">
            {JSON.stringify(latestRVersion, null, 2)}
          </pre>
        </div>
      </div>
    </>
  );
}

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export async function getStaticProps() {
  const topDownloadsLast30 = await fetcher(
    'https://cranlogs.r-pkg.org/top/last-month/10'
  );
  const topTrendingLast7 = await fetcher('https://cranlogs.r-pkg.org/trending');
  const allDownloadsLast30 = await fetcher(
    'https://cranlogs.r-pkg.org/downloads/total/last-month'
  );
  const allRDownloadsLast30 = await fetcher(
    'https://cranlogs.r-pkg.org/downloads/total/last-month/R'
  );
  const allRVersions = await fetcher('https://rversions.r-pkg.org/r-versions');

  return {
    props: {
      topDownloadsLast30: topDownloadsLast30.downloads,
      topTrendingLast7: topTrendingLast7.slice(0, 10),
      allDownloadsLast30: allDownloadsLast30[0].downloads,
      allRDownloadsLast30: allRDownloadsLast30[0].downloads,
      latestRVersion: allRVersions.slice(-1)[0],
    },
  };
}
