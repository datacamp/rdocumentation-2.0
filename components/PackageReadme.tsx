import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';

type Props = {
  readme: string;
};

export default function PackageReadme({ readme }: Props) {
  return (
    <article className="prose max-w-none">
      {readme ? (
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
      ) : (
        <div className="pt-20 text-center">
          {/* TODO: Need a CTA here */}
          Readme not available 😞
        </div>
      )}
    </article>
  );
}
