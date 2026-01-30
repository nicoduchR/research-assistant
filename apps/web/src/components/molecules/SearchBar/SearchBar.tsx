import React from 'react';
import { Input } from '../../atoms/Input/Input';
import { Button } from '../../atoms/Button/Button';

export interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch?: () => void;
  showSearchButton?: boolean;
  disabled?: boolean;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search...',
  value,
  onChange,
  onSearch,
  showSearchButton = false,
  disabled = false,
  className = '',
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch();
    }
  };

  return (
    <div className={`flex items-center gap-sm ${className}`}>
      <div className="flex-1 relative">
        <Input
          type="search"
          placeholder={placeholder}
          value={value}
          onChange={onChange as any}
          onKeyDown={handleKeyDown as any}
          disabled={disabled}
          icon={
            <span className="material-symbols-outlined text-xl">search</span>
          }
          iconPosition="left"
          aria-label="Search input"
        />
      </div>

      {showSearchButton && onSearch && (
        <Button
          variant="primary"
          size="md"
          onClick={onSearch}
          disabled={disabled}
          icon={<span className="material-symbols-outlined">search</span>}
          aria-label="Search"
        >
          Search
        </Button>
      )}
    </div>
  );
};

SearchBar.displayName = 'SearchBar';
