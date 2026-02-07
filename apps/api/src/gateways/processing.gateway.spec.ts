import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ProcessingGateway } from './processing.gateway';

describe('ProcessingGateway', () => {
  let gateway: ProcessingGateway;
  let jwtService: JwtService;

  const createMockClient = (overrides: Record<string, unknown> = {}) => ({
    id: 'test-client-id',
    handshake: { headers: {} },
    data: {},
    disconnect: jest.fn(),
    join: jest.fn(),
    ...overrides,
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProcessingGateway,
        {
          provide: JwtService,
          useValue: {
            verify: jest.fn(),
          },
        },
      ],
    }).compile();

    gateway = module.get<ProcessingGateway>(ProcessingGateway);
    jwtService = module.get<JwtService>(JwtService);

    // Mock the WebSocket server
    const mockEmit = jest.fn();
    gateway.server = {
      to: jest.fn().mockReturnValue({ emit: mockEmit }),
    } as any;
  });

  describe('handleConnection', () => {
    it('should reject client with no cookies', async () => {
      const client = createMockClient() as any;

      await gateway.handleConnection(client);

      expect(client.disconnect).toHaveBeenCalled();
      expect(client.join).not.toHaveBeenCalled();
    });

    it('should reject client with cookies but no access_token', async () => {
      const client = createMockClient({
        handshake: { headers: { cookie: 'session=abc; other=xyz' } },
      }) as any;

      await gateway.handleConnection(client);

      expect(client.disconnect).toHaveBeenCalled();
      expect(client.join).not.toHaveBeenCalled();
    });

    it('should reject client with invalid JWT', async () => {
      (jwtService.verify as jest.Mock).mockImplementation(() => {
        throw new Error('jwt expired');
      });

      const client = createMockClient({
        handshake: { headers: { cookie: 'access_token=expired-token' } },
      }) as any;

      await gateway.handleConnection(client);

      expect(jwtService.verify).toHaveBeenCalledWith('expired-token');
      expect(client.disconnect).toHaveBeenCalled();
      expect(client.join).not.toHaveBeenCalled();
    });

    it('should reject client when token payload has no sub claim', async () => {
      (jwtService.verify as jest.Mock).mockReturnValue({ email: 'test@test.com' });

      const client = createMockClient({
        handshake: { headers: { cookie: 'access_token=valid-no-sub' } },
      }) as any;

      await gateway.handleConnection(client);

      expect(client.disconnect).toHaveBeenCalled();
      expect(client.join).not.toHaveBeenCalled();
    });

    it('should accept client with valid JWT and join user room', async () => {
      (jwtService.verify as jest.Mock).mockReturnValue({ sub: 'user-123', email: 'test@test.com' });

      const client = createMockClient({
        handshake: { headers: { cookie: 'access_token=valid-jwt-token' } },
      }) as any;

      await gateway.handleConnection(client);

      expect(client.disconnect).not.toHaveBeenCalled();
      expect(client.data.userId).toBe('user-123');
      expect(client.join).toHaveBeenCalledWith('user:user-123');
    });

    it('should extract token correctly when access_token is not the first cookie', async () => {
      (jwtService.verify as jest.Mock).mockReturnValue({ sub: 'user-456' });

      const client = createMockClient({
        handshake: { headers: { cookie: 'session=abc; access_token=my-jwt; other=xyz' } },
      }) as any;

      await gateway.handleConnection(client);

      expect(jwtService.verify).toHaveBeenCalledWith('my-jwt');
      expect(client.data.userId).toBe('user-456');
      expect(client.join).toHaveBeenCalledWith('user:user-456');
    });
  });

  describe('emitProgress', () => {
    it('should emit progress event to correct user room with timestamp', () => {
      const mockEmit = jest.fn();
      gateway.server.to = jest.fn().mockReturnValue({ emit: mockEmit });

      gateway.emitProgress('user-123', {
        jobId: 'job-1',
        progressPercentage: 50,
        progressMessage: 'Processing...',
      });

      expect(gateway.server.to).toHaveBeenCalledWith('user:user-123');
      expect(mockEmit).toHaveBeenCalledWith(
        'processing:progress',
        expect.objectContaining({
          jobId: 'job-1',
          progressPercentage: 50,
          progressMessage: 'Processing...',
          timestamp: expect.any(String),
        }),
      );
    });
  });

  describe('emitComplete', () => {
    it('should emit complete event to correct user room with timestamp', () => {
      const mockEmit = jest.fn();
      gateway.server.to = jest.fn().mockReturnValue({ emit: mockEmit });

      gateway.emitComplete('user-123', {
        jobId: 'job-1',
        resultId: 'result-1',
      });

      expect(gateway.server.to).toHaveBeenCalledWith('user:user-123');
      expect(mockEmit).toHaveBeenCalledWith(
        'processing:complete',
        expect.objectContaining({
          jobId: 'job-1',
          resultId: 'result-1',
          timestamp: expect.any(String),
        }),
      );
    });
  });

  describe('emitError', () => {
    it('should emit error event to correct user room with timestamp', () => {
      const mockEmit = jest.fn();
      gateway.server.to = jest.fn().mockReturnValue({ emit: mockEmit });

      gateway.emitError('user-123', {
        jobId: 'job-1',
        errorMessage: 'Something went wrong',
      });

      expect(gateway.server.to).toHaveBeenCalledWith('user:user-123');
      expect(mockEmit).toHaveBeenCalledWith(
        'processing:error',
        expect.objectContaining({
          jobId: 'job-1',
          errorMessage: 'Something went wrong',
          timestamp: expect.any(String),
        }),
      );
    });
  });
});
