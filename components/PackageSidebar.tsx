import { Copy } from '@datacamp/waffles/icon';
import { Select } from '@datacamp/waffles/select';
import { useToast } from '@datacamp/waffles/toast';
import { format } from 'date-fns';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaGithub, FaHome, FaUser } from 'react-icons/fa';

import { copyTextToClipboard } from '../lib/utils';

import MonthlyDownloadsChart from './MonthlyDownloadsChart';
import SidebarHeader from './SidebarHeader';
import SidebarValue from './SidebarValue';

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
  const { toast } = useToast();

  function handleCopyLink() {
    copyTextToClipboard(linkToCurrentVersion);
    toast({ title: 'Copied to clipboard!', variant: 'success' });
  }

  function handleChangeVersion(event: React.ChangeEvent<HTMLSelectElement>) {
    const selectedVersion = event.target.value;
    router.push(`/packages/${packageName}/versions/${selectedVersion}`);
  }

  return (
    <div className="space-y-6">
      <div>
        <SidebarHeader>Copy Link</SidebarHeader>
        <div className="relative mt-4 dark:text-dc-navy">
          <button
            aria-label="copy link to clipboard"
            className="absolute inset-y-0 left-0 flex items-center justify-center w-10 pl-2"
            onClick={handleCopyLink}
            type="button"
          >
            <Copy size={'medium'} />
          </button>
          <label className="sr-only" htmlFor="linkToCurrentVersion">
            Link to current version
          </label>
          <input
            className="block w-full pl-10 text-gray-500 border-2 rounded-md border-dc-grey300"
            id="linkToCurrentVersion"
            readOnly
            type="text"
            value={linkToCurrentVersion}
          />
        </div>
      </div>
      <div>
        <SidebarHeader>Version</SidebarHeader>
        <label className="sr-only" htmlFor="version">
          Version
        </label>
        <Select
          id="version"
          name="version"
          onChange={handleChangeVersion}
          value={version}
        >
          {versionsArray.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
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
          <SidebarValue Icon={FaUser}>
            <Link href={`/collaborators/name/${encodeURI(maintainer.name)}`}>
              {maintainer.name}
            </Link>
          </SidebarValue>
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
