'use client';

import { useAuthStore } from '@/src/lib/store/authStore';

export default function Header() {
  const { user, logout } = useAuthStore();

  const handleSignOut = async () => {
    await logout();
  };

  if (!user) {
    return null;
  }

  return (
    <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/30">
              <span className="material-symbols-outlined text-[24px]">school</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                ResearchAI
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Literature Review Assistant
              </p>
            </div>
          </div>

          {/* User Info and Actions */}
          <div className="flex items-center gap-4">
            {/* User Avatar and Info */}
            <div className="flex items-center gap-3">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-10 h-10 rounded-full border-2 border-slate-200 dark:border-slate-700"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-semibold text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  {user.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {user.email}
                </p>
              </div>
            </div>

            {/* Sign Out Button */}
            <button
              onClick={handleSignOut}
              className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
