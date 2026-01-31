import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { AppDataSource } from './config/typeorm-cli.config';
import { StorageService } from './modules/storage/storage.service';

async function runMigrations() {
  try {
    console.log('🔄 Running database migrations...');
    await AppDataSource.initialize();
    await AppDataSource.runMigrations();
    console.log('✅ Migrations completed successfully');
    await AppDataSource.destroy();
  } catch (error) {
    console.error('❌ Migration failed:', error);
    // In development, we continue even if migrations fail
    // In production, you might want to throw the error
    if (process.env.NODE_ENV === 'production') {
      throw error;
    }
  }
}

async function bootstrap() {
  // Validate critical environment variables
  const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET'];
  const missingEnvVars = requiredEnvVars.filter((key) => !process.env[key]);

  if (missingEnvVars.length > 0) {
    console.error(
      `❌ Missing required environment variables: ${missingEnvVars.join(', ')}`,
    );
    console.error('   Please check your .env file');
    process.exit(1);
  }

  // Warn if FRONTEND_URL not set (CORS might fail in production)
  if (!process.env.FRONTEND_URL) {
    console.warn(
      '⚠️  FRONTEND_URL not set - defaulting to http://localhost:3000',
    );
    console.warn('   Set FRONTEND_URL for production deployments');
  }

  // Run migrations before starting the app (development only)
  if (process.env.AUTO_RUN_MIGRATIONS === 'true') {
    await runMigrations();
  }

  const app = await NestFactory.create(AppModule);

  // Storage directory initialization moved to StorageModule.onModuleInit()
  // for better lifecycle management and avoiding anti-patterns

  // Enable cookie parser
  app.use(cookieParser());

  // Enable validation pipe globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Set global API prefix
  app.setGlobalPrefix('api/v1');

  // Enable CORS for frontend with credentials
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  app.enableCors({
    origin: frontendUrl,
    credentials: true,
  });

  await app.listen(3001);
  console.log(`✅ Application is running on: http://localhost:3001`);
  console.log(`   API prefix: /api/v1`);
  console.log(`   Health check: http://localhost:3001/api/v1/health`);
  console.log(`   CORS origin: ${frontendUrl}`);
}
bootstrap();
