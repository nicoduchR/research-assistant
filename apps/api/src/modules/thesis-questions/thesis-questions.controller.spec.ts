import { Test, TestingModule } from '@nestjs/testing';
import { ThesisQuestionsController } from './thesis-questions.controller';
import { ThesisQuestionsService } from './thesis-questions.service';

describe('ThesisQuestionsController', () => {
  let controller: ThesisQuestionsController;
  let service: jest.Mocked<ThesisQuestionsService>;

  const mockService = {
    bootstrapQuestions: jest.fn(),
    listQuestions: jest.fn(),
    updateQuestion: jest.fn(),
    generateAnswer: jest.fn(),
    getDraft: jest.fn(),
    upsertDraft: jest.fn(),
    generateEbscoQueries: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ThesisQuestionsController],
      providers: [
        {
          provide: ThesisQuestionsService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get(ThesisQuestionsController);
    service = module.get(ThesisQuestionsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should bootstrap questions for authenticated user', async () => {
    const req = { user: { userId: 'user-123' } };
    service.bootstrapQuestions.mockResolvedValue([] as any);

    await controller.bootstrap(req);

    expect(service.bootstrapQuestions).toHaveBeenCalledWith('user-123');
  });

  it('should generate answer for a question', async () => {
    const req = { user: { userId: 'user-123' } };
    service.generateAnswer.mockResolvedValue({
      id: 'draft-1',
      questionId: 'question-1',
    } as any);

    await controller.generateAnswer(req, 'question-1');

    expect(service.generateAnswer).toHaveBeenCalledWith(
      'question-1',
      'user-123',
    );
  });
});
