import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import type {
  EbscoQueryResponse,
  ThesisAnswerDraft as ThesisAnswerDraftResponse,
  ThesisQuestion as ThesisQuestionResponse,
  ThesisQuestionStatus,
} from '@repo/types';
import { ThesisQuestion } from '../../entities/thesis-question.entity';
import { ThesisAnswerDraft } from '../../entities/thesis-answer-draft.entity';
import { ResearchScope } from '../../entities/research-scope.entity';
import { ResearchDocument } from '../../entities/research-document.entity';
import { DocumentAnalysis } from '../../entities/document-analysis.entity';
import { AiService } from '../ai/ai.service';
import { UpdateThesisQuestionDto } from './dto/update-thesis-question.dto';
import { UpsertThesisDraftDto } from './dto/upsert-thesis-draft.dto';
import { THESIS_QUESTION_SEED } from './thesis-question-seed';

interface CorpusContext {
  scope: ResearchScope;
  question: ThesisQuestion;
  contextDocuments: Array<{
    id: string;
    fileName: string;
    title?: string;
    year?: number;
    journal?: string;
    methodologyType?: string;
    summary?: string;
    keyCitations?: Array<{
      text: string;
      context: string;
      relevance: 'high' | 'medium' | 'low';
    }>;
    limitations?: string[];
    alignedObjectives?: string[];
  }>;
  documentCount: number;
  analyzedDocumentCount: number;
  citationCount: number;
}

const VALID_STATUS_TRANSITIONS: Record<
  ThesisQuestionStatus,
  ThesisQuestionStatus[]
> = {
  a_traiter: ['en_cours', 'brouillon', 'validee'],
  en_cours: ['a_traiter', 'brouillon', 'validee'],
  brouillon: ['en_cours', 'validee', 'a_traiter'],
  validee: ['en_cours', 'brouillon'],
};

@Injectable()
export class ThesisQuestionsService {
  constructor(
    @InjectRepository(ThesisQuestion)
    private thesisQuestionRepository: Repository<ThesisQuestion>,
    @InjectRepository(ThesisAnswerDraft)
    private thesisDraftRepository: Repository<ThesisAnswerDraft>,
    @InjectRepository(ResearchScope)
    private researchScopeRepository: Repository<ResearchScope>,
    @InjectRepository(ResearchDocument)
    private researchDocumentRepository: Repository<ResearchDocument>,
    @InjectRepository(DocumentAnalysis)
    private documentAnalysisRepository: Repository<DocumentAnalysis>,
    private aiService: AiService,
  ) {}

  async bootstrapQuestions(
    userId: string,
  ): Promise<ThesisQuestionResponse[]> {
    const scope = await this.researchScopeRepository.findOne({
      where: { userId },
    });

    if (!scope) {
      throw new NotFoundException(
        'Research scope not found. Configure your research scope first.',
      );
    }

    const existingQuestions = await this.thesisQuestionRepository.find({
      where: { userId },
    });
    const existingByCode = new Map(
      existingQuestions.map((question) => [question.code, question]),
    );

    const toSave: ThesisQuestion[] = [];

    for (const seed of THESIS_QUESTION_SEED) {
      const existing = existingByCode.get(seed.code);
      if (!existing) {
        toSave.push(
          this.thesisQuestionRepository.create({
            userId,
            researchScopeId: scope.id,
            code: seed.code,
            section: seed.section,
            title: seed.title,
            questionText: seed.questionText,
            targetReferences: seed.targetReferences,
            status: 'a_traiter',
          }),
        );
        continue;
      }

      let hasChanges = false;
      if (existing.researchScopeId !== scope.id) {
        existing.researchScopeId = scope.id;
        hasChanges = true;
      }
      if (!Array.isArray(existing.targetReferences)) {
        existing.targetReferences = seed.targetReferences;
        hasChanges = true;
      }
      if (hasChanges) {
        toSave.push(existing);
      }
    }

    if (toSave.length > 0) {
      await this.thesisQuestionRepository.save(toSave);
    }

    return this.listQuestions(userId);
  }

  async listQuestions(userId: string): Promise<ThesisQuestionResponse[]> {
    const questions = await this.thesisQuestionRepository.find({
      where: { userId },
    });

    return questions
      .sort((left, right) => this.getQuestionOrder(left.code) - this.getQuestionOrder(right.code))
      .map((question) => this.mapQuestion(question));
  }

  async updateQuestion(
    questionId: string,
    userId: string,
    dto: UpdateThesisQuestionDto,
  ): Promise<ThesisQuestionResponse> {
    const question = await this.getQuestionOrFail(questionId, userId);

    if (dto.status) {
      this.assertValidStatusTransition(question.status, dto.status);
      question.status = dto.status;
    }

    if (dto.title !== undefined) {
      question.title = dto.title.trim();
    }

    if (dto.questionText !== undefined) {
      question.questionText = dto.questionText.trim();
    }

    const saved = await this.thesisQuestionRepository.save(question);
    return this.mapQuestion(saved);
  }

