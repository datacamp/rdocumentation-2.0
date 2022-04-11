import { GetServerSideProps } from 'next';
import { API_URL } from '../../lib/utils';

export default function genericLinkPage() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({
  params: { topic },
  query: { package: packageName, version },
}) => {
  try {
    const res = await fetch(
      `${API_URL}/link/${topic}?package=${packageName}&version=${version}`,
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
