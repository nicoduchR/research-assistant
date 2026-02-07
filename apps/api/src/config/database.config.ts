import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const databaseUrl = configService.get<string>('DATABASE_URL');

  if (!databaseUrl) {
    throw new Error(
      'DATABASE_URL is not configured. Please set it in your .env file. ' +
      'Example: DATABASE_URL=postgresql://user:password@localhost:5432/dbname'
    );
  }

  return {
    type: 'postgres',
    url: databaseUrl,
    entities: [__dirname + '/../entities/*.entity{.ts,.js}'],
    migrations: [__dirname + '/../migrations/*.{ts,js}'],
    migrationsRun: configService.get('AUTO_RUN_MIGRATIONS') === 'true',
    synchronize: false, // Always use migrations in production
    autoLoadEntities: true, // Automatic entity discovery
    logging: configService.get('NODE_ENV') === 'development',
    ssl:
      configService.get('NODE_ENV') === 'production'
        ? {
            rejectUnauthorized: false, // Required for some cloud providers (Coolify, Heroku)
            // In production with proper SSL certs, set rejectUnauthorized: true
          }
        : false,
  };
};
