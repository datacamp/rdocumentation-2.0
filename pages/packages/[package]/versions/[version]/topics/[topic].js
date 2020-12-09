function Html({ className, children }) {
  return (
    // eslint-disable-next-line react/no-danger
    <div className={className} dangerouslySetInnerHTML={{ __html: children }} />
  );
}

export default function TopicPage({ topicData }) {
  const {
    name,
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
    <div className="max-w-screen-lg mx-auto mt-12 prose">
      <h1>
        {name}: {title}
      </h1>
      <h2>Description</h2>
      <Html>{description}</Html>
      <h2>Usage</h2>
      <pre>
        <Html>{usage}</Html>
      </pre>
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
      <h2>Value</h2>
      <Html>{value}</Html>
      {sections.map((section) => (
        <div key={section.name}>
          <h2>{section.name}</h2>
          <Html>{section.description}</Html>
        </div>
      ))}
      <h2>Details</h2>
      <Html>{details}</Html>
      <h2>References</h2>
      <Html>{references}</Html>
      <h2>See Also</h2>
      <Html>{seealso}</Html>
      <h2>Examples</h2>
      <pre>{examples}</pre>
    </div>
  );
}

const fetcher = (url) => fetch(url).then((res) => res.json());

export async function getServerSideProps({
  params: { package: packageName, version, topic },
}) {
  const topicData = await fetcher(
    `https://www.rdocumentation.org/api/packages/${packageName}/versions/${version}/topics/${topic}`
  );

  return {
    props: {
      topicData,
    },
  };
}
