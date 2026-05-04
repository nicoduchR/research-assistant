import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ThesisQuestionsService } from './thesis-questions.service';
import { ThesisQuestion } from '../../entities/thesis-question.entity';
import { ThesisAnswerDraft } from '../../entities/thesis-answer-draft.entity';
import { ResearchScope } from '../../entities/research-scope.entity';
import { ResearchDocument } from '../../entities/research-document.entity';
import { DocumentAnalysis } from '../../entities/document-analysis.entity';
import { AiService } from '../ai/ai.service';
import { THESIS_QUESTION_SEED } from './thesis-question-seed';

describe('ThesisQuestionsService', () => {
  let service: ThesisQuestionsService;
  let thesisQuestionRepository: jest.Mocked<Repository<ThesisQuestion>>;
  let thesisDraftRepository: jest.Mocked<Repository<ThesisAnswerDraft>>;
  let researchScopeRepository: jest.Mocked<Repository<ResearchScope>>;
  let researchDocumentRepository: jest.Mocked<Repository<ResearchDocument>>;
  let documentAnalysisRepository: jest.Mocked<Repository<DocumentAnalysis>>;
  let aiService: jest.Mocked<AiService>;

  const mockThesisQuestionRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };
  const mockThesisDraftRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };
  const mockResearchScopeRepository = {
    findOne: jest.fn(),
  };
  const mockResearchDocumentRepository = {
    find: jest.fn(),
  };
  const mockDocumentAnalysisRepository = {
    find: jest.fn(),
  };
  const mockAiService = {
    generateQuestionAnswerWithEvidence: jest.fn(),
    generateQuestionScopedEbscoQueries: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ThesisQuestionsService,
        {
          provide: getRepositoryToken(ThesisQuestion),
          useValue: mockThesisQuestionRepository,
        },
        {
          provide: getRepositoryToken(ThesisAnswerDraft),
          useValue: mockThesisDraftRepository,
        },
        {
          provide: getRepositoryToken(ResearchScope),
          useValue: mockResearchScopeRepository,
        },
        {
          provide: getRepositoryToken(ResearchDocument),
          useValue: mockResearchDocumentRepository,
        },
        {
          provide: getRepositoryToken(DocumentAnalysis),
          useValue: mockDocumentAnalysisRepository,
        },
        {
          provide: AiService,
          useValue: mockAiService,
        },
      ],
    }).compile();

    service = module.get(ThesisQuestionsService);
    thesisQuestionRepository = module.get(getRepositoryToken(ThesisQuestion));
    thesisDraftRepository = module.get(getRepositoryToken(ThesisAnswerDraft));
    researchScopeRepository = module.get(getRepositoryToken(ResearchScope));
    researchDocumentRepository = module.get(getRepositoryToken(ResearchDocument));
    documentAnalysisRepository = module.get(getRepositoryToken(DocumentAnalysis));
    aiService = module.get(AiService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should bootstrap all 12 thesis questions', async () => {
    const userId = 'user-123';
    const scope = { id: 'scope-123', userId } as ResearchScope;

    researchScopeRepository.findOne.mockResolvedValue(scope);
    thesisQuestionRepository.find
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce(
        THESIS_QUESTION_SEED.map((seed, index) => ({
          id: `question-${index + 1}`,
          userId,
          researchScopeId: scope.id,
          code: seed.code,
          section: seed.section,
          title: seed.title,
          questionText: seed.questionText,
          targetReferences: seed.targetReferences,
          status: 'a_traiter',
          createdAt: new Date(),
          updatedAt: new Date(),
        })) as unknown as ThesisQuestion[],
      );
    thesisQuestionRepository.create.mockImplementation(
      (data) => data as ThesisQuestion,
    );
    thesisQuestionRepository.save.mockResolvedValue([] as unknown as ThesisQuestion);

    const result = await service.bootstrapQuestions(userId);

    expect(result).toHaveLength(12);
    expect(thesisQuestionRepository.create).toHaveBeenCalledTimes(12);
    expect(thesisQuestionRepository.save).toHaveBeenCalled();
  });

  it('should reject invalid status transition', async () => {
    const userId = 'user-123';
    thesisQuestionRepository.findOne.mockResolvedValue({
      id: 'question-1',
      userId,
      researchScopeId: 'scope-1',
      code: 'Q1',
      section: 'S1',
      title: 'Question',
      questionText: 'Text',
      targetReferences: [],
      status: 'validee',
      createdAt: new Date(),
      updatedAt: new Date(),
    } as unknown as ThesisQuestion);

    await expect(
      service.updateQuestion('question-1', userId, { status: 'a_traiter' }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should enforce strict corpus and fail when no analyzed documents exist', async () => {
    const userId = 'user-123';
    thesisQuestionRepository.findOne.mockResolvedValue({
      id: 'question-1',
      userId,
      researchScopeId: 'scope-1',
      code: 'Q1',
      section: 'S1',
      title: 'Question',
      questionText: 'Text',
      targetReferences: [],
      status: 'a_traiter',
      createdAt: new Date(),
      updatedAt: new Date(),
    } as unknown as ThesisQuestion);
    researchScopeRepository.findOne.mockResolvedValue({
      id: 'scope-1',
      userId,
      title: 'Scope',
      problematique: 'Problem',
      objectives: null,
    } as ResearchScope);
    researchDocumentRepository.find.mockResolvedValue([]);

    await expect(service.generateAnswer('question-1', userId)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should generate an answer draft and set status to brouillon', async () => {
    const userId = 'user-123';
    const questionEntity = {
      id: 'question-1',
      userId,
      researchScopeId: 'scope-1',
      code: 'Q1',
      section: 'S1',
      title: 'Question',
      questionText: 'Text',
      targetReferences: [],
      status: 'en_cours',
      createdAt: new Date(),
      updatedAt: new Date(),
    } as unknown as ThesisQuestion;

    thesisQuestionRepository.findOne.mockResolvedValue(questionEntity);
    researchScopeRepository.findOne.mockResolvedValue({
      id: 'scope-1',
      userId,
      title: 'Scope',
      problematique: 'Problem',
      objectives: null,
    } as ResearchScope);
    researchDocumentRepository.find.mockResolvedValue([
      {
        id: 'doc-1',
        userId,
        fileName: 'doc.pdf',
        bibliographicMetadata: { title: 'Doc title' },
        analysisStatus: 'completed',
        updatedAt: new Date(),
      } as unknown as ResearchDocument,
    ]);
    documentAnalysisRepository.find.mockResolvedValue([
      {
        id: 'analysis-1',
        documentId: 'doc-1',
        userId,
        summary: 'Summary',
        keyCitations: [
          {
            text: 'Evidence citation',
            pageNumber: 12,
            relevance: 'high',
            context: 'Context',
          },
        ],
        relevance: {
          score: 8,
          explanation: 'Relevant',
          alignedObjectives: [],
          recommendation: 'keep',
        },
        methodology: {
          type: 'qualitative',
          description: 'Desc',
          strengths: [],
          limitations: ['Limitation'],
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      } as unknown as DocumentAnalysis,
    ]);

    aiService.generateQuestionAnswerWithEvidence.mockResolvedValue({
      answerMarkdown: '## Reponse\nTexte',
      evidenceRows: [
        {
          claim: 'Claim',
          documentId: 'doc-1',
          fileName: 'doc.pdf',
          pageNumber: 12,
          sourceSnippet: 'Snippet',
          limitation: 'Limitation',
          confidence: 'high',
        },
      ],
      gaps: [],
      confidenceScore: 82,
    });

    thesisDraftRepository.findOne.mockResolvedValue(null);
    thesisDraftRepository.create.mockImplementation(
      (data) =>
        ({
          ...data,
          id: 'draft-1',
          createdAt: new Date(),
          updatedAt: new Date(),
          generatedAt: null,
        }) as ThesisAnswerDraft,
    );
    thesisDraftRepository.save.mockImplementation(
      async (draft) =>
        ({
          ...draft,
          id: 'draft-1',
          createdAt: new Date(),
          updatedAt: new Date(),
        }) as ThesisAnswerDraft,
    );
    thesisQuestionRepository.save.mockResolvedValue(questionEntity);

    const result = await service.generateAnswer('question-1', userId);

    expect(result.answerMarkdown).toContain('Reponse');
    expect(thesisQuestionRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'brouillon' }),
    );
  });
});
