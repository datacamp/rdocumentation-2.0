export default function TopicPage({ topic }) {
  return <div>{topic}</div>;
}

export async function getServerSideProps({ params: { topic } }) {
  return {
    props: {
      topic,
    },
  };
}
