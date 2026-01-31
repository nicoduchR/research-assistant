'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/src/lib/store/authStore';
import { useResearchStore } from '@/src/lib/store/researchStore';
import { ScopeSetupModal } from '@/src/components/features/research/ScopeSetupModal';
import Header from '@/src/components/Header';

export default function DashboardPage() {
  const { user, isLoading, isAuthenticated, initializeAuth } = useAuthStore();
  const { scope, hasCompletedSetup, fetchScope, isLoading: isScopeLoading } = useResearchStore();
  const [showScopeModal, setShowScopeModal] = useState(false);

  useEffect(() => {
    // Initialize auth state on mount
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    // Once authenticated, check if user has completed research scope setup
    if (isAuthenticated && user) {
      fetchScope();
    }
  }, [isAuthenticated, user, fetchScope]);

  useEffect(() => {
    // Show scope setup modal if user hasn't completed setup
    // Only show after we've finished loading the scope
    if (!isScopeLoading && isAuthenticated && !hasCompletedSetup) {
      setShowScopeModal(true);
    } else {
      setShowScopeModal(false);
    }
  }, [isScopeLoading, isAuthenticated, hasCompletedSetup]);

  if (isLoading || isScopeLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Note: Middleware protects this route, so this component only renders if authenticated
  // User state should always be populated when this component mounts
  // Defensive check for TypeScript - should never be null due to middleware
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Show scope setup modal for first-time users */}
      <ScopeSetupModal isOpen={showScopeModal} />

      <Header />

      <main className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 ${showScopeModal ? 'pointer-events-none opacity-50 blur-sm' : ''}`}>
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Bienvenue, {user.name}!
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Votre espace de recherche est prêt. Commencez par télécharger vos documents ou continuez votre analyse.
          </p>
        </div>

        {/* Research Scope Display - Only show if scope exists */}
        {scope && hasCompletedSetup && (
          <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border-2 border-blue-200 dark:border-blue-800 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">
                    psychology
                  </span>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Votre recherche en cours
                  </h2>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Titre de recherche :
                    </p>
                    <p className="text-base font-semibold text-slate-900 dark:text-white">
                      {scope.title}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Problématique :
                    </p>
                    <p className="text-base text-slate-800 dark:text-slate-200 leading-relaxed">
                      {scope.problematique}
                    </p>
                  </div>

                  {scope.objectives && (
                    <div>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Objectifs :
                      </p>
                      <p className="text-base text-slate-800 dark:text-slate-200 leading-relaxed">
                        {scope.objectives}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <button
                className="ml-4 px-3 py-1.5 text-sm text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-md transition-colors flex items-center gap-1"
                onClick={() => {
                  // TODO: Implement edit scope functionality in future story
                  alert('La modification du scope sera disponible dans une prochaine version');
                }}
              >
                <span className="material-symbols-outlined text-[18px]">edit</span>
                Modifier
              </button>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white mb-4">
              <span className="material-symbols-outlined text-[24px]">cloud_upload</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              Upload Documents
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Upload PDF research papers to start your literature review
            </p>
            <button className="text-sm font-medium text-primary hover:underline">
              Get started →
            </button>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center text-white mb-4">
              <span className="material-symbols-outlined text-[24px]">analytics</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              Analyze Literature
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Use AI to synthesize themes and identify research gaps
            </p>
            <button className="text-sm font-medium text-primary hover:underline">
              Start analysis →
            </button>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white mb-4">
              <span className="material-symbols-outlined text-[24px]">edit_document</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              Write Review
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Generate your literature review with AI-powered assistance
            </p>
            <button className="text-sm font-medium text-primary hover:underline">
              Continue writing →
            </button>
          </div>
        </div>

        {/* Placeholder Content */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-[32px] text-slate-400">
                library_books
              </span>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              No documents yet
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Upload your first research paper to get started with your literature review
            </p>
            <button className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
              Upload Document
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
