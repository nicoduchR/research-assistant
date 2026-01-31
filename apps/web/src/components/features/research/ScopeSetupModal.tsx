'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ResearchScopeForm } from './ResearchScopeForm';
import { useResearchStore } from '@/src/lib/store/researchStore';
import { CreateResearchScopeDto } from '@repo/types';
import { ErrorBoundary } from '@/src/components/ErrorBoundary';

interface ScopeSetupModalProps {
  isOpen: boolean;
}

export function ScopeSetupModal({ isOpen }: ScopeSetupModalProps) {
  const router = useRouter();
  const { createScope, isLoading, error, setError } = useResearchStore();
  const [submitError, setSubmitError] = useState<string | null>(null);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (data: CreateResearchScopeDto) => {
    try {
      setSubmitError(null);
      await createScope(data);
      // Success - scope is now stored in Zustand
      // Allow access to dashboard
      router.refresh(); // Refresh to re-check scope status
    } catch (error: any) {
      setSubmitError(error.message || 'Failed to save research scope');
    }
  };

  return (
    <ErrorBoundary
      fallback={
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-red-600">error</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Une erreur est survenue
              </h3>
              <p className="text-gray-600 mb-4">
                Le formulaire de configuration a rencontré un problème. Veuillez rafraîchir la page.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                Rafraîchir la page
              </button>
            </div>
          </div>
        </div>
      }
    >
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={(e) => e.stopPropagation()} // Prevent closing by clicking outside
      >
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
             onClick={(e) => e.stopPropagation()}>
          <div className="p-6">
            <div className="mb-6">
              <div className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full mb-3">
                Configuration initiale requise
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Définissez votre scope de recherche
              </h2>
              <p className="text-gray-600 mb-4">
                Avant de commencer, nous avons besoin de comprendre votre problématique de recherche.
                Cela permettra à l&apos;IA de générer une revue de littérature pertinente et alignée avec vos objectifs.
              </p>
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      <strong>Prochaines étapes :</strong> Après avoir défini votre scope, vous pourrez télécharger vos documents PDF et générer votre revue de littérature automatiquement.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {(error || submitError) && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error || submitError}</p>
              </div>
            )}

            <ResearchScopeForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
