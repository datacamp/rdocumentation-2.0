import fetch from 'isomorphic-fetch';
import { GetServerSideProps } from 'next';
import Link from 'next/link';

import Html from '../../../../../../components/Html';
import Layout from '../../../../../../components/Layout';

type Props = {
  topicData: {
    arguments: Array<{
      description: string;
      name: string;
      topic_id: number;
    }>;
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

  return (
    <Layout description={description} title={pageTitle}>
      <div className="w-full max-w-screen-lg mx-auto mt-8 md:mt-12">
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
              {name}: <Html>{title}</Html>
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
          {args && (
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
              <Html>{value}</Html>
            </section>
          )}
          {sections && sections.length > 0 && (
            <section>
              {sections.map((section) => (
                <div key={section.name}>
                  <h2>{section.name}</h2>
                  <Html>{section.description}</Html>
                </div>
              ))}
            </section>
          )}
          {details && (
            <section>
              <h2>Details</h2>
              <Html>{details}</Html>
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
              <h2>Examples</h2>
              <pre>{examples}</pre>
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
      `https://www.rdocumentation.org/api/packages/${packageName}/versions/${version}/topics/${topic}`,
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
