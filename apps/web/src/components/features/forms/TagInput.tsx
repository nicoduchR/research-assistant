'use client';

import React, { useState, KeyboardEvent } from 'react';
import { Input } from '@/src/components/atoms/Input';
import { Badge } from '@/src/components/atoms/Badge';
import { cn } from '@/src/lib/utils';

export interface TagInputProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
  label?: string;
  error?: string;
  className?: string;
}

/**
 * TagInput - Add/remove tags with keyboard
 *
 * @example
 * ```tsx
 * <TagInput
 *   tags={keywords}
 *   onTagsChange={setKeywords}
 *   placeholder="Type and press Enter to add tag"
 *   maxTags={10}
 * />
 * ```
 */
export const TagInput: React.FC<TagInputProps> = ({
  tags,
  onTagsChange,
  placeholder = 'Type and press Enter to add',
  maxTags,
  label,
  error,
  className = '',
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      const newTag = inputValue.trim();

      // Check if tag already exists
      if (tags.includes(newTag)) {
        setInputValue('');
        return;
      }

      // Check max tags limit
      if (maxTags && tags.length >= maxTags) {
        setInputValue('');
        return;
      }

      onTagsChange([...tags, newTag]);
      setInputValue('');
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      // Remove last tag on backspace if input is empty
      e.preventDefault();
      onTagsChange(tags.slice(0, -1));
    }
  };

  const removeTag = (indexToRemove: number) => {
    onTagsChange(tags.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label className="block text-body font-medium text-text-primary mb-xs">
          {label}
        </label>
      )}

      <div
        className={cn(
          'min-h-[42px] p-xs border border-border rounded-md bg-white focus-within:ring-2 focus-within:ring-ring focus-within:border-primary transition-all duration-fast',
          error && 'border-error focus-within:ring-error/20'
        )}
      >
        <div className="flex flex-wrap gap-xs items-center">
          {tags.map((tag, index) => (
            <Badge
              key={index}
              variant="primary"
              className="flex items-center gap-xs py-1 px-2"
            >
              <span>{tag}</span>
              <button
                type="button"
                onClick={() => removeTag(index)}
                className="text-primary-foreground hover:text-white transition-colors"
                aria-label={`Remove tag ${tag}`}
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </Badge>
          ))}

          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={tags.length === 0 ? placeholder : ''}
            disabled={maxTags ? tags.length >= maxTags : false}
            className="flex-1 min-w-[120px] outline-none bg-transparent text-body text-text-primary placeholder-text-secondary px-xs py-1"
            aria-label={label || 'Tag input'}
          />
        </div>
      </div>

      {error && (
        <p className="text-sm text-error mt-1">{error}</p>
      )}

      {maxTags && (
        <p className="text-small text-text-secondary mt-1">
          {tags.length} / {maxTags} tags
        </p>
      )}
    </div>
  );
};

TagInput.displayName = 'TagInput';
