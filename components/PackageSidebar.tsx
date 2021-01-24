import { Select, SelectOption } from '@datacamp/waffles-form-elements';
import { CopyIcon } from '@datacamp/waffles-icons';
import { toast, ToastContainer } from '@datacamp/waffles-toast';
import { format } from 'date-fns';
import { useRouter } from 'next/router';
import { FaGithub, FaHome } from 'react-icons/fa';

import { copyTextToClipboard } from '../lib/utils';

import MonthlyDownloadsChart from './MonthlyDownloadsChart';

type PackageSidebarProps = {
  downloadsLastMonth: number;
  githubUrl: string;
  homeUrl: string;
  lastPublished: Date;
  license: string;
  linkToCurrentVersion: string;
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
  monthlyDownloads: Array<{ downloads: number; month: string }>;
  packageName: string;
  repository: {
    forks: number;
    issues: number;
    pullRequests: number;
    stars: number;
  };
  showInstallCode: boolean;
  version: string;
  versionsArray: string[];
};

export default function PackageSidebar({
  downloadsLastMonth,
  githubUrl,
  homeUrl,
  lastPublished,
  license,
  linkToCurrentVersion,
  maintainer,
  monthlyDownloads,
  packageName,
  repository,
  showInstallCode,
  version,
  versionsArray,
}: PackageSidebarProps) {
  const router = useRouter();

  type SidebarHeaderProps = {
    children: React.ReactNode;
  };

  function SidebarHeader({ children }: SidebarHeaderProps) {
    return <h4 className="mb-2 text-sm text-gray-500 uppercase">{children}</h4>;
  }

  type SidebarValueProps = {
    children: React.ReactNode;
    Icon?: React.ComponentType;
  };

  function SidebarValue({ Icon, children }: SidebarValueProps) {
    return (
      <div className="flex items-center">
        {Icon && <Icon />}
        <span className={Icon ? 'ml-2' : ''}>{children}</span>
      </div>
    );
  }

  function handleCopyLink() {
    copyTextToClipboard(linkToCurrentVersion);
    toast({ intent: 'success', title: 'Copied to clipboard!' });
  }

  function handleChangeVersion(selectedVersion) {
    router.push(`/packages/${packageName}/versions/${selectedVersion}`);
  }

  return (
    <>
      <ToastContainer />
      <div className="space-y-6">
        <div>
          <SidebarHeader>Copy Link</SidebarHeader>
          <div className="relative mt-4 dark:text-dc-navy">
            <button
              className="absolute inset-y-0 left-0 flex items-center justify-center w-10 pl-2"
              onClick={handleCopyLink}
              type="button"
            >
              <CopyIcon size={18} />
            </button>
            <input
              className="block w-full pl-10 text-gray-500 border-2 rounded-md border-dc-grey300"
              readOnly
              type="text"
              value={linkToCurrentVersion}
            />
          </div>
        </div>
        <div>
          <SidebarHeader>Version</SidebarHeader>
          <Select name="version" onChange={handleChangeVersion} value={version}>
            {versionsArray.map((v) => (
              <SelectOption key={v} value={v}>
                {v}
              </SelectOption>
            ))}
          </Select>
        </div>
        {/* show install code if it's a CRAN package */}
        {showInstallCode && (
          <div>
            <SidebarHeader>Install</SidebarHeader>
            <div className="prose-sm prose sm:prose">
              <pre>
                <code>{`install.packages('${packageName}')`}</code>
              </pre>
            </div>
          </div>
        )}
        {/* only show downloads data if we have 3+ months of it */}
        {monthlyDownloads && monthlyDownloads.length >= 3 && (
          <div>
            <SidebarHeader>Monthly Downloads</SidebarHeader>
            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-light">
                {downloadsLastMonth.toLocaleString()}
              </div>
              <div className="w-3/5">
                <MonthlyDownloadsChart monthlyDownloads={monthlyDownloads} />
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
                    rel="noopener noreferrer"
                    target="_blank"
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
                    rel="noopener noreferrer"
                    target="_blank"
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
                  <a href={githubUrl} rel="noopener noreferrer" target="_blank">
                    {repository.stars.toLocaleString()}
                  </a>
                </SidebarValue>
              </div>
              <div className="w-1/2">
                <SidebarHeader>Forks</SidebarHeader>
                <SidebarValue>
                  <a href={githubUrl} rel="noopener noreferrer" target="_blank">
                    {repository.forks.toLocaleString()}
                  </a>
                </SidebarValue>
              </div>
            </div>
            <div>
              <SidebarHeader>Repository</SidebarHeader>
              <SidebarValue Icon={FaGithub}>
                <a href={githubUrl} rel="noopener noreferrer" target="_blank">
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
              <a href={homeUrl} rel="noopener noreferrer" target="_blank">
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
    </>
  );
}
