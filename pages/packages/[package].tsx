import fetch from 'isomorphic-fetch';
import { GetServerSideProps } from 'next';

export default function PackagePage() {
  return null;
}

// if no version is specified, then just redirect to the latest version
export const getServerSideProps: GetServerSideProps = async ({
  params: { package: packageName },
}) => {
  try {
    const res = await fetch(
      `https://www.rdocumentation.org/api/packages/${packageName}`,
    );
    const data = await res.json();

    // if package is found, get the latest version
    const latestVersion = data.versions
      .sort((a, b) => b.id - a.id)
      .slice(0, 1)[0].version;

    // return a redirect to the latest version
    return {
      redirect: {
        destination: `packages/${packageName}/versions/${latestVersion}`,
        permanent: false, // TODO: make true
      },
    };
  } catch (error) {
    // if package doesn't exist, return a 404
    return {
      notFound: true,
    };
  }
};