import { SearchIcon } from '@datacamp/waffles-icons';
import { ChangeEvent } from 'react';

type Props = {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  value: string;
};

export default function HomeSearchBar({ onChange, value }: Props) {
  return (
    <div className="relative mt-4 dark:text-dc-navy">
      <div className="absolute inset-y-0 left-0 items-center hidden pl-6 pointer-events-none sm:flex">
        <SearchIcon size={24} />
      </div>
      <input
        className="block w-full py-2 text-lg border-2 rounded-md sm:pl-16 md:text-2xl md:py-4 placeholder-dc-grey400 border-dc-grey300 focus:border-dc-blue focus:ring-dc-blue dark:focus:border-dc-green dark:focus:ring-dc-green"
        onChange={onChange}
        placeholder="For example, try 'dplyr' or 'group_by'"
        type="text"
        value={value}
      />
    </div>
  );
}
