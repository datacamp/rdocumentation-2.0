import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { FaGithub, FaUser } from 'react-icons/fa';

import ClickableCard from '../../../components/ClickableCard';
import Layout from '../../../components/Layout';
import SidebarHeader from '../../../components/SidebarHeader';
import SidebarValue from '../../../components/SidebarValue';

type Props = {
  collaboratorData: {
    github_login: string;
    icon: string;
    impact_percentile: number;
    num_packages: number;
    person_name: string;
    person_packages: Array<{
      name: string;
      summary: string;
    }>;
    subscores: Array<{
      name: string;
      val: number;
    }>;
    top_collabs: Array<{
      name: string;
    }>;
  };
};

export default function CollaboratorPage({ collaboratorData }: Props) {
  const {
    github_login: githubName,
    icon: image,
    impact_percentile: impactPercentile,
    num_packages: numberOfPackages,
    person_name: personName,
    person_packages: packages,
    subscores,
    top_collabs: collaborators,
  } = collaboratorData;

  const githubUrl = `https://www.github.com/${githubName}`;
  const downloads =
    subscores && subscores.find((score) => score.name === 'num_downloads').val;
  const citations =
    subscores && subscores.find((score) => score.name === 'num_mentions').val;

  return (
    <Layout title={`${personName} | Collaborator`}>
      <div className="mt-8 md:mt-12">
        <div className="block lg:flex">
          <div className="w-full pb-8 lg:pb-0 lg:w-2/3 lg:pr-8">
            {/* Header */}
            <div className="flex mb-8 sm:space-x-4">
              <img
                alt={`Image of ${personName}`}
                className="hidden w-24 h-24 rounded-lg sm:block"
                height={24}
                src={image}
                width={24}
              />
              <div className="flex-auto">
                <h1 className="mb-2 text-4xl">{personName}</h1>
                <SidebarValue Icon={FaGithub}>
                  <a href={githubUrl} rel="noopener noreferrer" target="_blank">
                    {githubUrl}
                  </a>
                </SidebarValue>
              </div>
            </div>

            <h2 className="text-sm sm:text-xl">
              Author or maintainer of the following packages:
            </h2>

            {/* Package list */}
            <div className="grid grid-cols-1 gap-4 mt-5 md:grid-cols-2 md:gap-5">
              {packages &&
                packages
                  .sort((a, b) => {
                    const aName = a.name.toLowerCase();
                    const bName = b.name.toLowerCase();
                    // eslint-disable-next-line no-nested-ternary
                    return aName > bName ? 1 : bName > aName ? -1 : 0;
                  })
                  .map((f) => (
                    <ClickableCard
                      description={f.summary}
                      href={`/packages/${f.name}`}
                      id={f.name}
                      key={f.name}
                      name={f.name}
                    />
                  ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full pt-8 border-t lg:border-t-0 lg:w-1/3 lg:pt-0 lg:pl-8 lg:border-l">
            <div className="space-y-6">
              <div className="flex">
                <div className="w-1/2">
                  <SidebarHeader>Impact Percentile</SidebarHeader>
                  <SidebarValue>
                    {Math.round(impactPercentile * 100)}
                  </SidebarValue>
                </div>
                <div className="w-1/2">
                  <SidebarHeader>Number of Packages</SidebarHeader>
                  <SidebarValue>
                    {numberOfPackages?.toLocaleString()}
                  </SidebarValue>
                </div>
              </div>

              <div className="flex">
                <div className="w-1/2">
                  <SidebarHeader>Package Downloads</SidebarHeader>
                  <SidebarValue>{downloads?.toLocaleString()}</SidebarValue>
                </div>
                <div className="w-1/2">
                  <SidebarHeader>Citations</SidebarHeader>
                  <SidebarValue>{citations?.toLocaleString()}</SidebarValue>
                </div>
              </div>

              {collaborators && (
                <div>
                  <SidebarHeader>Top Collaborators</SidebarHeader>
                  <ul className="space-y-1">
                    {collaborators.map((collaborator) => {
                      const { name } = collaborator;
                      return (
                        <li>
                          <SidebarValue Icon={FaUser}>
                            <Link
                              href={`/collaborators/name/${encodeURI(name)}`}
                            >
                              {name}
                            </Link>
                          </SidebarValue>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  params: { collaborator: collaboratorName },
}) => {
  try {
    const res = await fetch(
      `https://www.rdocumentation.org/api/collaborators/name/${collaboratorName}/depsy`,
    );
    const collaboratorData = await res.json();

    // If no id is returned, throw error and 404
    if (!collaboratorData.id) throw new Error();

    return {
      props: {
        collaboratorData,
      },
    };
  } catch (error) {
    // if the collaborator API doesn't return anything useful, return a 404
    return {
      notFound: true,
    };
  }
};
