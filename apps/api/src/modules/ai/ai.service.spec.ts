import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { AiService } from './ai.service';

describe('AiService thesis parsing', () => {
  let service: AiService;
  let configService: jest.Mocked<ConfigService>;
  const createMock = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('claude-sonnet-test'),
          },
        },
      ],
    }).compile();

    service = module.get(AiService);
    configService = module.get(ConfigService);

    (service as any).client = {
      messages: {
        create: createMock,
      },
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should parse question answer JSON with evidence rows', async () => {
    createMock.mockResolvedValue({
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            answerMarkdown: '## Reponse\nTexte academique',
            evidenceRows: [
              {
                claim: 'Claim test',
                documentId: '00000000-0000-4000-8000-000000000001',
                fileName: 'doc-a.pdf',
                pageNumber: 14,
                sourceSnippet: 'Snippet test',
                limitation: 'Limitation test',
                confidence: 'high',
              },
            ],
            gaps: ['Gap test'],
            confidenceScore: 80,
          }),
        },
      ],
      usage: { input_tokens: 100, output_tokens: 200 },
    });

    const result = await service.generateQuestionAnswerWithEvidence(
      {
        title: 'Scope',
        problematique: 'Problematique',
        objectives: null,
      },
      {
        code: 'Q1',
        section: 'S1',
        title: 'Question',
        questionText: 'Question text',
        targetReferences: ['Vial (2019)'],
      },
      [
        {
          id: '00000000-0000-4000-8000-000000000001',
          fileName: 'doc-a.pdf',
          summary: 'Summary',
          keyCitations: [
            {
              text: 'Citation',
              context: 'Context',
              relevance: 'high',
            },
          ],
        },
      ],
    );

    expect(configService.get).toHaveBeenCalled();
    expect(result.answerMarkdown).toContain('Reponse');
    expect(result.evidenceRows).toHaveLength(1);
    expect(result.confidenceScore).toBe(80);
  });

  it('should parse EBSCO query suggestions JSON', async () => {
    createMock.mockResolvedValue({
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            queries: [
              {
                label: 'Cadres SI',
                query: '"digital transformation" AND "information systems"',
                rationale: 'Approfondit la base theorique SI.',
                intent: 'deepen',
              },
            ],
          }),
        },
      ],
      usage: { input_tokens: 80, output_tokens: 120 },
    });

    const result = await service.generateQuestionScopedEbscoQueries(
      {
        title: 'Scope',
        problematique: 'Problematique',
        objectives: null,
      },
      {
        code: 'Q3',
        section: 'S1',
        title: 'Cadres',
        questionText: 'Question text',
        targetReferences: ['Vial (2019)'],
      },
      [
        {
          id: '00000000-0000-4000-8000-000000000001',
          fileName: 'doc-a.pdf',
          summary: 'Summary',
        },
      ],
    );

    expect(result).toHaveLength(1);
    expect(result[0].intent).toBe('deepen');
    expect(result[0].query).toContain('digital transformation');
  });
});
