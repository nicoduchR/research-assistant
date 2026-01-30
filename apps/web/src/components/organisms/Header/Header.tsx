import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../../atoms/Button/Button';
import { Badge } from '../../atoms/Badge/Badge';

export interface HeaderProps {
  userName?: string;
  userRole?: string;
  notificationCount?: number;
  messageCount?: number;
  onNotificationClick?: () => void;
  onMessageClick?: () => void;
  onSignOut?: () => void;
  onProfileClick?: () => void;
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({
  userName = 'User',
  userRole = 'Researcher',
  notificationCount = 0,
  messageCount = 0,
  onNotificationClick,
  onMessageClick,
  onSignOut,
  onProfileClick,
  className = '',
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen]);

  const handleProfileToggle = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleProfileMenuClick = () => {
    if (onProfileClick) {
      onProfileClick();
    }
    setIsProfileOpen(false);
  };

  const handleSignOut = () => {
    if (onSignOut) {
      onSignOut();
    }
    setIsProfileOpen(false);
  };

  return (
    <header
      className={`bg-white border-b border-border px-lg py-md shadow-subtle ${className}`}
      role="banner"
    >
      <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
        {/* Logo/Brand */}
        <div className="flex items-center gap-md">
          <div className="flex items-center gap-sm">
            <span className="material-symbols-outlined text-primary text-3xl">
              science
            </span>
            <span className="text-h6 font-bold text-primary hidden md:inline">
              ResearchAI
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-sm">
          {/* Notification Button */}
          <div className="relative hidden sm:block">
            <Button
              variant="icon"
              size="md"
              onClick={onNotificationClick}
              aria-label={`Notifications${notificationCount > 0 ? ` (${notificationCount} unread)` : ''}`}
              icon={
                <span className="material-symbols-outlined">notifications</span>
              }
            />
            {notificationCount > 0 && (
              <Badge
                variant="error"
                size="sm"
                className="absolute -top-1 -right-1 min-w-[20px] h-5 flex items-center justify-center text-xs"
              >
                {notificationCount > 99 ? '99+' : notificationCount}
              </Badge>
            )}
          </div>

          {/* Message Button */}
          <div className="relative hidden sm:block">
            <Button
              variant="icon"
              size="md"
              onClick={onMessageClick}
              aria-label={`Messages${messageCount > 0 ? ` (${messageCount} unread)` : ''}`}
              icon={
                <span className="material-symbols-outlined">mail</span>
              }
            />
            {messageCount > 0 && (
              <Badge
                variant="error"
                size="sm"
                className="absolute -top-1 -right-1 min-w-[20px] h-5 flex items-center justify-center text-xs"
              >
                {messageCount > 99 ? '99+' : messageCount}
              </Badge>
            )}
          </div>

          {/* User Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={handleProfileToggle}
              className="flex items-center gap-sm p-xs rounded-md hover:bg-muted transition-colors duration-fast"
              aria-expanded={isProfileOpen}
              aria-haspopup="true"
              aria-label="User menu"
            >
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-xl">
                  person
                </span>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-small font-medium text-text-primary">
                  {userName}
                </p>
                <p className="text-xs text-text-secondary">{userRole}</p>
              </div>
              <span
                className={`material-symbols-outlined text-text-secondary transition-transform duration-fast ${
                  isProfileOpen ? 'rotate-180' : ''
                }`}
              >
                expand_more
              </span>
            </button>

            {/* Dropdown Menu */}
            {isProfileOpen && (
              <div
                className="absolute right-0 mt-sm w-56 bg-white border border-border rounded-md shadow-medium py-xs z-50"
                role="menu"
              >
                <button
                  onClick={handleProfileMenuClick}
                  className="w-full flex items-center gap-sm px-md py-sm text-left text-body text-text-primary hover:bg-muted transition-colors duration-fast"
                  role="menuitem"
                >
                  <span className="material-symbols-outlined text-xl">
                    account_circle
                  </span>
                  <span>View Profile</span>
                </button>
                <button
                  className="w-full flex items-center gap-sm px-md py-sm text-left text-body text-text-primary hover:bg-muted transition-colors duration-fast"
                  role="menuitem"
                >
                  <span className="material-symbols-outlined text-xl">
                    settings
                  </span>
                  <span>Settings</span>
                </button>
                <div className="border-t border-border my-xs" role="separator" />
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-sm px-md py-sm text-left text-body text-error hover:bg-error/5 transition-colors duration-fast"
                  role="menuitem"
                >
                  <span className="material-symbols-outlined text-xl">
                    logout
                  </span>
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

Header.displayName = 'Header';
