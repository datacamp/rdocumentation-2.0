import { GetServerSideProps } from 'next';

import { API_URL } from '../../lib/utils';

export default function genericLinkPage() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({
  params,
  query,
}) => {
  let topic = Array.isArray(params.topic) ? params.topic[0] : params.topic;
  let packageName = Array.isArray(query.package)
    ? query.package[0]
    : query.package;

  topic = topic.replace(/\(\)$/, '');

  if (topic.includes('::')) {
    [packageName, topic] = topic.split('::');
  }

  try {
    const res = await fetch(
      `${API_URL}/link/${topic}?package=${packageName}&version=${query.version}`,
    );

    return {
      redirect: {
        destination: res.url.replace(API_URL, ''),
        permanent: false,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};
