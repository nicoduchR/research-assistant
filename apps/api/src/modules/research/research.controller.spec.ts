import { Test, TestingModule } from '@nestjs/testing';
import { ResearchController } from './research.controller';
import { ResearchService } from './research.service';
import { CreateResearchScopeDto } from './dto/create-research-scope.dto';
import { ResearchScope } from '../../entities/research-scope.entity';

describe('ResearchController', () => {
  let controller: ResearchController;
  let service: jest.Mocked<ResearchService>;

  const mockResearchService = {
    getUserScope: jest.fn(),
    createOrUpdateScope: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResearchController],
      providers: [
        {
          provide: ResearchService,
          useValue: mockResearchService,
        },
      ],
    }).compile();

    controller = module.get<ResearchController>(ResearchController);
    service = module.get(ResearchService);
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
      } as ResearchScope;

      const req = { user: { userId } }; // JWT payload uses 'userId'
      service.getUserScope.mockResolvedValue(mockScope);

      const result = await controller.getUserScope(req);

      expect(service.getUserScope).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockScope);
    });

    it('should return null if user has no scope', async () => {
      const userId = 'user-123';
      const req = { user: { userId } }; // JWT payload uses 'userId'

      service.getUserScope.mockResolvedValue(null);

      const result = await controller.getUserScope(req);

      expect(service.getUserScope).toHaveBeenCalledWith(userId);
      expect(result).toBeNull();
    });
  });

  describe('createOrUpdateScope', () => {
    it('should create new scope successfully', async () => {
      const userId = 'user-123';
      const dto: CreateResearchScopeDto = {
        title: 'Test Title',
        problematique: '  '.repeat(25) + 'Test problematique',
        objectives: 'Test objectives',
      };

      const mockScope = {
        id: 'scope-123',
        userId,
        ...dto,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as ResearchScope;

      const req = { user: { userId } }; // JWT payload uses 'userId'
      service.createOrUpdateScope.mockResolvedValue(mockScope);

      const result = await controller.createOrUpdateScope(req, dto);

      expect(service.createOrUpdateScope).toHaveBeenCalledWith(userId, dto);
      expect(result).toEqual(mockScope);
    });

    it('should extract userId from JWT token in request', async () => {
      const userId = 'user-456';
      const dto: CreateResearchScopeDto = {
        title: 'Test',
        problematique: '  '.repeat(25) + 'Test',
      };

      const req = { user: { userId, email: 'test@example.com' } }; // JWT payload uses 'userId'
      service.createOrUpdateScope.mockResolvedValue({} as ResearchScope);

      await controller.createOrUpdateScope(req, dto);

      expect(service.createOrUpdateScope).toHaveBeenCalledWith(userId, dto);
    });
  });
});
