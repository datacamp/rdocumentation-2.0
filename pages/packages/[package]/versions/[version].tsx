import { graphql } from '@octokit/graphql';
import { GetServerSideProps } from 'next';
import Link from 'next/link';

import Layout from '../../../../components/Layout';
import PackageFunctionList from '../../../../components/PackageFunctionList';
import PackageReadme from '../../../../components/PackageReadme';
import PackageReadMePlaceholder from '../../../../components/PackageReadMePlaceholder';
import PackageSidebar from '../../../../components/PackageSidebar';
import { getMonthlyDownloads } from '../../../../lib/downloads';
import {
  API_URL,
  getGithubOwnerRepo,
  getPackageUrls,
} from '../../../../lib/utils';

type Props = {
  metadata: {
    api_uri: string;
    canonicalLink: string;
    collaborators: [];
    copyright: string;
    created_at: string;
    dependencies: [];
    description: string;
    fromCache: boolean;
    hasSource: boolean;
    id: number;
    license: string;
    maintainer: {
      api_uri: string;
      created_at: string;
      email: string;
      gravatar_url: string;
      id: number;
      name: string;
      updated_at: string;
      uri: string;
    };
    maintainer_id: number;
    package: Record<string, unknown>;
    package_name: string;
    pageTitle: string;
    readmemd: string;
    release_date: string;
    sourceJSON: Record<string, unknown>;
    title: string;
    topics: Array<{
      api_uri: string;
      id: number;
      name: string;
      package_version_id: number;
      title: string;
      uri: string;
    }>;
    type: string;
    updated_at: string;
    uri: string;
    url: string;
    version: string;
    vignettes: [];
  };
  monthlyDownloads: Array<{ downloads: number; month: string }>;
  repository: {
    forks: number;
    issues: number;
    pullRequests: number;
    stars: number;
  };
  urls: { githubUrl: string; homeUrl: string };
  versionsArray: string[];
};

export default function PackageVersionPage({
  metadata,
  monthlyDownloads,
  repository,
  urls,
  versionsArray,
}: Props) {
  // construct link to the current package version
  const linkToCurrentVersion = `https://rdocumentation.org${metadata.uri}`;

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
    <Layout
      canonicalLink={metadata.canonicalLink}
      description={metadata.description}
      title={metadata.pageTitle}
    >
      <div className="mt-8 md:mt-12">
        <div className="block lg:flex">
          <div className="w-full pb-8 lg:pb-0 lg:w-2/3 lg:pr-8">
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
            {metadata.readmemd ? (
              <PackageReadme readme={metadata.readmemd} />
            ) : (
              <PackageReadMePlaceholder
                description={metadata.description}
                packageName={metadata.package_name}
                title={metadata.title}
                version={metadata.version}
              />
            )}
          </div>
          <div className="w-full pt-8 border-t lg:border-t-0 lg:w-1/3 lg:pt-0 lg:pl-8 lg:border-l">
            <PackageSidebar
              downloadsLastMonth={downloadsLastMonth}
              githubUrl={urls.githubUrl}
              homeUrl={urls.homeUrl}
              lastPublished={lastPublished}
              license={metadata.license}
              linkToCurrentVersion={linkToCurrentVersion}
              maintainer={metadata.maintainer}
              monthlyDownloads={monthlyDownloads}
              packageName={metadata.package_name}
              repository={repository}
              showInstallCode={metadata.package.type_id === 1}
              version={metadata.version}
              versionsArray={versionsArray}
            />
          </div>
        </div>
        <div className="w-full pt-8 mt-12 border-t lg:pt-0 lg:border-t-0 max-w-none">
          {metadata.topics?.length > 0 && (
            <PackageFunctionList
              functions={metadata.topics}
              packageName={metadata.package_name}
              packageVersion={metadata.version}
            />
          )}
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  params: { package: packageName, version },
}) => {
  try {
    // get package metadata from rdocs API
    const res = await fetch(
      `${API_URL}/api/packages/${packageName}/versions/${version}`,
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
      const response: {
        repository: {
          forkCount: number;
          issues: { totalCount: number };
          pullRequests: { totalCount: number };
          stargazerCount: number;
        };
      } = await graphql(
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
    const monthlyDownloads = await getMonthlyDownloads(packageName as string);

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
};
