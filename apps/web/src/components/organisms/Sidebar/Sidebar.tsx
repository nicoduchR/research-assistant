import React from 'react';
import { Button } from '../../atoms/Button/Button';
import { Badge } from '../../atoms/Badge/Badge';

export interface SidebarProject {
  id: string;
  name: string;
  count?: number;
  icon?: string;
}

export interface SidebarProps {
  currentPath?: string;
  projects?: SidebarProject[];
  onNavigate?: (path: string) => void;
  userName?: string;
  userRole?: string;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPath = '/',
  projects = [],
  onNavigate,
  userName = 'User',
  userRole = 'Researcher',
  className = '',
}) => {
  const handleNavigate = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    }
  };

  const isActive = (path: string) => currentPath === path;

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { path: '/projects', label: 'Projects', icon: 'folder' },
    { path: '/documents', label: 'Documents', icon: 'description' },
    { path: '/analysis', label: 'Analysis', icon: 'analytics' },
    { path: '/settings', label: 'Settings', icon: 'settings' },
  ];

  const smartFolders = [
    { path: '/recent', label: 'Recent', icon: 'schedule', count: 12 },
    { path: '/favorites', label: 'Favorites', icon: 'star', count: 8 },
    { path: '/shared', label: 'Shared with me', icon: 'group', count: 3 },
  ];

  return (
    <aside
      className={`flex flex-col h-full bg-white border-r border-border w-64 ${className}`}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Brand */}
      <div className="flex items-center gap-sm px-lg py-lg border-b border-border">
        <span className="material-symbols-outlined text-primary text-3xl">
          science
        </span>
        <span className="text-h6 font-bold text-primary">ResearchAI</span>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto py-md">
        <div className="px-md space-y-xs">
          <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider px-md py-xs">
            Main Menu
          </p>
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigate(item.path)}
              className={`w-full flex items-center gap-md px-md py-sm rounded-md text-body font-medium transition-all duration-fast ${
                isActive(item.path)
                  ? 'bg-primary text-primary-foreground shadow-subtle'
                  : 'text-text-primary hover:bg-muted'
              }`}
              aria-current={isActive(item.path) ? 'page' : undefined}
            >
              <span className="material-symbols-outlined text-xl">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Smart Folders */}
        <div className="px-md mt-lg space-y-xs">
          <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider px-md py-xs">
            Smart Folders
          </p>
          {smartFolders.map((folder) => (
            <button
              key={folder.path}
              onClick={() => handleNavigate(folder.path)}
              className={`w-full flex items-center gap-md px-md py-sm rounded-md text-body font-medium transition-all duration-fast ${
                isActive(folder.path)
                  ? 'bg-primary text-primary-foreground shadow-subtle'
                  : 'text-text-primary hover:bg-muted'
              }`}
              aria-current={isActive(folder.path) ? 'page' : undefined}
            >
              <span className="material-symbols-outlined text-xl">
                {folder.icon}
              </span>
              <span className="flex-1 text-left">{folder.label}</span>
              {folder.count !== undefined && (
                <Badge
                  variant={isActive(folder.path) ? 'primary' : 'neutral'}
                  size="sm"
                >
                  {folder.count}
                </Badge>
              )}
            </button>
          ))}
        </div>

        {/* Projects */}
        {projects.length > 0 && (
          <div className="px-md mt-lg space-y-xs">
            <div className="flex items-center justify-between px-md py-xs">
              <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                Projects
              </p>
              <Button
                variant="icon"
                size="sm"
                aria-label="Add project"
                icon={
                  <span className="material-symbols-outlined text-sm">add</span>
                }
              />
            </div>
            {projects.map((project) => (
              <button
                key={project.id}
                onClick={() => handleNavigate(`/projects/${project.id}`)}
                className={`w-full flex items-center gap-md px-md py-sm rounded-md text-body font-medium transition-all duration-fast ${
                  isActive(`/projects/${project.id}`)
                    ? 'bg-primary text-primary-foreground shadow-subtle'
                    : 'text-text-primary hover:bg-muted'
                }`}
                aria-current={
                  isActive(`/projects/${project.id}`) ? 'page' : undefined
                }
              >
                <span className="material-symbols-outlined text-xl">
                  {project.icon || 'folder'}
                </span>
                <span className="flex-1 text-left truncate">{project.name}</span>
                {project.count !== undefined && (
                  <Badge
                    variant={
                      isActive(`/projects/${project.id}`)
                        ? 'primary'
                        : 'neutral'
                    }
                    size="sm"
                  >
                    {project.count}
                  </Badge>
                )}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* User Profile at Bottom */}
      <div className="border-t border-border p-md">
        <div className="flex items-center gap-md p-sm rounded-md hover:bg-muted transition-colors duration-fast cursor-pointer">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-primary text-xl">
              person
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-body font-medium text-text-primary truncate">
              {userName}
            </p>
            <p className="text-small text-text-secondary truncate">{userRole}</p>
          </div>
          <span className="material-symbols-outlined text-text-secondary text-xl">
            more_vert
          </span>
        </div>
      </div>
    </aside>
  );
};

Sidebar.displayName = 'Sidebar';
