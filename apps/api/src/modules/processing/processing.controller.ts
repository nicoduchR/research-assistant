import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
  BadRequestException,
  ParseUUIDPipe,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { CombinedAuthGuard } from '../../auth/guards/combined-auth.guard';
import { ProcessingService } from './processing.service';
import { CreateProcessingJobDto } from './dto/create-processing-job.dto';
import { ProcessingJobResponseDto } from './dto/processing-job-response.dto';
import { ProcessingJob, ProcessingJobStatus } from '../../entities/processing-job.entity';

@Controller('processing-jobs')
@UseGuards(CombinedAuthGuard)
export class ProcessingController {
  constructor(private readonly processingService: ProcessingService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  async createJob(
    @Req() req: any,
    @Body() body: CreateProcessingJobDto,
  ): Promise<ProcessingJobResponseDto> {
    if (!req.user || !req.user.userId) {
      throw new BadRequestException('Invalid authentication token');
    }

    const job = await this.processingService.createJob(
      req.user.userId,
      body.documentIds,
    );
    return this.toResponseDto(job);
  }

  @Get(':id')
  async getJob(
    @Req() req: any,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ProcessingJobResponseDto> {
    if (!req.user || !req.user.userId) {
      throw new BadRequestException('Invalid authentication token');
    }

    const job = await this.processingService.getJob(id, req.user.userId);
    return this.toResponseDto(job);
  }

  private toResponseDto(job: ProcessingJob): ProcessingJobResponseDto {
    const dto: ProcessingJobResponseDto = {
      id: job.id,
      status: job.status,
      documentIds: job.documentIds,
      resultId: job.resultId,
      errorMessage: job.errorMessage,
      progressPercentage: job.progressPercentage,
      progressMessage: job.progressMessage,
      queuedAt: job.queuedAt.toISOString(),
      startedAt: job.startedAt?.toISOString() ?? null,
      completedAt: job.completedAt?.toISOString() ?? null,
    };
    if (job.skippedDocuments) {
      dto.skippedDocuments = job.skippedDocuments;
    }
    if (job.processedDocumentCount != null) {
      dto.processedDocumentCount = job.processedDocumentCount;
    }
    if (job.status === ProcessingJobStatus.FAILED && job.errorMessage) {
      if (job.errorMessage.includes('No documents with extracted text')) {
        dto.failureType = 'no_documents';
      } else if (
        job.errorMessage.includes('AI service') ||
        job.errorMessage.includes('rate limited') ||
        job.errorMessage.includes('unavailable')
      ) {
        dto.failureType = 'ai_error';
      } else {
        dto.failureType = 'unknown';
      }
    }
    return dto;
  }
}
