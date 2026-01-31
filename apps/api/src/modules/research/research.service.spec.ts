import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResearchService } from './research.service';
import { ResearchScope } from '../../entities/research-scope.entity';
import { CreateResearchScopeDto } from './dto/create-research-scope.dto';

describe('ResearchService', () => {
  let service: ResearchService;
  let repository: jest.Mocked<Repository<ResearchScope>>;

  const mockRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResearchService,
        {
          provide: getRepositoryToken(ResearchScope),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ResearchService>(ResearchService);
    repository = module.get(getRepositoryToken(ResearchScope));
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

      repository.findOne.mockResolvedValue(mockScope);

      const result = await service.getUserScope(userId);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { userId },
      });
      expect(result).toEqual(mockScope);
    });

    it('should return null if user scope does not exist', async () => {
      const userId = 'user-123';
      repository.findOne.mockResolvedValue(null);

      const result = await service.getUserScope(userId);

      expect(repository.findOne).toHaveBeenCalledWith({
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

      repository.findOne.mockResolvedValue(null);
      repository.create.mockReturnValue(newScope);
      repository.save.mockResolvedValue(newScope);

      const result = await service.createOrUpdateScope(userId, dto);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { userId },
      });
      expect(repository.create).toHaveBeenCalledWith({
        userId,
        title: dto.title.trim(),
        problematique: dto.problematique.trim(),
        objectives: dto.objectives?.trim(),
      });
      expect(repository.save).toHaveBeenCalledWith(newScope);
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

      repository.findOne.mockResolvedValue(existingScope);
      repository.save.mockResolvedValue({
        ...existingScope,
        title: dto.title.trim(),
        problematique: dto.problematique.trim(),
        objectives: dto.objectives?.trim() || null,
      });

      const result = await service.createOrUpdateScope(userId, dto);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { userId },
      });
      expect(repository.save).toHaveBeenCalled();
      expect(result.title).toBe(dto.title.trim());
      expect(result.problematique).toBe(dto.problematique.trim());
    });

    it('should trim whitespace from all fields', async () => {
      repository.findOne.mockResolvedValue(null);
      repository.create.mockImplementation((data) => data as ResearchScope);
      repository.save.mockImplementation((scope) =>
        Promise.resolve(scope as ResearchScope),
      );

      await service.createOrUpdateScope(userId, dto);

      expect(repository.create).toHaveBeenCalledWith({
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

      repository.findOne.mockResolvedValue(null);
      repository.create.mockImplementation((data) => data as ResearchScope);
      repository.save.mockImplementation((scope) =>
        Promise.resolve(scope as ResearchScope),
      );

      await service.createOrUpdateScope(userId, dtoWithoutObjectives);

      expect(repository.create).toHaveBeenCalledWith({
        userId,
        title: 'Test Title',
        problematique: 'Test problematique',
        objectives: null,
      });
    });
  });
});
