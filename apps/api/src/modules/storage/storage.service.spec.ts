import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { StorageService } from './storage.service';
import * as fs from 'fs/promises';
import * as path from 'path';

jest.mock('fs/promises');

describe('StorageService', () => {
  let service: StorageService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StorageService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string, defaultValue: string) => defaultValue),
          },
        },
      ],
    }).compile();

    service = module.get<StorageService>(StorageService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('ensureBaseDirectory', () => {
    it('should create base upload directory', async () => {
      (fs.mkdir as jest.Mock).mockResolvedValue(undefined);

      await service.ensureBaseDirectory();

      expect(fs.mkdir).toHaveBeenCalledWith('./uploads', { recursive: true });
    });

    it('should throw error if directory creation fails', async () => {
      const error = new Error('Permission denied');
      (fs.mkdir as jest.Mock).mockRejectedValue(error);

      await expect(service.ensureBaseDirectory()).rejects.toThrow(
        'Permission denied',
      );
    });
  });

  describe('ensureUserUploadDirectory', () => {
    const validUserId = '550e8400-e29b-41d4-a716-446655440000';

    it('should create user-specific directory with valid UUID', async () => {
      (fs.mkdir as jest.Mock).mockResolvedValue(undefined);

      const result = await service.ensureUserUploadDirectory(validUserId);

      expect(fs.mkdir).toHaveBeenCalledWith(
        path.join('./uploads', validUserId),
        { recursive: true },
      );
      expect(result).toBe(path.join('./uploads', validUserId));
    });

    it('should throw error if userId is null', async () => {
      await expect(
        service.ensureUserUploadDirectory(null as any),
      ).rejects.toThrow('Invalid userId: must be a non-empty string');
    });

    it('should throw error if userId is empty string', async () => {
      await expect(
        service.ensureUserUploadDirectory(''),
      ).rejects.toThrow('Invalid userId: must be a non-empty string');
    });

    it('should throw error if userId contains path traversal (..)', async () => {
      await expect(
        service.ensureUserUploadDirectory('../etc/passwd'),
      ).rejects.toThrow('Invalid userId: path traversal detected');
    });

    it('should throw error if userId contains forward slash', async () => {
      await expect(
        service.ensureUserUploadDirectory('user/123'),
      ).rejects.toThrow('Invalid userId: path traversal detected');
    });

    it('should throw error if userId contains backslash', async () => {
      await expect(
        service.ensureUserUploadDirectory('user\\123'),
      ).rejects.toThrow('Invalid userId: path traversal detected');
    });

    it('should throw error if userId is not valid UUID format', async () => {
      await expect(
        service.ensureUserUploadDirectory('not-a-uuid'),
      ).rejects.toThrow('Invalid userId: must be a valid UUID format');
    });

    it('should throw error if user directory creation fails', async () => {
      const error = new Error('Disk full');
      (fs.mkdir as jest.Mock).mockRejectedValue(error);

      await expect(
        service.ensureUserUploadDirectory(validUserId),
      ).rejects.toThrow('Disk full');
    });
  });

  describe('getStoragePath', () => {
    it('should generate correct storage path pattern', () => {
      const userId = 'user-123';
      const documentId = 'doc-456';

      const result = service.getStoragePath(userId, documentId);

      expect(result).toBe(path.join('./uploads', userId, `${documentId}.pdf`));
    });

    it('should handle UUIDs correctly', () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const documentId = '987fcdeb-51a2-43f1-9876-543210987654';

      const result = service.getStoragePath(userId, documentId);

      expect(result).toBe(
        path.join('./uploads', userId, `${documentId}.pdf`),
      );
    });
  });

  describe('getAbsoluteStoragePath', () => {
    it('should return absolute path', () => {
      const userId = 'user-123';
      const documentId = 'doc-456';

      const result = service.getAbsoluteStoragePath(userId, documentId);

      const expected = path.resolve(
        path.join('./uploads', userId, `${documentId}.pdf`),
      );
      expect(result).toBe(expected);
    });
  });

  describe('getUploadBasePath', () => {
    it('should return the configured upload base path', () => {
      const result = service.getUploadBasePath();

      expect(result).toBe('./uploads');
    });
  });

  describe('configuration', () => {
    it('should use custom UPLOAD_BASE_PATH from config', async () => {
      const customPath = '/custom/path';
      (configService.get as jest.Mock).mockReturnValue(customPath);

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          StorageService,
          {
            provide: ConfigService,
            useValue: {
              get: jest.fn().mockReturnValue(customPath),
            },
          },
        ],
      }).compile();

      const customService = module.get<StorageService>(StorageService);
      (fs.mkdir as jest.Mock).mockResolvedValue(undefined);

      await customService.ensureBaseDirectory();

      expect(fs.mkdir).toHaveBeenCalledWith(customPath, { recursive: true });
    });
  });
});
