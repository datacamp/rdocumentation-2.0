import Link from 'next/link';

import { Html } from '../lib/utils';

type Props = {
  description: string;
  extraInfo?: string;
  href: string;
  id: string;
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
      className="border-2 rounded-md hover:border-dc-navy dark:hover:border-dc-yellow"
      key={id}
    >
      <Link href={href}>
        <a>
          <div className="px-4 py-3">
            <div className="flex items-baseline justify-between">
              <div className="font-bold">
                <Html>{name}</Html>
              </div>
              <div className="text-sm text-gray-400">{extraInfo}</div>
            </div>
            <div className="mt-2 text-sm">
              <Html>{description}</Html>
            </div>
          </div>
        </a>
      </Link>
    </div>
  );
}
