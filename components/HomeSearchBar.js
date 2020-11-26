import { SearchIcon } from '@datacamp/waffles-icons';

export default function HomeSearchBar() {
  return (
    <div className="mt-4 relative">
      <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
        <SearchIcon size={24} />
      </div>
      <input
        className="block w-full pl-16 py-4 text-2xl placeholder-dc-grey400 rounded-md border-2 border-dc-grey300 focus:border-dc-blue focus:ring-dc-blue"
        type="text"
        placeholder="For example, try 'dplyr' or 'group_by'"
      />
    </div>
  );
}
