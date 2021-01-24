import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';

type Props = {
  readme: string;
};

export default function PackageReadme({ readme }: Props) {
  return (
    <article>
      {readme ? (
        <div className="prose-sm prose sm:prose max-w-none sm:max-w-none">
          <ReactMarkdown
            plugins={[gfm]}
            renderers={{
              link: ({ children, href }) => (
                <a href={href} rel="noopener noreferrer" target="_blank">
                  {children}
                </a>
              ),
            }}
            skipHtml
          >
            {readme}
          </ReactMarkdown>
        </div>
      ) : (
        <p className="mt-8 text-center md:text-lg lg:text-xl lg:mt-24">
          Readme not available 😞
        </p>
      )}
    </article>
  );
}
