import ReactMarkdownWithHtml from 'react-markdown/with-html';
import gfm from 'remark-gfm';
import { FaHome, FaGithub } from 'react-icons/fa';
import { format } from 'date-fns';
import MonthlyDownloadsChart from '../../../../components/MonthlyDownloadsChart';

function getPackageUrls(stringOfUrls) {
  const urls = { homeUrl: null, githubUrl: null };
  if (!stringOfUrls) return urls;

  const urlArray = stringOfUrls.split(',').map((url) => url.trim());
  const githubIndex = urlArray.findIndex((url) => url.includes('github.com'));
  if (githubIndex >= 0) urls.githubUrl = urlArray[githubIndex];
  if (githubIndex >= 1) urls.homeUrl = urlArray[0];

  return urls;
}

function SidebarHeader({ children }) {
  return <h4 className="mb-2 text-sm text-gray-500 uppercase">{children}</h4>;
}

function SidebarValue({ children }) {
  return <div className="text-lg">{children}</div>;
}

export default function PackageVersionPage({ packageData, isDark }) {
  // get relevant data from package metadata
  const {
    package_name,
    version,
    license,
    url: stringOfUrls,
    release_date,
    readmemd: readme,
  } = packageData;
  // extract the github repo url
  const { homeUrl, githubUrl } = getPackageUrls(stringOfUrls);
  // get the last published date
  const lastPublished = release_date ? new Date(release_date) : null;

  return (
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
      <div className="w-1/3 pl-8 space-y-5 border-l">
        <div>
          <SidebarHeader>Install</SidebarHeader>
          <div className="prose">
            <pre>
              <code>{`install.packages('${package_name}')`}</code>
            </pre>
          </div>
        </div>
        <div>
          <SidebarHeader>Monthly Downloads</SidebarHeader>
          <div className="flex items-baseline justify-between">
            <div className="text-3xl font-light">122,222</div>
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
                  <div>
                    <FaGithub />
                  </div>
                  <a
                    className="ml-2"
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
        {homeUrl && (
          <div>
            <SidebarHeader>Homepage</SidebarHeader>
            <SidebarValue>
              <div className="flex items-center">
                <div>
                  <FaHome />
                </div>
                <a
                  className="ml-2"
                  href={homeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {homeUrl}
                </a>
              </div>
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
  );
}

const fetcher = (url) => fetch(url).then((res) => res.json());

export async function getServerSideProps({
  params: { package: packageName, version },
}) {
  const packageData = await fetcher(
    `https://www.rdocumentation.org/api/packages/${packageName}/versions/${version}`
  );

  return {
    props: {
      packageData,
    },
  };
}
