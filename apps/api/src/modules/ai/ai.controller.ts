import {
  Controller,
  Get,
  UseGuards,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AiService } from './ai.service';
import type { AiHealthResponse } from '@repo/types';

@ApiTags('ai')
@Controller('ai')
@UseGuards(JwtAuthGuard)
@Throttle({ default: { ttl: 60000, limit: 5 } })
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get('health')
  @ApiOperation({ summary: 'Check AI service connectivity' })
  @ApiResponse({ status: 200, description: 'AI service is healthy' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 429, description: 'Rate limit exceeded' })
  @ApiResponse({ status: 500, description: 'AI service unavailable' })
  async checkHealth(): Promise<AiHealthResponse> {
    try {
      return await this.aiService.checkHealth();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'AI service health check failed';

      if (message.includes('authentication failed')) {
        throw new HttpException(message, HttpStatus.BAD_GATEWAY);
      }
      if (message.includes('rate limited')) {
        throw new HttpException(message, HttpStatus.TOO_MANY_REQUESTS);
      }
      if (message.includes('temporarily unavailable')) {
        throw new HttpException(message, HttpStatus.SERVICE_UNAVAILABLE);
      }

      throw new InternalServerErrorException(message);
    }
  }
}
