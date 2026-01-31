'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function LandingPage() {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    // Get error message from URL query params
    const errorParam = searchParams.get('error');
    if (errorParam) {
      setError(errorParam);
    }

    // Get success message from URL query params
    const loggedOutParam = searchParams.get('loggedOut');
    if (loggedOutParam === 'true') {
      setSuccessMessage('You have been signed out successfully');
    }
  }, [searchParams]);

  const handleSignIn = () => {
    // Redirect to backend OAuth flow
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    window.location.href = `${apiUrl}/api/v1/auth/google`;
  };

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/30">
              <span className="material-symbols-outlined text-[28px]">school</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                ResearchAI
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
                AI-powered literature review generation tool
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Welcome Section */}
          <div className="text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-[48px] text-primary">
                school
              </span>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
              Welcome to ResearchAI
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Transform your research workflow with AI-powered literature review generation.
              Upload PDFs, analyze themes, and generate comprehensive reviews with proper citations.
            </p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-[20px] mt-0.5">
                  check_circle
                </span>
                <div className="flex-1">
                  <p className="text-sm text-green-800 dark:text-green-200">{successMessage}</p>
                </div>
                <button
                  onClick={() => setSuccessMessage(null)}
                  className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-[20px] mt-0.5">
                  error
                </span>
                <div className="flex-1">
                  <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                </div>
                <button
                  onClick={() => setError(null)}
                  className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
            </div>
          )}

          {/* Sign In Button */}
          <div className="space-y-4">
            <button
              onClick={handleSignIn}
              className="w-full flex items-center justify-center gap-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-6 py-3 text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Sign in with Google
            </button>

            <p className="text-xs text-center text-slate-500 dark:text-slate-400">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>

          {/* Features */}
          <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4 text-center">
              What you can do with ResearchAI
            </h3>
            <div className="space-y-3">
              {[
                { icon: 'cloud_upload', text: 'Upload and manage research papers' },
                { icon: 'analytics', text: 'AI-powered literature synthesis' },
                { icon: 'search', text: 'Identify research gaps automatically' },
                { icon: 'format_quote', text: 'Generate proper citations instantly' },
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                  <span className="material-symbols-outlined text-primary text-[20px]">
                    {feature.icon}
                  </span>
                  <span>{feature.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-slate-600 dark:text-slate-400">
            Built with Next.js 15, TypeScript, and Tailwind CSS
          </p>
        </div>
      </footer>
    </main>
  );
}
