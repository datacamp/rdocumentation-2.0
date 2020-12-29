import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';

export default function PackageReadme({ readme }) {
  return (
    <article className="prose max-w-none">
      {readme ? (
        <ReactMarkdown
          plugins={[gfm]}
          renderers={{
            // eslint-disable-next-line react/display-name
            link: ({ href, children }) => (
              <a href={href} target="_blank" rel="noopener noreferrer">
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
