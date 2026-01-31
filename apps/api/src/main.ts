import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { AppDataSource } from './config/typeorm-cli.config';

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
  // Run migrations before starting the app (development only)
  if (process.env.AUTO_RUN_MIGRATIONS === 'true') {
    await runMigrations();
  }

  const app = await NestFactory.create(AppModule);

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
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  await app.listen(3001);
  console.log(`Application is running on: http://localhost:3001`);
  console.log(`Health check: http://localhost:3001/api/v1/health`);
}
bootstrap();
