import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResearchDocument } from '../../entities/research-document.entity';
import { PdfExtractionProcessor } from '../../jobs/pdf-extraction.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'pdf-extraction',
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
        removeOnComplete: 100, // Keep last 100 completed jobs
        removeOnFail: 500, // Keep last 500 failed jobs for debugging
      },
    }),
    TypeOrmModule.forFeature([ResearchDocument]),
  ],
  providers: [PdfExtractionProcessor],
  exports: [BullModule], // Export queue for DocumentsService
})
export class ProcessingModule {}
