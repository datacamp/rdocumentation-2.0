import Head from 'next/head';

function Html({ className, children }) {
  return (
    // eslint-disable-next-line react/no-danger
    <div className={className} dangerouslySetInnerHTML={{ __html: children }} />
  );
}

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
      <div className="max-w-screen-lg mx-auto mt-12 prose">
        <section className="text-xl text-gray-400">
          {packageName} (version {packageVersion})
        </section>
        <header className="mt-2">
          <h1>
            {name}: {title}
          </h1>
        </header>
        <section>
          <h2>Description</h2>
          <Html>{description}</Html>
        </section>
        <section>
          <h2>Usage</h2>
          <pre>
            <Html>{usage}</Html>
          </pre>
        </section>
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
        <section>
          <h2>Value</h2>
          <Html>{value}</Html>
        </section>
        <section>
          {sections.map((section) => (
            <div key={section.name}>
              <h2>{section.name}</h2>
              <Html>{section.description}</Html>
            </div>
          ))}
        </section>
        <section>
          <h2>Details</h2>
          <Html>{details}</Html>
        </section>
        <section>
          <h2>References</h2>
          <Html>{references}</Html>
        </section>
        <section>
          <h2>See Also</h2>
          <Html>{seealso}</Html>
        </section>
        <section>
          <h2>Examples</h2>
          <pre>{examples}</pre>
        </section>
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
