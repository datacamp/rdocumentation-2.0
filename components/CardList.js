import Link from 'next/link';
import { Html } from '../lib/utils';

// TODO: add typescript to describe shape of items!
// each item should have: id, name, description, extraInfo (optional), href
export default function CardList({ items }) {
  return (
    <div className="grid grid-cols-3 gap-5 mt-5">
      {items.map((item) => (
        <div
          key={item.id}
          className="border-2 rounded-md hover:border-dc-navy dark:hover:border-dc-yellow"
        >
          <Link className="w-full h-full" href={item.href}>
            <a>
              <div className="px-4 py-3">
                <div className="flex items-baseline justify-between">
                  <div className="font-bold">{item.name}</div>
                  <div className="text-sm text-gray-400">{item.extraInfo}</div>
                </div>
                <div className="mt-2 text-sm">
                  <Html>{item.description}</Html>
                </div>
              </div>
            </a>
          </Link>
        </div>
      ))}
    </div>
  );
}
