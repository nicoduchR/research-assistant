'use client';

import { useEffect, useState } from 'react';
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
    keywordSuggestionRuns,
    fetchKeywordSuggestions,
    hydrateLatestKeywordSuggestions,
    fetchKeywordSuggestionHistory,
    selectKeywordSuggestionRun,
    deleteKeywordSuggestionRun,
    createScope,
  } = useResearchStore();

  const [historyOpen, setHistoryOpen] = useState(false);
  const [deletingRunId, setDeletingRunId] = useState<string | null>(null);
  const [isEditingTheme, setIsEditingTheme] = useState(false);
  const [themeDraft, setThemeDraft] = useState('');
  const [isSavingTheme, setIsSavingTheme] = useState(false);

  useEffect(() => {
    if (!scope) {
      return;
    }
    void hydrateLatestKeywordSuggestions();
    void fetchKeywordSuggestionHistory();
  }, [scope?.id, hydrateLatestKeywordSuggestions, fetchKeywordSuggestionHistory]);

  const analyzedDocumentCount = documents.filter(
    (document) => document.analysisStatus === 'completed',
  ).length;

  const activeTheme = scope?.personalTheme?.trim() || null;

  const handleStartEditingTheme = () => {
    setThemeDraft(scope?.personalTheme ?? '');
    setIsEditingTheme(true);
  };

  const handleSaveTheme = async () => {
    if (!scope) return;
    setIsSavingTheme(true);
    try {
      await createScope({
        title: scope.title,
        problematique: scope.problematique,
        objectives: scope.objectives ?? undefined,
        personalTheme: themeDraft.trim() || null,
      });
      addToast('Theme personnel mis a jour', 'success');
      setIsEditingTheme(false);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Mise a jour impossible';
      addToast(message, 'error');
    } finally {
      setIsSavingTheme(false);
    }
  };

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

  const handleSelectRun = async (runId: string) => {
    if (keywordSuggestions?.id === runId) {
      return;
    }
    await selectKeywordSuggestionRun(runId);
  };

  const handleDeleteRun = async (runId: string) => {
    if (
      typeof window !== 'undefined' &&
      !window.confirm('Supprimer cette generation de suggestions ?')
    ) {
      return;
    }
    try {
      setDeletingRunId(runId);
      await deleteKeywordSuggestionRun(runId);
      addToast('Generation supprimee', 'success');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Suppression impossible';
      addToast(message, 'error');
    } finally {
      setDeletingRunId(null);
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
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span>Documents detectes: {documents.length}</span>
            <span>|</span>
            <span>Documents analyses: {analyzedDocumentCount}</span>
            {activeTheme && !isEditingTheme && (
              <span className="inline-flex items-center gap-1 rounded-full bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-200 px-2 py-0.5 font-medium">
                <span className="material-symbols-outlined text-[14px]">tune</span>
                Lentille : {activeTheme}
              </span>
            )}
            {scope && !isEditingTheme && (
              <button
                type="button"
                onClick={handleStartEditingTheme}
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
              >
                <span className="material-symbols-outlined text-[14px]">edit</span>
                {activeTheme ? 'Modifier le theme' : 'Definir un theme personnel'}
              </button>
            )}
          </div>

          {isEditingTheme && (
            <div className="mt-3 flex flex-col sm:flex-row items-stretch gap-2 rounded-lg border border-slate-200 dark:border-slate-700 p-3 bg-slate-50 dark:bg-slate-800/40">
              <div className="flex-1">
                <input
                  type="text"
                  value={themeDraft}
                  onChange={(event) => setThemeDraft(event.target.value)}
                  maxLength={200}
                  placeholder="ex. Transformation Digitale"
                  className="w-full px-3 py-1.5 text-sm rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-primary"
                  disabled={isSavingTheme}
                />
                <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                  Oriente uniquement les suggestions de mots-cles EBSCO. Laissez vide pour retirer la lentille.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSaveTheme}
                  disabled={isSavingTheme}
                  className="px-3 py-1.5 rounded-md bg-primary text-white text-xs font-medium hover:bg-primary/90 disabled:opacity-60"
                >
                  {isSavingTheme ? 'Enregistrement...' : 'Enregistrer'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingTheme(false)}
                  disabled={isSavingTheme}
                  className="px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  Annuler
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col items-stretch md:items-end gap-2">
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
          {keywordSuggestionRuns.length > 0 && (
            <button
              type="button"
              onClick={() => setHistoryOpen((open) => !open)}
              className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">history</span>
              Historique ({keywordSuggestionRuns.length})
              <span className="material-symbols-outlined text-[16px]">
                {historyOpen ? 'expand_less' : 'expand_more'}
              </span>
            </button>
          )}
        </div>
      </div>

      {historyOpen && keywordSuggestionRuns.length > 0 && (
        <div className="mt-4 rounded-lg border border-slate-200 dark:border-slate-700 divide-y divide-slate-200 dark:divide-slate-700">
          {keywordSuggestionRuns.map((run) => {
            const isCurrent = run.id === keywordSuggestions?.id;
            return (
              <div
                key={run.id}
                className={`flex flex-wrap items-center justify-between gap-2 px-3 py-2 text-sm ${isCurrent ? 'bg-primary/5' : ''}`}
              >
                <button
                  type="button"
                  onClick={() => handleSelectRun(run.id)}
                  className="flex-1 text-left"
                >
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {formatGeneratedAt(run.generatedAt)}
                  </span>
                  <span className="ml-2 text-xs text-slate-500 dark:text-slate-400">
                    {run.suggestionCount} suggestion(s)
                  </span>
                  {run.themeUsed && (
                    <span className="ml-2 inline-flex items-center rounded-full bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-200 px-2 py-0.5 text-xs">
                      {run.themeUsed}
                    </span>
                  )}
                  {isCurrent && (
                    <span className="ml-2 text-xs text-primary">(affichee)</span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteRun(run.id)}
                  disabled={deletingRunId === run.id}
                  className="inline-flex items-center justify-center gap-1 text-xs px-2 py-1 rounded-md text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-60 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">delete</span>
                  Supprimer
                </button>
              </div>
            );
          })}
        </div>
      )}

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
            {keywordSuggestions.themeUsed && (
              <>
                {' '}| Lentille : <span className="font-medium">{keywordSuggestions.themeUsed}</span>
              </>
            )}
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