  async generateAnswer(
    questionId: string,
    userId: string,
  ): Promise<ThesisAnswerDraftResponse> {
    const corpus = await this.getStrictCorpusContext(questionId, userId);

    const aiResult = await this.aiService.generateQuestionAnswerWithEvidence(
      {
        title: corpus.scope.title,
        problematique: corpus.scope.problematique,
        objectives: corpus.scope.objectives,
      },
      {
        code: corpus.question.code,
        section: corpus.question.section,
        title: corpus.question.title,
        questionText: corpus.question.questionText,
        targetReferences: corpus.question.targetReferences,
      },
      corpus.contextDocuments,
    );

    let draft = await this.thesisDraftRepository.findOne({
      where: { questionId: corpus.question.id },
    });

    if (!draft) {
      draft = this.thesisDraftRepository.create({
        questionId: corpus.question.id,
      });
    }

    draft.answerMarkdown = aiResult.answerMarkdown;
    draft.evidenceRows = aiResult.evidenceRows;
    draft.gaps = aiResult.gaps;
    draft.confidenceScore = aiResult.confidenceScore;
    draft.generatedAt = new Date();

    const savedDraft = await this.thesisDraftRepository.save(draft);

    corpus.question.status = 'brouillon';
    await this.thesisQuestionRepository.save(corpus.question);

    return this.mapDraft(savedDraft);
  }

  async getDraft(
    questionId: string,
    userId: string,
  ): Promise<ThesisAnswerDraftResponse | null> {
    await this.getQuestionOrFail(questionId, userId);

    const draft = await this.thesisDraftRepository.findOne({
      where: { questionId },
    });

    return draft ? this.mapDraft(draft) : null;
  }

  async upsertDraft(
    questionId: string,
    userId: string,
    dto: UpsertThesisDraftDto,
  ): Promise<ThesisAnswerDraftResponse> {
    const question = await this.getQuestionOrFail(questionId, userId);

    let draft = await this.thesisDraftRepository.findOne({
      where: { questionId },
    });

    if (!draft) {
      draft = this.thesisDraftRepository.create({
        questionId,
      });
    }

    if (dto.answerMarkdown !== undefined) {
      draft.answerMarkdown = dto.answerMarkdown;
    }
    if (dto.evidenceRows !== undefined) {
      draft.evidenceRows = dto.evidenceRows;
    }
    if (dto.gaps !== undefined) {
      draft.gaps = dto.gaps;
    }
    if (dto.confidenceScore !== undefined) {
      draft.confidenceScore = dto.confidenceScore;
    }

    if (
      dto.answerMarkdown !== undefined ||
      dto.evidenceRows !== undefined ||
      dto.gaps !== undefined ||
      dto.confidenceScore !== undefined
    ) {
      draft.generatedAt = draft.generatedAt || new Date();
    }

    const savedDraft = await this.thesisDraftRepository.save(draft);

    if (dto.status) {
      this.assertValidStatusTransition(question.status, dto.status);
      question.status = dto.status;
    } else if (question.status === 'a_traiter' || question.status === 'en_cours') {
      question.status = 'brouillon';
    }
    await this.thesisQuestionRepository.save(question);

    return this.mapDraft(savedDraft);
  }

  async generateEbscoQueries(
    questionId: string,
    userId: string,
  ): Promise<EbscoQueryResponse> {
    const corpus = await this.getStrictCorpusContext(questionId, userId);

    const queries = await this.aiService.generateQuestionScopedEbscoQueries(
      {
        title: corpus.scope.title,
        problematique: corpus.scope.problematique,
        objectives: corpus.scope.objectives,
      },
      {
        code: corpus.question.code,
        section: corpus.question.section,
        title: corpus.question.title,
        questionText: corpus.question.questionText,
        targetReferences: corpus.question.targetReferences,
      },
      corpus.contextDocuments,
    );

    return {
      generatedAt: new Date().toISOString(),
      basedOn: {
        documentCount: corpus.documentCount,
        analyzedDocumentCount: corpus.analyzedDocumentCount,
        citationCount: corpus.citationCount,
      },
      queries,
    };
  }

