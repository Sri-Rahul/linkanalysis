import { useState, useEffect } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';

/**
 * Search component for filtering data
 * @param {Object} props
 * @param {string} props.placeholder - Placeholder text for search input
 * @param {string} props.value - Current search value
 * @param {Function} props.onChange - Function to call when search value changes
 * @param {number} props.debounceMs - Debounce delay in milliseconds
 */
const Search = ({
  placeholder = 'Search...',
  value = '',
  onChange,
  debounceMs = 300,
}) => {
  const [searchTerm, setSearchTerm] = useState(value);

  // Debounce search input to prevent excessive filtering
  useEffect(() => {
    const handler = setTimeout(() => {
      onChange(searchTerm);
    }, debounceMs);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, onChange, debounceMs]);

  // Clear search input
  const handleClear = () => {
    setSearchTerm('');
    onChange('');
  };

  return (
    <div className="relative w-full max-w-sm group">
      <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-foreground" />
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-1 pl-10 pr-9 text-sm shadow-sm transition-all duration-200 ease-in-out file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 group-hover:border-primary/50"
      />
      {searchTerm && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 rounded-full flex items-center justify-center text-muted-foreground transition-all hover:bg-accent hover:text-foreground"
          aria-label="Clear search"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
};

export default Search;