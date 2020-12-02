import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
// import { FaHome, FaGithub } from 'react-icons/fa';
import { format } from 'date-fns';
import { getGithubReadme } from '../../lib/github-api';
import MonthlyDownloadsChart from '../../components/MonthlyDownloadsChart';

function SidebarHeader({ children }) {
  return <h4 className="mb-2 text-sm text-gray-500 uppercase">{children}</h4>;
}

function SidebarValue({ children }) {
  return <div className="text-lg">{children}</div>;
}

export default function PackagePage({ metadata, githubUrl, readme }) {
  const datePublished = new Date(metadata['Date/Publication']);

  return (
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
            allowDangerousHtml // TODO: is this safe?
          >
            {readme.data}
          </ReactMarkdown>
        ) : (
          <div className="flex items-center justify-center h-full">
            Readme not available :(
          </div>
        )}
      </article>
      <div className="w-1/3 pl-8 space-y-5 border-l">
        <div>
          <SidebarHeader>Install</SidebarHeader>
          <div className="prose">
            <pre>
              <code>{`install.packages('${metadata.Package}')`}</code>
            </pre>
          </div>
        </div>
        <div>
          <SidebarHeader>Monthly Downloads</SidebarHeader>
          <div className="flex items-baseline justify-between">
            <div className="text-3xl font-light">122,222</div>
            <div className="w-3/5">
              <MonthlyDownloadsChart />
            </div>
          </div>
        </div>
        <div className="flex">
          <div className="w-1/2">
            <SidebarHeader>Version</SidebarHeader>
            <SidebarValue>{metadata.Version}</SidebarValue>
          </div>
          <div className="w-1/2">
            <SidebarHeader>License</SidebarHeader>
            {/* TODO: strip down the license text? */}
            <SidebarValue>{metadata.License}</SidebarValue>
          </div>
        </div>
        {githubUrl && (
          <>
            <div className="flex">
              <div className="w-1/2">
                <SidebarHeader>Issues</SidebarHeader>
                <SidebarValue>123</SidebarValue>
              </div>
              <div className="w-1/2">
                <SidebarHeader>Pull Requests</SidebarHeader>
                <SidebarValue>123</SidebarValue>
              </div>
            </div>
            <div className="flex">
              <div className="w-1/2">
                <SidebarHeader>Stars</SidebarHeader>
                <SidebarValue>123</SidebarValue>
              </div>
              <div className="w-1/2">
                <SidebarHeader>Forks</SidebarHeader>
                <SidebarValue>123</SidebarValue>
              </div>
            </div>
            <div>
              <SidebarHeader>Repository</SidebarHeader>
              <SidebarValue>
                <div className="flex items-center">
                  {/* <FaGithub /> */}
                  <a
                    // className="ml-2"
                    href={githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {githubUrl}
                  </a>
                </div>
              </SidebarValue>
            </div>
          </>
        )}
        <div>
          <SidebarHeader>Homepage</SidebarHeader>
          <SidebarValue>
            <div className="flex items-center">
              {/* <FaHome /> */}
              <a
                // className="ml-2"
                href="#"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://somepackage.com
              </a>
            </div>
          </SidebarValue>
        </div>
        <div>
          <SidebarHeader>Last Published</SidebarHeader>
          <SidebarValue>{format(datePublished, 'PPP')}</SidebarValue>
        </div>
      </div>
    </div>
  );
}

const fetcher = (url) => fetch(url).then((res) => res.json());

function getGithubOwnerRepo(url) {
  if (!url) return null;
  return url.replace('https://github.com/', '');
}

function getGithubUrl(stringOfUrls) {
  if (!stringOfUrls) return null;
  const urlArray = stringOfUrls.split(',').map((url) => url.trim());
  const githubUrl = urlArray.find((url) => url.includes('github.com'));
  return githubUrl || null;
}

export async function getServerSideProps({ params: { name } }) {
  // get package metadata
  const metadata = await fetcher(`https://crandb.r-pkg.org/${name}`);

  // get github url and readme
  const { URL: stringOfUrls } = metadata;
  const githubUrl = getGithubUrl(stringOfUrls);
  let readme = null;
  if (githubUrl) {
    const githubOwnerRepo = getGithubOwnerRepo(githubUrl);
    readme = await getGithubReadme(githubOwnerRepo);
  }

  return {
    props: {
      metadata,
      githubUrl,
      readme,
    },
  };
}
