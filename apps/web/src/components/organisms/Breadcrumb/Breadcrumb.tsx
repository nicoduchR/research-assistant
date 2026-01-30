import React from 'react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  currentPage?: string;
  onNavigate?: (href: string) => void;
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  currentPage,
  onNavigate,
  className = '',
}) => {
  const handleClick = (e: React.MouseEvent, href?: string) => {
    if (href && onNavigate) {
      e.preventDefault();
      onNavigate(href);
    }
  };

  const allItems = currentPage ? [...items, { label: currentPage }] : items;

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center gap-xs text-body ${className}`}
      role="navigation"
    >
      <ol className="flex items-center gap-xs flex-wrap">
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;
          const isClickable = item.href && !isLast;

          return (
            <li key={index} className="flex items-center gap-xs">
              {isClickable ? (
                <a
                  href={item.href}
                  onClick={(e) => handleClick(e, item.href)}
                  className="text-text-secondary hover:text-primary transition-colors duration-fast"
                  aria-label={`Navigate to ${item.label}`}
                >
                  {item.label}
                </a>
              ) : (
                <span
                  className={`${
                    isLast
                      ? 'text-text-primary font-semibold'
                      : 'text-text-secondary'
                  }`}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}
              {!isLast && (
                <span
                  className="material-symbols-outlined text-text-secondary text-lg"
                  aria-hidden="true"
                >
                  chevron_right
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

Breadcrumb.displayName = 'Breadcrumb';
