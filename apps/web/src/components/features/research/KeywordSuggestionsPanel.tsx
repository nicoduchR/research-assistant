'use client';

import type { KeywordSuggestion } from '@repo/types';
import { useDocumentStore } from '@/src/lib/store/documentStore';
import { useResearchStore } from '@/src/lib/store/researchStore';
import { useToastStore } from '@/src/lib/store/toastStore';

const intentConfig: Record<
  KeywordSuggestion['intent'],
  { label: string; badgeClass: string }
> = {
  broaden: {
    label: 'Elargir',
    badgeClass: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  },
  deepen: {
    label: 'Approfondir',
    badgeClass:
      'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300',
  },
  complementary: {
    label: 'Complementaire',
    badgeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
  },
  methodology: {
    label: 'Methodo',
    badgeClass:
      'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  },
  emerging: {
    label: 'Emergent',
    badgeClass:
      'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/40 dark:text-fuchsia-300',
  },
};

function formatGeneratedAt(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Date inconnue';
  }
  return date.toLocaleString('fr-FR');
}

export function KeywordSuggestionsPanel() {
  const documents = useDocumentStore((state) => state.documents);
  const addToast = useToastStore((state) => state.addToast);
  const {
    scope,
    keywordSuggestions,
    isKeywordSuggestionsLoading,
    keywordSuggestionsError,
    fetchKeywordSuggestions,
  } = useResearchStore();

  const analyzedDocumentCount = documents.filter(
    (document) => document.analysisStatus === 'completed',
  ).length;

  const handleGenerateSuggestions = async () => {
    try {
      const response = await fetchKeywordSuggestions();
      if (response.suggestions.length > 0) {
        addToast('Suggestions de mots-cles generees', 'success');
      } else {
        addToast('Aucune suggestion pertinente n’a ete generee', 'warning');
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Impossible de generer des suggestions de mots-cles';
      addToast(message, 'error');
    }
  };

  const copyToClipboard = async (value: string, successMessage: string) => {
    try {
      if (typeof navigator === 'undefined' || !navigator.clipboard) {
        throw new Error('Clipboard unavailable');
      }
      await navigator.clipboard.writeText(value);
      addToast(successMessage, 'success');
    } catch {
      addToast('Impossible de copier dans le presse-papiers', 'error');
    }
  };

  return (
    <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-primary text-[22px]">
              manage_search
            </span>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Suggestions de mots-cles (EBSCO)
            </h2>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Generez des mots-cles complementaires a partir de votre problématique,
            des articles deja importes, et des citations issues des analyses.
          </p>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Documents detectes: {documents.length} | Documents analyses: {analyzedDocumentCount}
          </p>
        </div>

        <button
          onClick={handleGenerateSuggestions}
          disabled={isKeywordSuggestionsLoading || !scope}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {isKeywordSuggestionsLoading ? (
            <>
              <span className="material-symbols-outlined animate-spin text-[18px]">
                progress_activity
              </span>
              Analyse en cours...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
              {keywordSuggestions ? 'Regenerer' : 'Generer des suggestions'}
            </>
          )}
        </button>
      </div>

      {keywordSuggestionsError && (
        <div className="mt-4 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-3">
          <p className="text-sm text-red-700 dark:text-red-300">{keywordSuggestionsError}</p>
        </div>
      )}

      {keywordSuggestions && keywordSuggestions.suggestions.length > 0 && (
        <div className="mt-6 space-y-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Derniere generation: {formatGeneratedAt(keywordSuggestions.generatedAt)} | Basee sur{' '}
            {keywordSuggestions.basedOn.documentCount} document(s),{' '}
            {keywordSuggestions.basedOn.analyzedDocumentCount} analyse(s),{' '}
            {keywordSuggestions.basedOn.citationCount} citation(s)
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            {keywordSuggestions.suggestions.map((suggestion, index) => {
              const config = intentConfig[suggestion.intent] || intentConfig.complementary;
              return (
                <article
                  key={`${suggestion.keyword}-${index}`}
                  className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40 p-4"
                >
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {suggestion.keyword}
                    </p>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${config.badgeClass}`}
                    >
                      {config.label}
                    </span>
                  </div>

                  <p className="text-sm text-slate-700 dark:text-slate-300 mb-3">
                    {suggestion.rationale}
                  </p>

                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Piste de problématique:
                  </p>
                  <p className="text-sm text-slate-700 dark:text-slate-300 mb-3">
                    {suggestion.relatedQuestion}
                  </p>

                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Requete EBSCO:
                  </p>
                  <div className="rounded-md bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-3 py-2">
                    <code className="text-xs text-slate-800 dark:text-slate-200 break-words">
                      {suggestion.ebscoQuery}
                    </code>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <button
                      onClick={() =>
                        copyToClipboard(suggestion.keyword, 'Mot-cle copie')
                      }
                      className="text-xs px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    >
                      Copier mot-cle
                    </button>
                    <button
                      onClick={() =>
                        copyToClipboard(suggestion.ebscoQuery, 'Requete EBSCO copiee')
                      }
                      className="text-xs px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    >
                      Copier requete
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}

      {!keywordSuggestions && !isKeywordSuggestionsLoading && (
        <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
          Lancez la generation pour obtenir des mots-cles complementaires et des
          requetes prêtes a coller dans EBSCO.
        </p>
      )}
    </section>
  );
}
