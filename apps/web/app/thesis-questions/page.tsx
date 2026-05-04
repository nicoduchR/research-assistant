'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type {
  EbscoQueryResponse,
  ThesisAnswerDraft,
  ThesisQuestion,
  ThesisQuestionStatus,
} from '@repo/types';
import Header from '@/src/components/Header';
import {
  bootstrapThesisQuestions,
  generateThesisAnswer,
  generateThesisEbscoQueries,
  getThesisDraft,
  saveThesisDraft,
  updateThesisQuestion,
} from '@/src/lib/api/thesis-questions';
import { useToastStore } from '@/src/lib/store/toastStore';
import { ToastContainer } from '@/src/components/molecules/Toast/ToastContainer';

type TabKey = 'answer' | 'evidence' | 'ebsco';

const STATUS_LABEL: Record<ThesisQuestionStatus, string> = {
  a_traiter: 'A traiter',
  en_cours: 'En cours',
  brouillon: 'Brouillon',
  validee: 'Validee',
};

const STATUS_COLOR: Record<ThesisQuestionStatus, string> = {
  a_traiter: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200',
  en_cours: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  brouillon:
    'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  validee:
    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
};

function formatDate(value: string | null): string {
  if (!value) {
    return 'Jamais';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Date inconnue';
  }
  return date.toLocaleString('fr-FR');
}

