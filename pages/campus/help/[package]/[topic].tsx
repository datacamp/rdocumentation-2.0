import { GetServerSideProps } from 'next';

export default function CampusHelpPage() {
  return null;
}

// redirect help requests from campus to the relevant page
export const getServerSideProps: GetServerSideProps = async ({
  params: { package: packageName, topic: topicName },
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
        destination: `/packages/${packageName}/versions/${latestVersion}/topics/${topicName}`,
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
