import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import * as sanitizeHtml from 'sanitize-html';
import type {
  KeywordSuggestionContextDocument,
  KeywordSuggestionsResponse,
} from '@repo/types';
import { ResearchScope } from '../../entities/research-scope.entity';
import { ResearchDocument } from '../../entities/research-document.entity';
import { DocumentAnalysis } from '../../entities/document-analysis.entity';
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

    if (existingScope) {
      // Update existing scope
      existingScope.title = sanitizedTitle;
      existingScope.problematique = sanitizedProblematique;
      existingScope.objectives = sanitizedObjectives;
      return this.researchScopeRepository.save(existingScope);
    }

    // Create new scope
    const scope = this.researchScopeRepository.create({
      userId,
      title: sanitizedTitle,
      problematique: sanitizedProblematique,
      objectives: sanitizedObjectives,
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
    );

    const citationCount = analyses.reduce(
      (count, analysis) => count + (analysis.keyCitations?.length || 0),
      0,
    );

    return {
      generatedAt: new Date().toISOString(),
      basedOn: {
        scopeTitle: scope.title,
        documentCount: documents.length,
        analyzedDocumentCount: analyses.length,
        citationCount,
      },
      suggestions,
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
