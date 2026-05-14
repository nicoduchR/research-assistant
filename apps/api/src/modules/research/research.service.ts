import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import * as sanitizeHtml from 'sanitize-html';
import type {
  KeywordSuggestionContextDocument,
  KeywordSuggestionRunSummary,
  KeywordSuggestionsResponse,
} from '@repo/types';
import { ResearchScope } from '../../entities/research-scope.entity';
import { ResearchDocument } from '../../entities/research-document.entity';
import { DocumentAnalysis } from '../../entities/document-analysis.entity';
import { KeywordSuggestionRun } from '../../entities/keyword-suggestion-run.entity';
import { CreateResearchScopeDto } from './dto/create-research-scope.dto';
import { AiService } from '../ai/ai.service';

@Injectable()
export class ResearchService {
  constructor(
    @InjectRepository(ResearchScope)
    private researchScopeRepository: Repository<ResearchScope>,
    @InjectRepository(ResearchDocument)
    private researchDocumentRepository: Repository<ResearchDocument>,
    @InjectRepository(DocumentAnalysis)
    private documentAnalysisRepository: Repository<DocumentAnalysis>,
    @InjectRepository(KeywordSuggestionRun)
    private keywordSuggestionRunRepository: Repository<KeywordSuggestionRun>,
    private aiService: AiService,
  ) {}

  /**
   * Sanitize user input to prevent XSS attacks
   * Strips all HTML tags and dangerous content
   */
  private sanitizeInput(input: string): string {
    return sanitizeHtml(input, {
      allowedTags: [], // No HTML tags allowed
      allowedAttributes: {},
      disallowedTagsMode: 'discard',
    }).trim();
  }

  async getUserScope(userId: string): Promise<ResearchScope | null> {
    return this.researchScopeRepository.findOne({
      where: { userId },
    });
  }

  async createOrUpdateScope(
    userId: string,
    dto: CreateResearchScopeDto,
  ): Promise<ResearchScope> {
    // Check if user already has a scope
    const existingScope = await this.getUserScope(userId);

    // Sanitize all user inputs to prevent XSS attacks
    const sanitizedTitle = this.sanitizeInput(dto.title);
    const sanitizedProblematique = this.sanitizeInput(dto.problematique);
    const sanitizedObjectives = dto.objectives
      ? this.sanitizeInput(dto.objectives)
      : null;
    const sanitizedPersonalTheme =
      typeof dto.personalTheme === 'string'
        ? this.sanitizeInput(dto.personalTheme) || null
        : null;

    if (existingScope) {
      // Update existing scope
      existingScope.title = sanitizedTitle;
      existingScope.problematique = sanitizedProblematique;
      existingScope.objectives = sanitizedObjectives;
      existingScope.personalTheme = sanitizedPersonalTheme;
      return this.researchScopeRepository.save(existingScope);
    }

    // Create new scope
    const scope = this.researchScopeRepository.create({
      userId,
      title: sanitizedTitle,
      problematique: sanitizedProblematique,
      objectives: sanitizedObjectives,
      personalTheme: sanitizedPersonalTheme,
    });

    return this.researchScopeRepository.save(scope);
  }

