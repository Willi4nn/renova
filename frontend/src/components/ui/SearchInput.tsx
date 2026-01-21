import { Search } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = 'Buscar...',
  className = '',
}: SearchInputProps) {
  return (
    <div className={`relative flex-1 ${className}`}>
      <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400 sm:h-4 sm:w-4" />
      <input
        type="search"
        inputMode="search"
        placeholder={placeholder}
        className="h-11 w-full rounded-md border border-slate-200 py-2 pr-3 pl-10 placeholder:text-slate-400 focus:ring-2 sm:h-10 sm:text-sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
