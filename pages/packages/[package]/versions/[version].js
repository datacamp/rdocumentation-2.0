import Head from 'next/head';
import { useRouter } from 'next/router';
import { graphql } from '@octokit/graphql';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import { CopyIcon } from '@datacamp/waffles-icons';
import { Select, SelectOption } from '@datacamp/waffles-form-elements';
import { FaHome, FaGithub } from 'react-icons/fa';
import { format } from 'date-fns';
import MonthlyDownloadsChart from '../../../../components/MonthlyDownloadsChart';
import {
  getPackageUrls,
  getGithubOwnerRepo,
  copyTextToClipboard,
} from '../../../../lib/utils';
import { getMonthlyDownloads } from '../../../../lib/downloads';

function SidebarHeader({ children }) {
  return <h4 className="mb-2 text-sm text-gray-500 uppercase">{children}</h4>;
}

function SidebarValue({ Icon, children }) {
  return (
    <div>
      {Icon && <Icon className="inline mb-1" />}
      <span className={Icon ? 'ml-2' : ''}>{children}</span>
    </div>
  );
}

export default function PackageVersionPage({
  metadata,
  versionsArray,
  urls,
  repository,
  monthlyDownloads,
  isDark,
}) {
  const router = useRouter();

  // get relevant data from package metadata
  const {
    package_name: packageName,
    version,
    license,
    release_date: releaseDate,
    readmemd: readme,
  } = metadata;
  const { homeUrl, githubUrl } = urls;

  // construct a canonical link to the current package
  const canonicalLink = `http://rdocumentation.org${metadata.canonicalLink}`;

  // get the number of downloads last month
  const downloadsLastMonth = monthlyDownloads
    ? monthlyDownloads[monthlyDownloads.length - 1].downloads
    : null;

  // get the last published date
  const lastPublished = releaseDate ? new Date(releaseDate) : null;

  function handleChangeVersion(selectedVersion) {
    router.push({
      pathname: '/packages/[package]/versions/[version]',
      query: { package: packageName, version: selectedVersion },
    });
  }

  function handleCopyLink() {
    copyTextToClipboard(canonicalLink);
  }

  return (
    <>
      <Head>
        <title>{packageName} package | RDocumentation</title>
      </Head>
      <div className="flex mt-12">
        <article className="w-2/3 pr-8 prose max-w-none">
          {readme ? (
            <ReactMarkdown
              plugins={[gfm]}
              renderers={{
                // eslint-disable-next-line react/display-name
                link: ({ href, children }) => (
                  <a href={href} target="_blank" rel="noopener noreferrer">
                    {children}
                  </a>
                ),
              }}
              skipHtml
            >
              {readme}
            </ReactMarkdown>
          ) : (
            <div className="pt-20 text-center">
              {/* TODO: Need a CTA here */}
              Readme not available 😞
            </div>
          )}
        </article>
        <div className="w-1/3 pl-8 space-y-6 border-l">
          <div>
            <SidebarHeader>Copy Link</SidebarHeader>
            <div className="relative mt-4 dark:text-dc-navy">
              <button
                className="absolute inset-y-0 left-0 flex items-center p-4"
                type="button"
                onClick={handleCopyLink}
              >
                <CopyIcon size={16} />
              </button>
              <input
                className="block w-full pl-10 text-gray-500 border-2 rounded-md border-dc-grey300"
                type="text"
                value={canonicalLink}
                disabled
              />
            </div>
          </div>
          <div>
            <SidebarHeader>Version</SidebarHeader>
            <Select
              name="version"
              value={version}
              onChange={handleChangeVersion}
            >
              {versionsArray.map((v) => (
                <SelectOption key={v} value={v}>
                  {v}
                </SelectOption>
              ))}
            </Select>
          </div>
          <div>
            <SidebarHeader>Install</SidebarHeader>
            <div className="prose">
              <pre>
                <code>{`install.packages('${packageName}')`}</code>
              </pre>
            </div>
          </div>
          {monthlyDownloads && (
            <div>
              <SidebarHeader>Monthly Downloads</SidebarHeader>
              <div className="flex items-baseline justify-between">
                <div className="text-3xl font-light">
                  {downloadsLastMonth.toLocaleString()}
                </div>
                <div className="w-3/5">
                  <MonthlyDownloadsChart
                    monthlyDownloads={monthlyDownloads}
                    isDark={isDark}
                  />
                </div>
              </div>
            </div>
          )}
          <div className="flex">
            <div className="w-1/2">
              <SidebarHeader>Version</SidebarHeader>
              <SidebarValue>{version}</SidebarValue>
            </div>
            <div className="w-1/2">
              <SidebarHeader>License</SidebarHeader>
              {/* TODO: strip down the license text? */}
              <SidebarValue>{license}</SidebarValue>
            </div>
          </div>
          {repository && (
            <>
              <div className="flex">
                <div className="w-1/2">
                  <SidebarHeader>Issues</SidebarHeader>
                  <SidebarValue>
                    {repository.issues.toLocaleString()}
                  </SidebarValue>
                </div>
                <div className="w-1/2">
                  <SidebarHeader>Pull Requests</SidebarHeader>
                  <SidebarValue>
                    {repository.pullRequests.toLocaleString()}
                  </SidebarValue>
                </div>
              </div>
              <div className="flex">
                <div className="w-1/2">
                  <SidebarHeader>Stars</SidebarHeader>
                  <SidebarValue>
                    {repository.stars.toLocaleString()}
                  </SidebarValue>
                </div>
                <div className="w-1/2">
                  <SidebarHeader>Forks</SidebarHeader>
                  <SidebarValue>
                    {repository.forks.toLocaleString()}
                  </SidebarValue>
                </div>
              </div>
              <div>
                <SidebarHeader>Repository</SidebarHeader>
                <SidebarValue Icon={FaGithub}>
                  <a href={githubUrl} target="_blank" rel="noopener noreferrer">
                    {githubUrl}
                  </a>
                </SidebarValue>
              </div>
            </>
          )}
          {homeUrl && (
            <div>
              <SidebarHeader>Homepage</SidebarHeader>
              <SidebarValue Icon={FaHome}>
                <a href={homeUrl} target="_blank" rel="noopener noreferrer">
                  {homeUrl}
                </a>
              </SidebarValue>
            </div>
          )}
          {lastPublished && (
            <div>
              <SidebarHeader>Last Published</SidebarHeader>
              <SidebarValue>{format(lastPublished, 'PPP')}</SidebarValue>
            </div>
          )}
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