  async generateKeywordSuggestions(
    userId: string,
  ): Promise<KeywordSuggestionsResponse> {
    const scope = await this.getUserScope(userId);
    if (!scope) {
      throw new NotFoundException(
        'Research scope not found. Configure your research scope first.',
      );
    }

    const documents = await this.researchDocumentRepository.find({
      where: { userId },
      order: { updatedAt: 'DESC' },
      select: ['id', 'fileName', 'bibliographicMetadata', 'updatedAt'],
    });

    if (!documents.length) {
      throw new BadRequestException(
        'Upload at least one document before requesting keyword suggestions.',
      );
    }

    const documentIds = documents.map((document) => document.id);
    const analyses = await this.documentAnalysisRepository.find({
      where: {
        userId,
        documentId: In(documentIds),
      },
      order: { updatedAt: 'DESC' },
    });

    const analysisByDocumentId = new Map(
      analyses.map((analysis) => [analysis.documentId, analysis]),
    );

    const contextDocuments: KeywordSuggestionContextDocument[] = documents
      .slice(0, 12)
      .map((document) => {
        const analysis = analysisByDocumentId.get(document.id);
        return {
          id: document.id,
          fileName: document.fileName,
          title: document.bibliographicMetadata?.title || undefined,
          year: document.bibliographicMetadata?.year,
          journal: document.bibliographicMetadata?.journal,
          methodologyType: analysis?.methodology?.type,
          summary: this.truncateText(analysis?.summary, 1200),
          keyCitations: (analysis?.keyCitations || []).slice(0, 4).map((citation) => ({
            text: this.truncateText(citation.text, 280) || '',
            context: this.truncateText(citation.context, 220) || '',
            relevance: citation.relevance,
          })),
          limitations: (analysis?.methodology?.limitations || [])
            .slice(0, 3)
            .map((limitation) => this.truncateText(limitation, 220))
            .filter((limitation): limitation is string => Boolean(limitation)),
          alignedObjectives: (analysis?.relevance?.alignedObjectives || [])
            .slice(0, 3)
            .map((objective) => this.truncateText(objective, 180))
            .filter((objective): objective is string => Boolean(objective)),
        };
      });

    const suggestions = await this.aiService.generateKeywordSuggestions(
      {
        title: scope.title,
        problematique: scope.problematique,
        objectives: scope.objectives,
      },
      contextDocuments,
      scope.personalTheme,
    );

    const citationCount = analyses.reduce(
      (count, analysis) => count + (analysis.keyCitations?.length || 0),
      0,
    );

    const basedOn = {
      scopeTitle: scope.title,
      documentCount: documents.length,
      analyzedDocumentCount: analyses.length,
      citationCount,
    };

    const run = this.keywordSuggestionRunRepository.create({
      userId,
      themeUsed: scope.personalTheme,
      basedOn,
      suggestions,
    });
    const savedRun = await this.keywordSuggestionRunRepository.save(run);

    return {
      id: savedRun.id,
      generatedAt: savedRun.generatedAt.toISOString(),
      themeUsed: savedRun.themeUsed,
      basedOn,
      suggestions,
    };
  }

  async getLatestKeywordSuggestionRun(
    userId: string,
  ): Promise<KeywordSuggestionsResponse | null> {
    const run = await this.keywordSuggestionRunRepository.findOne({
      where: { userId },
      order: { generatedAt: 'DESC' },
    });

    if (!run) {
      return null;
    }

    return this.runToResponse(run);
  }

  async listKeywordSuggestionRuns(
    userId: string,
  ): Promise<KeywordSuggestionRunSummary[]> {
    const runs = await this.keywordSuggestionRunRepository.find({
      where: { userId },
      order: { generatedAt: 'DESC' },
      take: 20,
    });

    return runs.map((run) => ({
      id: run.id,
      generatedAt: run.generatedAt.toISOString(),
      themeUsed: run.themeUsed,
      basedOn: run.basedOn,
      suggestionCount: Array.isArray(run.suggestions) ? run.suggestions.length : 0,
    }));
  }

  async getKeywordSuggestionRun(
    userId: string,
    runId: string,
  ): Promise<KeywordSuggestionsResponse> {
    const run = await this.keywordSuggestionRunRepository.findOne({
      where: { id: runId, userId },
    });

    if (!run) {
      throw new NotFoundException('Keyword suggestion run not found.');
    }

    return this.runToResponse(run);
  }

  async deleteKeywordSuggestionRun(userId: string, runId: string): Promise<void> {
    const result = await this.keywordSuggestionRunRepository.delete({
      id: runId,
      userId,
    });

    if (!result.affected) {
      throw new NotFoundException('Keyword suggestion run not found.');
    }
  }

  private runToResponse(run: KeywordSuggestionRun): KeywordSuggestionsResponse {
    return {
      id: run.id,
      generatedAt: run.generatedAt.toISOString(),
      themeUsed: run.themeUsed,
      basedOn: run.basedOn,
      suggestions: run.suggestions,
    };
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