  private async getStrictCorpusContext(
    questionId: string,
    userId: string,
  ): Promise<CorpusContext> {
    const question = await this.getQuestionOrFail(questionId, userId);

    const scope = await this.researchScopeRepository.findOne({
      where: { id: question.researchScopeId, userId },
    });

    if (!scope) {
      throw new NotFoundException(
        'Research scope not found for this thesis question.',
      );
    }

    const documents = await this.researchDocumentRepository.find({
      where: {
        userId,
        analysisStatus: 'completed',
      },
      order: { updatedAt: 'DESC' },
    });

    if (!documents.length) {
      throw new BadRequestException(
        'No analyzed documents found. Complete document analysis before generating answers.',
      );
    }

    const analyses = await this.documentAnalysisRepository.find({
      where: {
        userId,
        documentId: In(documents.map((document) => document.id)),
      },
      order: { updatedAt: 'DESC' },
    });

    if (!analyses.length) {
      throw new BadRequestException(
        'No analysis data available for completed documents.',
      );
    }

    const analysisByDocumentId = new Map(
      analyses.map((analysis) => [analysis.documentId, analysis]),
    );

    const contextDocuments = documents
      .filter((document) => analysisByDocumentId.has(document.id))
      .slice(0, 20)
      .map((document) => {
        const analysis = analysisByDocumentId.get(document.id)!;
        return {
          id: document.id,
          fileName: document.fileName,
          title: document.bibliographicMetadata?.title || undefined,
          year: document.bibliographicMetadata?.year,
          journal: document.bibliographicMetadata?.journal,
          methodologyType: analysis?.methodology?.type,
          summary: this.truncateText(analysis?.summary, 2000),
          keyCitations: (analysis?.keyCitations || []).slice(0, 6).map((citation) => ({
            text: this.truncateText(citation.text, 320) || '',
            context: this.truncateText(citation.context, 260) || '',
            relevance: citation.relevance,
          })),
          limitations: (analysis?.methodology?.limitations || [])
            .slice(0, 4)
            .map((limitation) => this.truncateText(limitation, 280))
            .filter((limitation): limitation is string => Boolean(limitation)),
          alignedObjectives: (analysis?.relevance?.alignedObjectives || [])
            .slice(0, 4)
            .map((objective) => this.truncateText(objective, 220))
            .filter((objective): objective is string => Boolean(objective)),
        };
      });

    if (!contextDocuments.length) {
      throw new BadRequestException(
        'No strict corpus documents available with completed analysis.',
      );
    }

    const citationCount = analyses.reduce(
      (count, analysis) => count + (analysis.keyCitations?.length || 0),
      0,
    );

    return {
      scope,
      question,
      contextDocuments,
      documentCount: documents.length,
      analyzedDocumentCount: analyses.length,
      citationCount,
    };
  }

  private async getQuestionOrFail(
    questionId: string,
    userId: string,
  ): Promise<ThesisQuestion> {
    const question = await this.thesisQuestionRepository.findOne({
      where: { id: questionId, userId },
    });

    if (!question) {
      throw new NotFoundException('Thesis question not found');
    }

    return question;
  }

  private assertValidStatusTransition(
    currentStatus: ThesisQuestionStatus,
    nextStatus: ThesisQuestionStatus,
  ): void {
    if (currentStatus === nextStatus) {
      return;
    }

    const allowedTransitions = VALID_STATUS_TRANSITIONS[currentStatus] || [];

    if (!allowedTransitions.includes(nextStatus)) {
      throw new BadRequestException(
        `Invalid status transition from ${currentStatus} to ${nextStatus}`,
      );
    }
  }

  private mapQuestion(question: ThesisQuestion): ThesisQuestionResponse {
    return {
      id: question.id,
      userId: question.userId,
      researchScopeId: question.researchScopeId,
      code: question.code,
      section: question.section,
      title: question.title,
      questionText: question.questionText,
      targetReferences: question.targetReferences || [],
      status: question.status,
      createdAt: question.createdAt.toISOString(),
      updatedAt: question.updatedAt.toISOString(),
    };
  }

  private mapDraft(draft: ThesisAnswerDraft): ThesisAnswerDraftResponse {
    return {
      id: draft.id,
      questionId: draft.questionId,
      answerMarkdown: draft.answerMarkdown,
      evidenceRows: draft.evidenceRows || [],
      gaps: draft.gaps || [],
      confidenceScore: draft.confidenceScore,
      generatedAt: draft.generatedAt ? draft.generatedAt.toISOString() : null,
      createdAt: draft.createdAt.toISOString(),
      updatedAt: draft.updatedAt.toISOString(),
    };
  }

  private getQuestionOrder(code: string): number {
    const value = Number(code.replace(/[^0-9]/g, ''));
    return Number.isFinite(value) ? value : Number.MAX_SAFE_INTEGER;
  }

  private truncateText(
    value: string | null | undefined,
    maxLength: number,
  ): string | undefined {
    if (!value) {
      return undefined;
    }

    const normalized = value.replace(/\s+/g, ' ').trim();
    if (normalized.length <= maxLength) {
      return normalized;
    }

    return `${normalized.slice(0, Math.max(0, maxLength - 3))}...`;
  }
}
