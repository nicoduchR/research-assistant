'use client';

import React, { useState } from 'react';
import { Input } from '@/src/components/atoms/Input';
import { Button } from '@/src/components/atoms/Button';
import { cn } from '@/src/lib/utils';

export interface DynamicListProps {
  items: string[];
  onItemsChange: (items: string[]) => void;
  placeholder?: string;
  maxItems?: number;
  label?: string;
  error?: string;
  className?: string;
}

/**
 * DynamicList - Add/remove text items with + and trash buttons
 *
 * @example
 * ```tsx
 * <DynamicList
 *   items={researchQuestions}
 *   onItemsChange={setResearchQuestions}
 *   placeholder="Enter research question"
 *   maxItems={10}
 *   label="Research Questions"
 * />
 * ```
 */
export const DynamicList: React.FC<DynamicListProps> = ({
  items,
  onItemsChange,
  placeholder = 'Enter item',
  maxItems,
  label,
  error,
  className = '',
}) => {
  const [inputValue, setInputValue] = useState('');

  const addItem = () => {
    const trimmedValue = inputValue.trim();
    if (!trimmedValue) return;

    // Check if item already exists
    if (items.includes(trimmedValue)) {
      setInputValue('');
      return;
    }

    // Check max items limit
    if (maxItems && items.length >= maxItems) {
      return;
    }

    onItemsChange([...items, trimmedValue]);
    setInputValue('');
  };

  const removeItem = (indexToRemove: number) => {
    onItemsChange(items.filter((_, index) => index !== indexToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addItem();
    }
  };

  const canAddMore = !maxItems || items.length < maxItems;

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label className="block text-body font-medium text-text-primary mb-xs">
          {label}
        </label>
      )}

      <div className="space-y-sm">
        {/* Item List */}
        {items.length > 0 && (
          <ul className="space-y-xs" role="list">
            {items.map((item, index) => (
              <li
                key={index}
                className="flex items-center gap-sm p-sm bg-muted rounded-md border border-border"
              >
                <span className="flex-1 text-body text-text-primary break-words">
                  {item}
                </span>
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="flex-shrink-0 p-xs text-text-secondary hover:text-error hover:bg-error/10 rounded-md transition-colors duration-fast"
                  aria-label={`Remove item: ${item}`}
                >
                  <span className="material-symbols-outlined text-xl">delete</span>
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Add Item Input */}
        {canAddMore && (
          <div className="flex gap-sm">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              className="flex-1"
              aria-label={label ? `Add ${label}` : 'Add item'}
            />
            <Button
              variant="primary"
              onClick={addItem}
              disabled={!inputValue.trim()}
              icon={<span className="material-symbols-outlined">add</span>}
              aria-label="Add item"
            >
              Add
            </Button>
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-error mt-1">{error}</p>
      )}

      {maxItems && (
        <p className="text-small text-text-secondary mt-1">
          {items.length} / {maxItems} items
        </p>
      )}
    </div>
  );
};

DynamicList.displayName = 'DynamicList';
