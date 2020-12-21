export default function PackagePage() {
  return null;
}

// if no version is specified, then just redirect to the latest version
export async function getServerSideProps({ params: { package: packageName } }) {
  const versions = await fetch(
    `https://www.rdocumentation.org/api/packages/${packageName}`
  )
    .then((res) => res.json())
    // sort in descending order by version ID
    .then((data) => data.versions.sort((a, b) => b.id - a.id));

  // grab the latest version
  const latestVersion = versions.slice(0, 1)[0].version;

  return {
    redirect: {
      destination: `${packageName}/versions/${latestVersion}`,
      permanent: false,
    },
  };
}
