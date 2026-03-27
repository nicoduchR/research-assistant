import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResearchService } from './research.service';
import { ResearchScope } from '../../entities/research-scope.entity';
import { ResearchDocument } from '../../entities/research-document.entity';
import { DocumentAnalysis } from '../../entities/document-analysis.entity';
import { AiService } from '../ai/ai.service';
import { CreateResearchScopeDto } from './dto/create-research-scope.dto';

describe('ResearchService', () => {
  let service: ResearchService;
  let scopeRepository: jest.Mocked<Repository<ResearchScope>>;
  let documentRepository: jest.Mocked<Repository<ResearchDocument>>;
  let analysisRepository: jest.Mocked<Repository<DocumentAnalysis>>;
  let aiService: jest.Mocked<AiService>;

  const mockScopeRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };
  const mockDocumentRepository = {
    find: jest.fn(),
  };
  const mockAnalysisRepository = {
    find: jest.fn(),
  };
  const mockAiService = {
    generateKeywordSuggestions: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResearchService,
        {
          provide: getRepositoryToken(ResearchScope),
          useValue: mockScopeRepository,
        },
        {
          provide: getRepositoryToken(ResearchDocument),
          useValue: mockDocumentRepository,
        },
        {
          provide: getRepositoryToken(DocumentAnalysis),
          useValue: mockAnalysisRepository,
        },
        {
          provide: AiService,
          useValue: mockAiService,
        },
      ],
    }).compile();

    service = module.get<ResearchService>(ResearchService);
    scopeRepository = module.get(getRepositoryToken(ResearchScope));
    documentRepository = module.get(getRepositoryToken(ResearchDocument));
    analysisRepository = module.get(getRepositoryToken(DocumentAnalysis));
    aiService = module.get(AiService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserScope', () => {
    it('should return user scope if exists', async () => {
      const userId = 'user-123';
      const mockScope = {
        id: 'scope-123',
        userId,
        title: 'Test Title',
        problematique: 'Test problematique',
        objectives: 'Test objectives',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as ResearchScope;

      scopeRepository.findOne.mockResolvedValue(mockScope);

      const result = await service.getUserScope(userId);

      expect(scopeRepository.findOne).toHaveBeenCalledWith({
        where: { userId },
      });
      expect(result).toEqual(mockScope);
    });

    it('should return null if user scope does not exist', async () => {
      const userId = 'user-123';
      scopeRepository.findOne.mockResolvedValue(null);

      const result = await service.getUserScope(userId);

      expect(scopeRepository.findOne).toHaveBeenCalledWith({
        where: { userId },
      });
      expect(result).toBeNull();
    });
  });

  describe('createOrUpdateScope', () => {
    const userId = 'user-123';
    const dto: CreateResearchScopeDto = {
      title: '  Test Title  ',
      problematique: '  '.repeat(25) + 'Test problematique',
      objectives: '  Test objectives  ',
    };

    it('should create new scope if user has none', async () => {
      const newScope = {
        id: 'scope-123',
        userId,
        title: dto.title.trim(),
        problematique: dto.problematique.trim(),
        objectives: dto.objectives?.trim(),
        createdAt: new Date(),
        updatedAt: new Date(),
      } as ResearchScope;

      scopeRepository.findOne.mockResolvedValue(null);
      scopeRepository.create.mockReturnValue(newScope);
      scopeRepository.save.mockResolvedValue(newScope);

      const result = await service.createOrUpdateScope(userId, dto);

      expect(scopeRepository.findOne).toHaveBeenCalledWith({
        where: { userId },
      });
      expect(scopeRepository.create).toHaveBeenCalledWith({
        userId,
        title: dto.title.trim(),
        problematique: dto.problematique.trim(),
        objectives: dto.objectives?.trim(),
      });
      expect(scopeRepository.save).toHaveBeenCalledWith(newScope);
      expect(result).toEqual(newScope);
    });

    it('should update existing scope if user has one', async () => {
      const existingScope = {
        id: 'scope-123',
        userId,
        title: 'Old Title',
        problematique: 'Old problematique',
        objectives: 'Old objectives',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as ResearchScope;

      scopeRepository.findOne.mockResolvedValue(existingScope);
      scopeRepository.save.mockResolvedValue({
        ...existingScope,
        title: dto.title.trim(),
        problematique: dto.problematique.trim(),
        objectives: dto.objectives?.trim() || null,
      });

      const result = await service.createOrUpdateScope(userId, dto);

      expect(scopeRepository.findOne).toHaveBeenCalledWith({
        where: { userId },
      });
      expect(scopeRepository.save).toHaveBeenCalled();
      expect(result.title).toBe(dto.title.trim());
      expect(result.problematique).toBe(dto.problematique.trim());
    });

    it('should trim whitespace from all fields', async () => {
      scopeRepository.findOne.mockResolvedValue(null);
      scopeRepository.create.mockImplementation((data) => data as ResearchScope);
      scopeRepository.save.mockImplementation((scope) =>
        Promise.resolve(scope as ResearchScope),
      );

      await service.createOrUpdateScope(userId, dto);

      expect(scopeRepository.create).toHaveBeenCalledWith({
        userId,
        title: 'Test Title',
        problematique: 'Test problematique',
        objectives: 'Test objectives',
      });
    });

    it('should handle null objectives', async () => {
      const dtoWithoutObjectives = {
        title: 'Test Title',
        problematique: '  '.repeat(25) + 'Test problematique',
      };

      scopeRepository.findOne.mockResolvedValue(null);
      scopeRepository.create.mockImplementation((data) => data as ResearchScope);
      scopeRepository.save.mockImplementation((scope) =>
        Promise.resolve(scope as ResearchScope),
      );

      await service.createOrUpdateScope(userId, dtoWithoutObjectives);

      expect(scopeRepository.create).toHaveBeenCalledWith({
        userId,
        title: 'Test Title',
        problematique: 'Test problematique',
        objectives: null,
      });
    });
  });

  describe('generateKeywordSuggestions', () => {
    const userId = 'user-123';

    it('should throw NotFoundException when scope is missing', async () => {
      scopeRepository.findOne.mockResolvedValue(null);

      await expect(service.generateKeywordSuggestions(userId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException when no documents exist', async () => {
      scopeRepository.findOne.mockResolvedValue({
        id: 'scope-1',
        userId,
        title: 'Scope',
        problematique: 'Problem statement',
        objectives: null,
      } as ResearchScope);
      documentRepository.find.mockResolvedValue([]);

      await expect(service.generateKeywordSuggestions(userId)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should generate keyword suggestions using AI service', async () => {
      scopeRepository.findOne.mockResolvedValue({
        id: 'scope-1',
        userId,
        title: 'Scope',
        problematique: 'Problem statement',
        objectives: 'Objective A',
      } as ResearchScope);

      documentRepository.find.mockResolvedValue([
        {
          id: 'doc-1',
          userId,
          fileName: 'paper-a.pdf',
          bibliographicMetadata: {
            title: 'Paper A',
            year: 2024,
            journal: 'Journal A',
          },
          updatedAt: new Date(),
        } as ResearchDocument,
      ]);

      analysisRepository.find.mockResolvedValue([
        {
          id: 'analysis-1',
          userId,
          documentId: 'doc-1',
          summary: 'Summary text',
          keyCitations: [
            {
              text: 'Citation text',
              pageNumber: 12,
              relevance: 'high',
              context: 'Citation context',
            },
          ],
          relevance: {
            score: 8,
            explanation: 'Relevant',
            alignedObjectives: ['Objective A'],
            recommendation: 'keep',
          },
          methodology: {
            type: 'qualitative',
            description: 'Method',
            strengths: [],
            limitations: ['Small sample'],
          },
          errorMessage: null,
          analyzedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        } as unknown as DocumentAnalysis,
      ]);

      aiService.generateKeywordSuggestions.mockResolvedValue([
        {
          keyword: 'digital literacy',
          intent: 'complementary',
          rationale: 'Complements the current angle.',
          ebscoQuery: '"digital literacy" AND "higher education"',
          relatedQuestion: 'How does digital literacy shape outcomes?',
        },
      ]);

      const result = await service.generateKeywordSuggestions(userId);

      expect(aiService.generateKeywordSuggestions).toHaveBeenCalledTimes(1);
      expect(result.suggestions).toHaveLength(1);
      expect(result.basedOn.documentCount).toBe(1);
      expect(result.basedOn.analyzedDocumentCount).toBe(1);
      expect(result.basedOn.citationCount).toBe(1);
    });
  });
});
