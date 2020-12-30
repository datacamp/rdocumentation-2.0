import { useRouter } from 'next/router';

export default function SearchResults() {
  const router = useRouter();
  const { q } = router.query;

  return <div>{q}</div>;
}
