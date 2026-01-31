import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges class names using clsx and tailwind-merge
 * Handles conditional classes and resolves Tailwind class conflicts
 *
 * @example
 * cn('px-4 py-2', isDark && 'bg-black', 'bg-white') // 'px-4 py-2 bg-black' (bg-black overrides bg-white)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
