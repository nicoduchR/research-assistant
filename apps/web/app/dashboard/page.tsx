'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/src/lib/store/authStore';
import { useResearchStore } from '@/src/lib/store/researchStore';
import { useDocumentStore } from '@/src/lib/store/documentStore';
import { useToastStore } from '@/src/lib/store/toastStore';
import { ScopeSetupModal } from '@/src/components/features/research/ScopeSetupModal';
import { KeywordSuggestionsPanel } from '@/src/components/features/research/KeywordSuggestionsPanel';
import { UploadZone } from '@/src/components/features/upload/UploadZone';
import { DocumentList } from '@/src/components/features/upload/DocumentList';
import { GenerateReviewButton } from '@/src/components/features/processing/GenerateReviewButton';
import { ProcessingProgressModal } from '@/src/components/features/processing/ProcessingProgressModal';
import { ToastContainer } from '@/src/components/molecules/Toast/ToastContainer';
import Header from '@/src/components/Header';
import { WS_EVENTS } from '@repo/types';
import type { AnalysisCompleteEvent, AnalysisErrorEvent } from '@repo/types';
import { connectSocket } from '@/src/lib/websocket-client';
import { listThesisQuestions } from '@/src/lib/api/thesis-questions';

export default function DashboardPage() {
  const { user, isLoading, isAuthenticated, initializeAuth } = useAuthStore();
  const { scope, hasCompletedSetup, fetchScope, isLoading: isScopeLoading } = useResearchStore();
  const { documents, fetchDocuments } = useDocumentStore();
  const addToast = useToastStore((state) => state.addToast);
  const [showScopeModal, setShowScopeModal] = useState(false);
  const [thesisProgress, setThesisProgress] = useState<{
    treated: number;
    total: number;
    nextQuestionCode: string | null;
  } | null>(null);

  useEffect(() => {
    // Initialize auth state on mount
    initializeAuth();
  }, [initializeAuth]);

  // Listen for analysis WebSocket events to auto-refresh document list
  useEffect(() => {
    if (!isAuthenticated) return;

    const socket = connectSocket();

    const handleAnalysisComplete = (payload: AnalysisCompleteEvent) => {
      fetchDocuments();
      addToast('Analyse du document terminee', 'success');
    };

    const handleAnalysisError = (payload: AnalysisErrorEvent) => {
      fetchDocuments();
      addToast('L\'analyse du document a echoue', 'error');
    };

    socket.on(WS_EVENTS.ANALYSIS_COMPLETE, handleAnalysisComplete);
    socket.on(WS_EVENTS.ANALYSIS_ERROR, handleAnalysisError);

    return () => {
      socket.off(WS_EVENTS.ANALYSIS_COMPLETE, handleAnalysisComplete);
      socket.off(WS_EVENTS.ANALYSIS_ERROR, handleAnalysisError);
    };
  }, [isAuthenticated, fetchDocuments, addToast]);

  useEffect(() => {
    // Once authenticated, check if user has completed research scope setup
    if (isAuthenticated && user) {
      fetchScope();
    }
  }, [isAuthenticated, user, fetchScope]);

  useEffect(() => {
    async function loadThesisProgress() {
      try {
        const questions = await listThesisQuestions();
        const treated = questions.filter((question) => question.status !== 'a_traiter');
        const nextQuestion =
          questions.find((question) => question.status !== 'validee') || null;

        setThesisProgress({
          treated: treated.length,
          total: questions.length,
          nextQuestionCode: nextQuestion?.code ?? null,
        });
      } catch {
        setThesisProgress(null);
      }
    }

    if (isAuthenticated && hasCompletedSetup) {
      loadThesisProgress();
    }
  }, [isAuthenticated, hasCompletedSetup]);

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

  const hasDocuments = documents.length > 0;

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

        {hasCompletedSetup && (
          <div className="mb-8">
            <KeywordSuggestionsPanel />
          </div>
        )}

        {hasCompletedSetup && (
          <div className="mb-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">help</span>
                  Questions de these (S1-S4)
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Redigez vos reponses Q1-Q12 avec preuves structurees et requetes EBSCO.
                </p>
              </div>

              <div className="text-right">
                <p className="text-xs text-slate-500 dark:text-slate-400">Progression</p>
                <p className="text-xl font-semibold text-slate-900 dark:text-white">
                  {thesisProgress?.treated ?? 0} / {thesisProgress?.total ?? 12}
                </p>
                {thesisProgress?.nextQuestionCode && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Prochaine question: {thesisProgress.nextQuestionCode}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3 flex-wrap">
              <button
                onClick={() => {
                  window.location.href = '/thesis-questions';
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 text-sm font-medium"
              >
                <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                Ouvrir le module Questions de these
              </button>
              {thesisProgress?.nextQuestionCode && (
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Focus recommande: {thesisProgress.nextQuestionCode}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Upload Zone - large when no documents, compact when documents exist */}
        <div className={hasDocuments ? 'mb-8' : 'mb-12'}>
          <UploadZone />
        </div>

        {/* Generate Literature Review Button */}
        {hasDocuments && (
          <div className="mb-8">
            <GenerateReviewButton />
          </div>
        )}

        {/* Document List */}
        <DocumentList />
      </main>

      {/* Processing Progress Modal */}
      <ProcessingProgressModal />

      {/* Global Toast Notifications */}
      <ToastContainer />
    </div>
  );
}
