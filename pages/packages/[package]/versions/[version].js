import Head from 'next/head';
import Link from 'next/link';
import { graphql } from '@octokit/graphql';
import { getPackageUrls, getGithubOwnerRepo } from '../../../../lib/utils';
import { getMonthlyDownloads } from '../../../../lib/downloads';
import PackageReadme from '../../../../components/PackageReadme';
import PackageSidebar from '../../../../components/PackageSidebar';

export default function PackageVersionPage({
  metadata,
  versionsArray,
  urls,
  repository,
  monthlyDownloads,
  isDark,
}) {
  // construct link to the current package version
  const linkToCurrentVersion = `http://rdocumentation.org${metadata.uri}`;

  // get the latest version of the package
  const latestVersion = versionsArray[0];

  // get the number of downloads last month
  const downloadsLastMonth = monthlyDownloads
    ? monthlyDownloads[monthlyDownloads.length - 1].downloads
    : null;

  // get the last published date
  const lastPublished = metadata.release_date
    ? new Date(metadata.release_date)
    : null;

  return (
    <>
      <Head>
        <title>{metadata.package_name} package | RDocumentation</title>
      </Head>
      <div className="flex mt-12">
        <div className="w-2/3 pr-8">
          {/* show a warning if looking at an older package version */}
          {metadata.version !== latestVersion && (
            <div className="px-4 py-2 mb-5 text-white border-2 rounded-md border-dc-navy dark:border-dc-yellow bg-dc-navy">
              <span>⚠️</span>
              <span className="ml-3">{`There's a newer version (${latestVersion}) of this package.`}</span>{' '}
              <Link href={metadata.canonicalLink}>
                <a className="text-white underline">Take me there.</a>
              </Link>
            </div>
          )}
          <PackageReadme readme={metadata.readmemd} />
        </div>
        <div className="w-1/3 pl-8 border-l">
          <PackageSidebar
            packageName={metadata.package_name}
            linkToCurrentVersion={linkToCurrentVersion}
            version={metadata.version}
            versionsArray={versionsArray}
            downloadsLastMonth={downloadsLastMonth}
            monthlyDownloads={monthlyDownloads}
            license={metadata.license}
            repository={repository}
            githubUrl={urls.githubUrl}
            homeUrl={urls.homeUrl}
            lastPublished={lastPublished}
            maintainer={metadata.maintainer}
            isDark={isDark}
          />
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps({
  params: { package: packageName, version },
}) {
  // get package metadata from rdocs API
  const metadata = await fetch(
    `https://www.rdocumentation.org/api/packages/${packageName}/versions/${version}`
  ).then((res) => res.json());

  // create an array of all package versions
  const versionsArray = metadata.package.versions.map((v) => v.version);

  // extract the home and github repo urls (if provided)
  const { homeUrl, githubUrl } = getPackageUrls(metadata.url);
  // get the github owner and repo name (if relevant)
  const { githubOwner, githubRepo } = getGithubOwnerRepo(githubUrl);

  // initialize repository
  let repository = null;
  // if there is a repo, get the data from github API
  if (githubOwner && githubRepo) {
    const response = await graphql(
      `
        query repository($owner: String!, $repo: String!) {
          repository(owner: $owner, name: $repo) {
            issues(states: OPEN) {
              totalCount
            }
            pullRequests(states: OPEN) {
              totalCount
            }
            stargazerCount
            forkCount
          }
        }
      `,
      {
        owner: githubOwner,
        repo: githubRepo,
        headers: {
          authorization: `token ${process.env.GITHUB_TOKEN}`,
        },
      }
    );
    // set the repository values
    repository = {
      issues: response.repository.issues.totalCount,
      pullRequests: response.repository.pullRequests.totalCount,
      stars: response.repository.stargazerCount,
      forks: response.repository.forkCount,
    };
  }

  // get monthly download data from the r-hub API
  const monthlyDownloads = await getMonthlyDownloads({ packageName });

  return {
    props: {
      metadata,
      versionsArray,
      urls: {
        homeUrl,
        githubUrl,
      },
      repository,
      monthlyDownloads,
    },
  };
}
