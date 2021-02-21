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
    const latestVersion = data.versions.find(
      (version) => version.id === data.latest_version_id,
    ).version;

    // return a temporary redirect to the latest version
    return {
      redirect: {
        destination: `/packages/${packageName}/versions/${latestVersion}`,
        permanent: false,
      },
    };
  } catch (error) {
    // if package doesn't exist, return a 404
    return {
      notFound: true,
    };
  }
};
