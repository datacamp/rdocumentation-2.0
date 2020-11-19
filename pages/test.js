import { request } from '@octokit/request';

export default function Test({ metadata, readme }) {
  return (
    <>
      <pre className="whitespace-pre-wrap">
        {JSON.stringify(metadata, null, 2)}
        {JSON.stringify(readme, null, 2)}
      </pre>
      {/* TODO: don't be dangerous 👇 */}
      <div
        className="mt-10"
        dangerouslySetInnerHTML={{ __html: readme.data }}
      />
    </>
  );
}

const fetcher = (url) => fetch(url).then((res) => res.json());

function getGitHubOwnerRepo(url) {
  return url.replace('https://github.com/', '');
}

export async function getStaticProps() {
  const metadata = await fetcher('https://crandb.r-pkg.org/dplyr/1.0.2');
  // TODO: extract url from metadata programmatically
  const ghOwnerRepo = getGitHubOwnerRepo('https://github.com/tidyverse/dplyr');

  const readme = await request(`GET /repos/${ghOwnerRepo}/contents/README.md`, {
    mediaType: {
      format: 'html',
    },
  });

  return {
    props: {
      metadata,
      readme,
    },
  };
}
