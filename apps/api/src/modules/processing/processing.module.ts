import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { ResearchDocument } from '../../entities/research-document.entity';
import { ProcessingJob } from '../../entities/processing-job.entity';
import { LiteratureReview } from '../../entities/literature-review.entity';
import { Citation } from '../../entities/citation.entity';
import { AiModule } from '../ai/ai.module';
import { ProcessingGatewayModule } from '../../gateways/processing-gateway.module';
import { PdfExtractionProcessor } from '../../jobs/pdf-extraction.processor';
import { LiteratureProcessingProcessor } from '../../jobs/literature-processing.processor';
import { BibliographyMetadataService } from '../documents/bibliography-metadata.service';
import { ProcessingService } from './processing.service';
import { ProcessingController } from './processing.controller';

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
    BullModule.registerQueue({
      name: 'literature-processing',
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 3000,
        },
        removeOnComplete: 100,
        removeOnFail: 500,
      },
    }),
    TypeOrmModule.forFeature([ResearchDocument, ProcessingJob, LiteratureReview, Citation]),
    HttpModule,
    AiModule,
    ProcessingGatewayModule,
  ],
  providers: [PdfExtractionProcessor, LiteratureProcessingProcessor, BibliographyMetadataService, ProcessingService],
  controllers: [ProcessingController],
  exports: [BullModule], // Export queues for other modules
})
export class ProcessingModule {}
