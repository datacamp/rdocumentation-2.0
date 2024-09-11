import Html from './Html';

type Props = {
  description: string;
  packageName: string;
  title: string;
  version: string;
};

export default function PackageReadMePlaceholder(data: Props) {
  const { description, packageName, title, version } = data;

  return (
    <div>
      <div className="max-w-screen-lg mt-8 md:mt-12">
        <div className="mt-2 prose-sm prose sm:prose max-w-none sm:max-w-none">
          <header>
            <h1>
              <Html>{`${packageName} (version ${version})`}</Html>
            </h1>
          </header>
          {title && (
            <section>
              <h2 className="text-xl text-gray-500">{title}</h2>
            </section>
          )}
          {description && (
            <section>
              <h2>Description</h2>
              <Html>{description}</Html>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