export default function ThesisQuestionsPage() {
  const router = useRouter();
  const addToast = useToastStore((state) => state.addToast);

  const [isLoading, setIsLoading] = useState(true);
  const [questions, setQuestions] = useState<ThesisQuestion[]>([]);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(
    null,
  );
  const [activeTab, setActiveTab] = useState<TabKey>('answer');
  const [statusFilter, setStatusFilter] = useState<'all' | ThesisQuestionStatus>(
    'all',
  );
  const [sectionFilter, setSectionFilter] = useState<'all' | 'S1' | 'S2' | 'S3' | 'S4'>(
    'all',
  );
  const [draftByQuestion, setDraftByQuestion] = useState<
    Record<string, ThesisAnswerDraft | null>
  >({});
  const [queriesByQuestion, setQueriesByQuestion] = useState<
    Record<string, EbscoQueryResponse | null>
  >({});
  const [answerEditor, setAnswerEditor] = useState('');
  const [questionEditor, setQuestionEditor] = useState('');
  const [isGeneratingAnswer, setIsGeneratingAnswer] = useState(false);
  const [isGeneratingQueries, setIsGeneratingQueries] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isSavingQuestion, setIsSavingQuestion] = useState(false);

  const selectedQuestion = useMemo(
    () => questions.find((question) => question.id === selectedQuestionId) ?? null,
    [questions, selectedQuestionId],
  );

  const selectedDraft = selectedQuestionId
    ? draftByQuestion[selectedQuestionId] ?? null
    : null;
  const selectedQueries = selectedQuestionId
    ? queriesByQuestion[selectedQuestionId] ?? null
    : null;

  const filteredQuestions = useMemo(() => {
    return questions.filter((question) => {
      if (statusFilter !== 'all' && question.status !== statusFilter) {
        return false;
      }
      if (sectionFilter !== 'all' && question.section !== sectionFilter) {
        return false;
      }
      return true;
    });
  }, [questions, sectionFilter, statusFilter]);

  const progress = useMemo(() => {
    const treated = questions.filter((question) => question.status !== 'a_traiter');
    return {
      treated: treated.length,
      total: questions.length,
    };
  }, [questions]);

  const loadInitialData = useCallback(async () => {
    setIsLoading(true);
    try {
      const bootstrapped = await bootstrapThesisQuestions();
      setQuestions(bootstrapped);

      if (bootstrapped.length > 0) {
        const nextQuestion =
          bootstrapped.find((question) => question.status !== 'validee') ||
          bootstrapped[0];
        setSelectedQuestionId(nextQuestion.id);
        setQuestionEditor(nextQuestion.questionText);
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        'Impossible de charger les questions de these.';
      addToast(message, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  useEffect(() => {
    if (selectedQuestion) {
      setQuestionEditor(selectedQuestion.questionText);
    }
  }, [selectedQuestion?.id]);

  useEffect(() => {
    async function loadDraft(questionId: string) {
      if (Object.prototype.hasOwnProperty.call(draftByQuestion, questionId)) {
        const existingDraft = draftByQuestion[questionId];
        setAnswerEditor(existingDraft?.answerMarkdown || '');
        return;
      }

      try {
        const draft = await getThesisDraft(questionId);
        setDraftByQuestion((previous) => ({
          ...previous,
          [questionId]: draft,
        }));
        setAnswerEditor(draft?.answerMarkdown || '');
      } catch {
        addToast('Impossible de charger le brouillon.', 'error');
      }
    }

    if (selectedQuestionId) {
      loadDraft(selectedQuestionId);
    }
  }, [selectedQuestionId, draftByQuestion, addToast]);

  const updateQuestionInList = useCallback((updated: ThesisQuestion) => {
    setQuestions((previous) =>
      previous.map((question) =>
        question.id === updated.id ? updated : question,
      ),
    );
  }, []);

  const handleStatusChange = async (status: ThesisQuestionStatus) => {
    if (!selectedQuestion) {
      return;
    }

    try {
      const updated = await updateThesisQuestion(selectedQuestion.id, { status });
      updateQuestionInList(updated);
      addToast('Statut mis a jour.', 'success');
    } catch {
      addToast('Impossible de mettre a jour le statut.', 'error');
    }
  };

  const handleSaveQuestionText = async () => {
    if (!selectedQuestion) {
      return;
    }

    setIsSavingQuestion(true);
    try {
      const updated = await updateThesisQuestion(selectedQuestion.id, {
        questionText: questionEditor,
      });
      updateQuestionInList(updated);
      addToast('Question mise a jour.', 'success');
    } catch {
      addToast('Impossible de mettre a jour la question.', 'error');
    } finally {
      setIsSavingQuestion(false);
    }
  };

  const handleGenerateAnswer = async () => {
    if (!selectedQuestionId) {
      return;
    }

    setIsGeneratingAnswer(true);
    try {
      const draft = await generateThesisAnswer(selectedQuestionId);
      setDraftByQuestion((previous) => ({
        ...previous,
        [selectedQuestionId]: draft,
      }));
      setAnswerEditor(draft.answerMarkdown);
      setQuestions((previous) =>
        previous.map((question) =>
          question.id === selectedQuestionId
            ? { ...question, status: 'brouillon' }
            : question,
        ),
      );
      addToast('Reponse generee avec succes.', 'success');
      setActiveTab('answer');
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        'Impossible de generer la reponse pour cette question.';
      addToast(message, 'error');
    } finally {
      setIsGeneratingAnswer(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!selectedQuestionId) {
      return;
    }

    const currentDraft = draftByQuestion[selectedQuestionId];

    setIsSavingDraft(true);
    try {
      const draft = await saveThesisDraft(selectedQuestionId, {
        answerMarkdown: answerEditor,
        evidenceRows: currentDraft?.evidenceRows || [],
        gaps: currentDraft?.gaps || [],
        confidenceScore: currentDraft?.confidenceScore ?? 0,
      });
      setDraftByQuestion((previous) => ({
        ...previous,
        [selectedQuestionId]: draft,
      }));
      setQuestions((previous) =>
        previous.map((question) =>
          question.id === selectedQuestionId && question.status === 'a_traiter'
            ? { ...question, status: 'brouillon' }
            : question,
        ),
      );
      addToast('Brouillon enregistre.', 'success');
    } catch {
      addToast('Impossible denregistrer le brouillon.', 'error');
    } finally {
      setIsSavingDraft(false);
    }
  };

  const handleGenerateQueries = async () => {
    if (!selectedQuestionId) {
      return;
    }

    setIsGeneratingQueries(true);
    try {
      const response = await generateThesisEbscoQueries(selectedQuestionId);
      setQueriesByQuestion((previous) => ({
        ...previous,
        [selectedQuestionId]: response,
      }));
      addToast('Requetes EBSCO generees.', 'success');
      setActiveTab('ebsco');
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        'Impossible de generer les requetes EBSCO.';
      addToast(message, 'error');
    } finally {
      setIsGeneratingQueries(false);
    }
  };

  const handleCopy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      addToast('Copie dans le presse-papiers.', 'success');
    } catch {
      addToast('Impossible de copier.', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Header />
        <div className="flex items-center justify-center py-24">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-300">
              Chargement des questions de these...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Header />

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => router.push('/dashboard')}
          className="inline-flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400 hover:text-primary mb-4"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Retour au dashboard
        </button>

        <div className="mb-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Questions de these (S1-S4)
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Reponse assistee par IA avec tableau de preuves et requetes EBSCO.
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-500 dark:text-slate-400">Progression</p>
              <p className="text-xl font-semibold text-slate-900 dark:text-white">
                {progress.treated} / {progress.total}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[360px_minmax(0,1fr)] gap-6">
          <aside className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 h-[calc(100vh-260px)] overflow-hidden flex flex-col">
            <div className="grid grid-cols-2 gap-2 mb-3">
              <select
                value={sectionFilter}
                onChange={(event) =>
                  setSectionFilter(event.target.value as typeof sectionFilter)
                }
                className="h-10 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-2 text-sm"
              >
                <option value="all">Toutes sections</option>
                <option value="S1">S1</option>
                <option value="S2">S2</option>
                <option value="S3">S3</option>
                <option value="S4">S4</option>
              </select>
              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value as typeof statusFilter)
                }
                className="h-10 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-2 text-sm"
              >
                <option value="all">Tous statuts</option>
                <option value="a_traiter">A traiter</option>
                <option value="en_cours">En cours</option>
                <option value="brouillon">Brouillon</option>
                <option value="validee">Validee</option>
              </select>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {filteredQuestions.map((question) => (
                <button
                  key={question.id}
                  onClick={() => setSelectedQuestionId(question.id)}
                  className={`w-full text-left rounded-lg border p-3 transition-colors ${
                    selectedQuestionId === question.id
                      ? 'border-primary bg-primary/5'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/40'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {question.code} - {question.section}
                    </p>
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${STATUS_COLOR[question.status]}`}
                    >
                      {STATUS_LABEL[question.status]}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                    {question.title}
                  </p>
                </button>
              ))}
            </div>
          </aside>

          <section className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 h-[calc(100vh-260px)] overflow-y-auto">
            {!selectedQuestion ? (
              <div className="h-full flex items-center justify-center text-slate-500 dark:text-slate-400">
                Selectionnez une question.
              </div>
            ) : (
              <div className="space-y-5">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <p className="text-xs font-semibold text-primary mb-1">
                      {selectedQuestion.code} - {selectedQuestion.section}
                    </p>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                      {selectedQuestion.title}
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedQuestion.status}
                      onChange={(event) =>
                        handleStatusChange(event.target.value as ThesisQuestionStatus)
                      }
                      className="h-10 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 text-sm"
                    >
                      <option value="a_traiter">A traiter</option>
                      <option value="en_cours">En cours</option>
                      <option value="brouillon">Brouillon</option>
                      <option value="validee">Validee</option>
                    </select>
                  </div>
                </div>

                <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-900/30 p-4 space-y-3">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Texte de la question
                  </label>
                  <textarea
                    value={questionEditor}
                    onChange={(event) => setQuestionEditor(event.target.value)}
                    className="w-full min-h-[110px] rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm"
                  />
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      References cibles: {selectedQuestion.targetReferences.join(' ; ')}
                    </p>
                    <button
                      onClick={handleSaveQuestionText}
                      disabled={isSavingQuestion}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-800 text-white text-sm disabled:opacity-60"
                    >
                      {isSavingQuestion ? 'Enregistrement...' : 'Enregistrer la question'}
                    </button>
                  </div>
                </div>

                <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700">
                  <button
                    onClick={() => setActiveTab('answer')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 ${
                      activeTab === 'answer'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-slate-500'
                    }`}
                  >
                    Reponse
                  </button>
                  <button
                    onClick={() => setActiveTab('evidence')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 ${
                      activeTab === 'evidence'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-slate-500'
                    }`}
                  >
                    Tableau de preuves
                  </button>
                  <button
                    onClick={() => setActiveTab('ebsco')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 ${
                      activeTab === 'ebsco'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-slate-500'
                    }`}
                  >
                    Requetes EBSCO
                  </button>
                </div>

                {activeTab === 'answer' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={handleGenerateAnswer}
                        disabled={isGeneratingAnswer}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-white text-sm disabled:opacity-60"
                      >
                        <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                        {isGeneratingAnswer ? 'Generation...' : 'Generer reponse'}
                      </button>
                      <button
                        onClick={handleSaveDraft}
                        disabled={isSavingDraft}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-slate-300 dark:border-slate-600 text-sm"
                      >
                        <span className="material-symbols-outlined text-[18px]">save</span>
                        {isSavingDraft ? 'Enregistrement...' : 'Enregistrer brouillon'}
                      </button>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        Derniere generation: {formatDate(selectedDraft?.generatedAt || null)}
                      </span>
                    </div>
                    <textarea
                      value={answerEditor}
                      onChange={(event) => setAnswerEditor(event.target.value)}
                      placeholder="La reponse generee apparaitra ici..."
                      className="w-full min-h-[360px] rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm leading-relaxed font-mono"
                    />
                  </div>
                )}

                {activeTab === 'evidence' && (
                  <div className="overflow-x-auto">
                    {!selectedDraft || selectedDraft.evidenceRows.length === 0 ? (
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Aucune preuve disponible. Generez une reponse pour remplir ce tableau.
                      </p>
                    ) : (
                      <table className="min-w-full text-sm border border-slate-200 dark:border-slate-700">
                        <thead className="bg-slate-100 dark:bg-slate-900/40">
                          <tr>
                            <th className="text-left px-3 py-2">Claim</th>
                            <th className="text-left px-3 py-2">Source</th>
                            <th className="text-left px-3 py-2">Page</th>
                            <th className="text-left px-3 py-2">Limite</th>
                            <th className="text-left px-3 py-2">Confiance</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedDraft.evidenceRows.map((row, index) => (
                            <tr
                              key={`${row.documentId}-${index}`}
                              className="border-t border-slate-200 dark:border-slate-700 align-top"
                            >
                              <td className="px-3 py-2">{row.claim}</td>
                              <td className="px-3 py-2">
                                <p className="font-medium">{row.fileName}</p>
                                <p className="text-xs text-slate-500">{row.documentId}</p>
                                <p className="text-xs mt-1 text-slate-600 dark:text-slate-300">
                                  {row.sourceSnippet}
                                </p>
                              </td>
                              <td className="px-3 py-2">
                                {row.pageNumber === null ? '-' : row.pageNumber}
                              </td>
                              <td className="px-3 py-2">{row.limitation}</td>
                              <td className="px-3 py-2 capitalize">{row.confidence}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}

                {activeTab === 'ebsco' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={handleGenerateQueries}
                        disabled={isGeneratingQueries}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-white text-sm disabled:opacity-60"
                      >
                        <span className="material-symbols-outlined text-[18px]">manage_search</span>
                        {isGeneratingQueries
                          ? 'Generation...'
                          : selectedQueries
                            ? 'Regenerer requetes EBSCO'
                            : 'Generer requetes EBSCO'}
                      </button>
                      {selectedQueries && (
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          Genere le {formatDate(selectedQueries.generatedAt)}
                        </span>
                      )}
                    </div>

                    {!selectedQueries || selectedQueries.queries.length === 0 ? (
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Lancez la generation pour obtenir des requetes booleennes pretes a coller.
                      </p>
                    ) : (
                      <div className="grid gap-3">
                        {selectedQueries.queries.map((query, index) => (
                          <article
                            key={`${query.label}-${index}`}
                            className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30 p-4"
                          >
                            <div className="flex items-center justify-between gap-3 mb-2">
                              <div>
                                <p className="font-semibold text-slate-900 dark:text-white">
                                  {query.label}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                                  Intent: {query.intent}
                                </p>
                              </div>
                              <button
                                onClick={() => handleCopy(query.query)}
                                className="text-xs px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600"
                              >
                                Copier requete
                              </button>
                            </div>
                            <code className="block text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-md p-2 break-words">
                              {query.query}
                            </code>
                            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                              {query.rationale}
                            </p>
                          </article>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </main>

      <ToastContainer />
    </div>
  );
}
