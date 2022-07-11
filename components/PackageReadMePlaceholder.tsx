import Html from './Html';

type Props = {
      packageName: string,
      version: string,
      title: string,
      description: string
}

export default function PackageReadMePlaceholder(data: Props) {
  const {
    packageName,
    version,
    title,
    description
  } = data;

  return (
    <div
    >
      <div className="max-w-screen-lg mt-8 md:mt-12">
        <div className="mt-2 prose-sm prose sm:prose max-w-none sm:max-w-none">
          <header>
            <h1>
              <Html>{`${packageName} (version ${version})`}</Html>
            </h1>
          </header>
          {
            title 
            &&
            (
            <section>
                <h2 className="text-xl text-gray-500">{title}</h2>
            </section>
            )
          }
          {
            description 
            && 
            (
            <section>
              <h2>Description</h2>
              <Html>{description}</Html>
            </section>
            )
          }
        </div>
      </div>
    </div>
  );
}
