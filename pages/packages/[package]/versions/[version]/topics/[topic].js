import Head from 'next/head';
import Link from 'next/link';
import { Html } from '../../../../../../lib/utils';

export default function TopicPage({ topicData }) {
  const {
    name,
    package_version: { package_name: packageName, version: packageVersion },
    title,
    description,
    usage,
    arguments: args,
    value,
    sections,
    details,
    references,
    seealso,
    examples,
  } = topicData;

  return (
    <>
      <Head>
        <title>{name} function | RDocumentation</title>
      </Head>
      <div className="max-w-screen-lg mx-auto mt-12">
        <section className="text-xl text-gray-400">
          <Link href={`/packages/${packageName}/versions/${packageVersion}`}>
            <a>
              {packageName} (version {packageVersion})
            </a>
          </Link>
        </section>
        <div className="mt-2 prose max-w-none">
          <header>
            <h1>
              {name}: {title}
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
                <div key={arg.name} className="flex justify-between mt-5">
                  <div className="font-mono font-bold">
                    <Html>{arg.name}</Html>
                  </div>
                  <div className="w-4/5 ml-5 -mt-5">
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
    </>
  );
}

export async function getServerSideProps({
  params: { package: packageName, version, topic },
}) {
  const topicData = await fetch(
    `https://www.rdocumentation.org/api/packages/${packageName}/versions/${version}/topics/${topic}`
  ).then((res) => res.json());

  return {
    props: {
      topicData,
    },
  };
}
