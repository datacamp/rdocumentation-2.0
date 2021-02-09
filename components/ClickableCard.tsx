import Link from 'next/link';

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
  return (
    <div
      className="border-2 rounded-md hover:border-dc-navy dark:hover:border-dc-yellow focus:border-dc-navy dark:focus:border-dc-yellow focus:outline-none"
      key={id}
      tabIndex={0}
    >
      <Link href={href}>
        <a>
          <div className="px-4 py-3">
            <div className="flex items-baseline justify-between">
              <div className="font-bold truncate">
                <Html>{name}</Html>
              </div>
              <div className="text-sm text-gray-500">{extraInfo}</div>
            </div>
            <div className="mt-2 text-sm line-clamp-3">
              <Html>{description}</Html>
            </div>
          </div>
        </a>
      </Link>
    </div>
  );
}
