import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set global API prefix
  app.setGlobalPrefix('api/v1');

  // Enable CORS for frontend
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  await app.listen(3001);
  console.log(`Application is running on: http://localhost:3001`);
  console.log(`Health check: http://localhost:3001/api/v1/health`);
}
bootstrap();
