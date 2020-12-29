import { useRouter } from 'next/router';
import { CopyIcon } from '@datacamp/waffles-icons';
import { Select, SelectOption } from '@datacamp/waffles-form-elements';
import { FaHome, FaGithub } from 'react-icons/fa';
import { format } from 'date-fns';
import MonthlyDownloadsChart from './MonthlyDownloadsChart';
import { copyTextToClipboard } from '../lib/utils';

export default function PackageSidebar({
  packageName,
  linkToCurrentVersion,
  version,
  versionsArray,
  downloadsLastMonth,
  monthlyDownloads,
  license,
  repository,
  githubUrl,
  homeUrl,
  lastPublished,
  maintainer,
  isDark,
}) {
  const router = useRouter();

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

  function handleCopyLink() {
    copyTextToClipboard(linkToCurrentVersion);
  }

  function handleChangeVersion(selectedVersion) {
    router.push({
      pathname: '/packages/[package]/versions/[version]',
      query: { package: packageName, version: selectedVersion },
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <SidebarHeader>Copy Link</SidebarHeader>
        <div className="relative mt-4 dark:text-dc-navy">
          <button
            className="absolute inset-y-0 left-0 flex items-center p-4"
            type="button"
            onClick={handleCopyLink}
          >
            <CopyIcon size={18} />
          </button>
          <input
            className="block w-full pl-10 text-gray-500 border-2 rounded-md border-dc-grey300"
            type="text"
            value={linkToCurrentVersion}
            disabled
          />
        </div>
      </div>
      <div>
        <SidebarHeader>Version</SidebarHeader>
        <Select name="version" value={version} onChange={handleChangeVersion}>
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
                <a
                  href={`${githubUrl}/issues`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {repository.issues.toLocaleString()}
                </a>
              </SidebarValue>
            </div>
            <div className="w-1/2">
              <SidebarHeader>Pull Requests</SidebarHeader>
              <SidebarValue>
                <a
                  href={`${githubUrl}/pulls`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {repository.pullRequests.toLocaleString()}
                </a>
              </SidebarValue>
            </div>
          </div>
          <div className="flex">
            <div className="w-1/2">
              <SidebarHeader>Stars</SidebarHeader>
              <SidebarValue>
                <a
                  href={`${githubUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {repository.stars.toLocaleString()}
                </a>
              </SidebarValue>
            </div>
            <div className="w-1/2">
              <SidebarHeader>Forks</SidebarHeader>
              <SidebarValue>
                <a
                  href={`${githubUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {repository.forks.toLocaleString()}
                </a>
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
      <div className="flex">
        <div className="w-1/2">
          <SidebarHeader>Maintainer</SidebarHeader>
          <SidebarValue>{maintainer.name}</SidebarValue>
        </div>
        {lastPublished && (
          <div className="w-1/2">
            <SidebarHeader>Last Published</SidebarHeader>
            <SidebarValue>{format(lastPublished, 'PPP')}</SidebarValue>
          </div>
        )}
      </div>
    </div>
  );
}
