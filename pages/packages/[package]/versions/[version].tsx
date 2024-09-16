import { mediaQuery } from '@datacamp/waffles/helpers';
import { tokens } from '@datacamp/waffles/tokens';
import styled from '@emotion/styled';
import { graphql } from '@octokit/graphql';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useContext } from 'react';

import { ThemeContext } from '../../../_app';
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

const Container = styled.div({
  '@media (min-width: 768px)': {
    marginTop: '3rem',
  },
  marginTop: '2rem',
});

const FlexContainer = styled.div({
  [mediaQuery.aboveMedium]: {
    flexDirection: 'row',
  },
  display: 'flex',
  flexDirection: 'column',
});

const MainContent = styled.div({
  [mediaQuery.aboveMedium]: {
    paddingBottom: 0,
    width: 'calc(100% * 2 / 3)',
  },
  paddingBottom: '2rem',
  width: '100%',
});

const SidebarContainer = styled.div({
  [mediaQuery.aboveMedium]: {
    borderTop: 0,
    paddingLeft: '2rem',
    paddingTop: 0,
    width: 'calc(100% / 3)',
  },
  paddingTop: '2rem',
  width: '100%',
});

const WarningBox = styled.div({
  '&[data-theme="dark"]': {
    border: `2px solid ${tokens.colors.yellow}`,
  },
  '&[data-theme="light"]': {
    border: `2px solid ${tokens.colors.navy}`,
  },
  a: {
    color: 'white',
    textDecoration: 'underline',
  },
  backgroundColor: tokens.colors.navy,
  borderRadius: '0.375rem',
  color: 'white',
  marginBottom: '1.25rem',
  padding: '1rem',
  span: {
    marginLeft: '0.75rem',
  },
});

const AdditionalContent = styled.div({
  '@media (min-width: 1024px)': {
    borderTop: 0,
    paddingTop: 0,
  },
  marginTop: '3rem',
  paddingTop: '2rem',
  width: '100%',
});

export default function PackageVersionPage({
  metadata,
  monthlyDownloads,
  repository,
  urls,
  versionsArray,
}: Props) {
  const { theme } = useContext(ThemeContext);
  const linkToCurrentVersion = `https://rdocumentation.org${metadata.uri}`;
  const latestVersion = versionsArray[0];
  const downloadsLastMonth = monthlyDownloads
    ? monthlyDownloads[monthlyDownloads.length - 1].downloads
    : null;
  const lastPublished = metadata.release_date
    ? new Date(metadata.release_date)
    : null;

  return (
    <Layout
      canonicalLink={metadata.canonicalLink}
      description={metadata.description}
      title={metadata.pageTitle}
    >
      <Container>
        <FlexContainer>
          <MainContent>
            {metadata.version !== latestVersion && (
              <WarningBox data-theme={theme}>
                <span>⚠️</span>
                <span>{`There's a newer version (${latestVersion}) of this package.`}</span>
                <Link href={metadata.canonicalLink}>Take me there.</Link>
              </WarningBox>
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
          </MainContent>
          <SidebarContainer>
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
          </SidebarContainer>
        </FlexContainer>
        <AdditionalContent>
          {metadata.topics?.length > 0 && (
            <PackageFunctionList
              functions={metadata.topics}
              packageName={metadata.package_name}
              packageVersion={metadata.version}
            />
          )}
        </AdditionalContent>
      </Container>
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
    const {
      canonicalLink,
      description,
      license,
      maintainer,
      package: { type_id },
      package_name,
      pageTitle,
      readmemd,
      release_date,
      sourceJSON: { 'Date/Publication': datePublication },
      title,
      topics,
      updated_at,
      uri,
      version: metadataVersion,
    } = metadata;
    const reducedMetaData = {
      canonicalLink,
      description,
      license,
      maintainer,
      package: { type_id },
      package_name,
      pageTitle,
      readmemd,
      release_date: datePublication ? release_date : updated_at,
      title,
      topics: topics.map((topic) => ({
        id: topic.id,
        name: topic.name,
        title: topic.title,
      })),
      type_id,
      uri,
      version: metadataVersion,
    };

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
        metadata: reducedMetaData,
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
