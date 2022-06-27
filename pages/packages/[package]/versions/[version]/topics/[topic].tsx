import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import ReactGA from 'react-ga';

import Html from '../../../../../../components/Html';
import Layout from '../../../../../../components/Layout';
import * as gtag from '../../../../../../lib/gtag';
import { API_URL } from '../../../../../../lib/utils';

type Props = {
  topicData: {
    arguments: Array<{
      description: string;
      name: string;
      topic_id: number;
    }>;
    canonicalLink: string;
    description: string;
    details: string;
    examples: string;
    name: string;
    package_version: { package_name: string; version: string };
    pageTitle: string;
    references: string;
    sections: Array<{ description: string; name: string; topic_id: number }>;
    seealso: string;
    title: string;
    usage: string;
    value: string;
  };
};

export default function TopicPage({ topicData }: Props) {
  const {
    arguments: args,
    canonicalLink,
    description,
    details,
    examples,
    name,
    package_version: { package_name: packageName, version: packageVersion },
    pageTitle,
    references,
    sections,
    seealso,
    title,
    usage,
    value,
  } = topicData;
  const router = useRouter();
  const { topic } = router.query;
  const rdocsPath = encodeURIComponent(
    `packages/${packageName}/versions/${packageVersion}/topics/${topic}`,
  );
  const registerClicks = (label) => {
    ReactGA.event({
      action: 'Click',
      category: 'Run in workspace',
      label,
    });
  };

  const showLegacyArguments = useMemo(() => {
    return (
      args &&
      sections.filter((section) =>
        section.name?.toLowerCase()?.includes('argument'),
      )?.length < 1
    );
  }, [args, sections]);

  return (
    <Layout
      canonicalLink={canonicalLink}
      description={description}
      title={pageTitle}
    >
      <div className="max-w-screen-lg mt-8 md:mt-12">
        <section className="text-xl text-gray-500">
          <Link href={`/packages/${packageName}/versions/${packageVersion}`}>
            <a>
              {packageName} (version {packageVersion})
            </a>
          </Link>
        </section>
        <div className="mt-2 prose-sm prose sm:prose max-w-none sm:max-w-none">
          <header>
            <h1>
              <Html>{`${name}: ${title}`}</Html>
            </h1>
          </header>
          {description && (
            <section>
              <h2>Description</h2>
              <Html>{description}</Html>
            </section>
          )}
          {usage && (
            <section>
              <h2>Usage</h2>
              <pre>
                <Html>{usage}</Html>
              </pre>
            </section>
          )}
          {showLegacyArguments && (
            <section>
              <h2>Arguments</h2>
              {args.map((arg) => (
                <div className="mt-6 md:flex" key={arg.name}>
                  <div className="font-mono font-bold truncate md:w-3/12 lg:w-2/12">
                    <Html>{arg.name}</Html>
                  </div>
                  <div className="-mt-4 md:-mt-5 md:w-9/12 md:pl-5 lg:w-10/12">
                    <Html>{arg.description}</Html>
                  </div>
                </div>
              ))}
            </section>
          )}
          {value && (
            <section>
              <h2>Value</h2>
              <Html className="list-view">{value}</Html>
            </section>
          )}
          {sections && sections.length > 0 && (
            <section>
              {sections.map((section) => {
                if (section.description.length<1) {
                  return
                }
                return (
                  <div key={section.name}>
                    <h2>{section.name}</h2>
                    <Html className="list-view">{section.description}</Html>
                  </div>
                );
              })}
            </section>
          )}
          {details && (
            <section>
              <h2>Details</h2>
              <Html className="list-view">{details}</Html>
            </section>
          )}
          {references && (
            <section>
              <h2>References</h2>
              <Html>{references}</Html>
            </section>
          )}
          {seealso && (
            <section>
              <h2>See Also</h2>
              <Html>{seealso}</Html>
            </section>
          )}
          {examples && (
            <section>
              <div className="relative">
                <h2>Examples</h2>
                <a
                  className="absolute p-2 text-sm rounded-md top-0	right-0 hover:bg-green-400 md:p-3 md:text-base md:top-16 md:right-2.5"
                  href={`https://app.datacamp.com/workspace/preview?_tag=rdocs&rdocsPath=${rdocsPath}&utm_source=r-docs&utm_medium=docs&utm_term=${topic}&utm_content=run_example_in_workspace`}
                  onClick={() => registerClicks('Button')}
                  style={{
                    background: 'rgba(3, 239, 98)',
                    color: '#1f2937',
                    fontWeight: 600,
                    textDecoration: 'none',
                    ...(examples.split(/\r\n|\r|\n/)?.length <= 2
                      ? { padding: '4px 8px' }
                      : {}),
                  }}
                  target="_blank"
                >
                  Run this code
                </a>
                <pre>{examples}</pre>
                <p>
                  Run the code above in your browser using{' '}
                  <a
                    href={`https://app.datacamp.com/workspace/preview?_tag=rdocs&rdocsPath=${rdocsPath}&utm_source=r-docs&utm_medium=docs&utm_term=${topic}&utm_content=run_example_in_workspace`}
                    onClick={() => registerClicks('Link')}
                    target="_blank"
                  >
                    DataCamp Workspace
                  </a>
                </p>
              </div>
            </section>
          )}
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  params: { package: packageName, topic, version },
}) => {
  try {
    const res = await fetch(
      `${API_URL}/api/packages/${packageName}/versions/${version}/topics/${topic}`,
    );
    const topicData = await res.json();
    // if the response isn't a single topic, throw an error (i.e. return a 404)
    // context: the API returns all package versions when the provided version doesn't match any
    if (topicData.type !== 'topic') throw new Error();

    return {
      props: {
        topicData,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};
