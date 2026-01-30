import { ConfigService } from '@nestjs/config';
import { getDatabaseConfig } from './database.config';

describe('Database Configuration', () => {
  let configService: ConfigService;

  beforeEach(() => {
    configService = new ConfigService({
      DATABASE_URL: 'postgresql://test:test@localhost:5432/test_db',
      NODE_ENV: 'development',
    });
  });

  it('should return TypeORM configuration with correct type', () => {
    const config = getDatabaseConfig(configService) as any;

    expect(config.type).toBe('postgres');
  });

  it('should use DATABASE_URL from config service', () => {
    const config = getDatabaseConfig(configService) as any;

    expect(config.url).toBe('postgresql://test:test@localhost:5432/test_db');
  });

  it('should have synchronize set to false', () => {
    const config = getDatabaseConfig(configService) as any;

    expect(config.synchronize).toBe(false);
  });

  it('should enable logging in development environment', () => {
    const config = getDatabaseConfig(configService) as any;

    expect(config.logging).toBe(true);
  });

  it('should disable logging in production environment', () => {
    const prodConfigService = new ConfigService({
      DATABASE_URL: 'postgresql://test:test@localhost:5432/test_db',
      NODE_ENV: 'production',
    });

    const config = getDatabaseConfig(prodConfigService) as any;

    expect(config.logging).toBe(false);
  });

  it('should enable SSL in production', () => {
    const prodConfigService = new ConfigService({
      DATABASE_URL: 'postgresql://test:test@localhost:5432/test_db',
      NODE_ENV: 'production',
    });

    const config = getDatabaseConfig(prodConfigService) as any;

    expect(config.ssl).toEqual({ rejectUnauthorized: false });
  });

  it('should disable SSL in development', () => {
    const config = getDatabaseConfig(configService) as any;

    expect(config.ssl).toBe(false);
  });

  it('should configure entities path', () => {
    const config = getDatabaseConfig(configService) as any;

    expect(config.entities).toBeDefined();
    expect(Array.isArray(config.entities)).toBe(true);
  });

  it('should configure migrations path', () => {
    const config = getDatabaseConfig(configService) as any;

    expect(config.migrations).toBeDefined();
    expect(Array.isArray(config.migrations)).toBe(true);
  });

  it('should enable autoLoadEntities', () => {
    const config = getDatabaseConfig(configService) as any;

    expect(config.autoLoadEntities).toBe(true);
  });

  it('should throw error when DATABASE_URL is not set', () => {
    const emptyConfigService = new ConfigService({
      NODE_ENV: 'development',
    });

    expect(() => getDatabaseConfig(emptyConfigService)).toThrow(
      /DATABASE_URL is not configured/,
    );
  });
});
