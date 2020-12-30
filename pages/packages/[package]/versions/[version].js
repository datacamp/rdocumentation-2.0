import { graphql } from '@octokit/graphql';
import fetch from 'isomorphic-fetch';
import Head from 'next/head';
import Link from 'next/link';

import PackageFunctionList from '../../../../components/PackageFunctionList';
import PackageReadme from '../../../../components/PackageReadme';
import PackageSidebar from '../../../../components/PackageSidebar';
import { getMonthlyDownloads } from '../../../../lib/downloads';
import { getGithubOwnerRepo, getPackageUrls } from '../../../../lib/utils';

export default function PackageVersionPage({
  isDark,
  metadata,
  monthlyDownloads,
  repository,
  urls,
  versionsArray,
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
      <div className="mt-12">
        <div className="flex">
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
              downloadsLastMonth={downloadsLastMonth}
              githubUrl={urls.githubUrl}
              homeUrl={urls.homeUrl}
              isDark={isDark}
              lastPublished={lastPublished}
              license={metadata.license}
              linkToCurrentVersion={linkToCurrentVersion}
              maintainer={metadata.maintainer}
              monthlyDownloads={monthlyDownloads}
              packageName={metadata.package_name}
              repository={repository}
              version={metadata.version}
              versionsArray={versionsArray}
            />
          </div>
        </div>
        <div className="w-full mt-12 max-w-none">
          <PackageFunctionList
            functions={metadata.topics}
            packageName={metadata.package_name}
            packageVersion={metadata.version}
          />
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps({
  params: { package: packageName, version },
}) {
  try {
    // get package metadata from rdocs API
    const res = await fetch(
      `https://www.rdocumentation.org/api/packages/${packageName}/versions/${version}`,
    );
    const metadata = await res.json();

    // create an array of all package versions
    const versionsArray = metadata.package.versions.map((v) => v.version);

    // extract the home and github repo urls (if provided)
    const { githubUrl, homeUrl } = getPackageUrls(metadata.url);
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
          headers: {
            authorization: `token ${process.env.GITHUB_TOKEN}`,
          },
          owner: githubOwner,
          repo: githubRepo,
        },
      );
      // set the repository values
      repository = {
        forks: response.repository.forkCount,
        issues: response.repository.issues.totalCount,
        pullRequests: response.repository.pullRequests.totalCount,
        stars: response.repository.stargazerCount,
      };
    }

    // get monthly download data from the r-hub API
    const monthlyDownloads = await getMonthlyDownloads({ packageName });

    return {
      props: {
        metadata,
        monthlyDownloads,
        repository,
        urls: {
          githubUrl,
          homeUrl,
        },
        versionsArray,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}
