import Head from 'next/head';
import { graphql } from '@octokit/graphql';
import ReactMarkdownWithHtml from 'react-markdown/with-html';
import gfm from 'remark-gfm';
import { FaHome, FaGithub } from 'react-icons/fa';
import { format } from 'date-fns';
import MonthlyDownloadsChart from '../../../../components/MonthlyDownloadsChart';
import { getPackageUrls, getGithubOwnerRepo } from '../../../../lib/utils';

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
  urls,
  repository,
  isDark,
}) {
  // get relevant data from package metadata
  const {
    package_name: packageName,
    version,
    license,
    release_date: releaseDate,
    readmemd: readme,
  } = metadata;
  const { homeUrl, githubUrl } = urls;

  // get the last published date
  const lastPublished = releaseDate ? new Date(releaseDate) : null;

  return (
    <>
      <Head>
        <title>{packageName} package | RDocumentation</title>
      </Head>
      <div className="flex mt-12">
        <article className="w-2/3 pr-8 prose max-w-none">
          {readme ? (
            <ReactMarkdownWithHtml
              plugins={[gfm]}
              renderers={{
                // eslint-disable-next-line react/display-name
                link: ({ href, children }) => (
                  <a href={href} target="_blank" rel="noopener noreferrer">
                    {children}
                  </a>
                ),
              }}
              allowDangerousHtml // TODO: is this safe?
            >
              {readme}
            </ReactMarkdownWithHtml>
          ) : (
            <div className="flex items-center justify-center h-full">
              {/* TODO: Need a CTA here */}
              Readme not available :(
            </div>
          )}
        </article>
        <div className="w-1/3 pl-8 space-y-6 border-l">
          <div>
            <SidebarHeader>Install</SidebarHeader>
            <div className="prose">
              <pre>
                <code>{`install.packages('${packageName}')`}</code>
              </pre>
            </div>
          </div>
          <div>
            <SidebarHeader>Monthly Downloads</SidebarHeader>
            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-light">
                {(122222).toLocaleString()}
              </div>
              <div className="w-3/5">
                <MonthlyDownloadsChart isDark={isDark} />
              </div>
            </div>
          </div>
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
  const metadata = await fetch(
    `https://www.rdocumentation.org/api/packages/${packageName}/versions/${version}`
  ).then((res) => res.json());

  // extract the github repo url
  const { homeUrl, githubUrl } = getPackageUrls(metadata.url);
  // get the github owner and repo name (if relevant)
  const { githubOwner, githubRepo } = getGithubOwnerRepo(githubUrl);

  // initialize repository
  let repository = null;
  // if there is a repo, get the data
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

  return {
    props: {
      metadata,
      urls: {
        homeUrl,
        githubUrl,
      },
      repository,
    },
  };
}
