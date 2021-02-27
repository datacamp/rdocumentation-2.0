import { useRouter } from 'next/router';

import Html from './Html';

type Props = {
  description: string;
  extraInfo?: string;
  href: string;
  id: string | number;
  name: string;
};

export default function ClickableCard({
  description,
  extraInfo,
  href,
  id,
  name,
}: Props) {
  const router = useRouter();

  function handleClick() {
    router.push(href);
  }

  return (
    <button
      className="flex flex-col w-full px-4 py-3 border-2 rounded-md hover:border-dc-navy dark:hover:border-dc-yellow focus:border-dc-navy dark:focus:border-dc-yellow focus:outline-none"
      key={id}
      onClick={handleClick}
    >
      <div className="flex items-baseline justify-between">
        <div className="font-bold truncate">
          <Html>{name}</Html>
        </div>
        <div className="text-sm text-gray-500">{extraInfo}</div>
      </div>
      <div className="mt-2 text-sm text-left line-clamp-3">
        <Html>{description}</Html>
      </div>
    </button>
  );
}
