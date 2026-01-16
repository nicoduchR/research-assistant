// Shared utility functions for the monorepo
// This file will be populated with utilities as needed

export function formatDate(date: Date): string {
  return date.toISOString();
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
