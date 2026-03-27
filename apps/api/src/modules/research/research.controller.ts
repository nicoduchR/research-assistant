import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import type { KeywordSuggestionsResponse } from '@repo/types';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ResearchService } from './research.service';
import { CreateResearchScopeDto } from './dto/create-research-scope.dto';

@Controller('research-scopes')
@UseGuards(JwtAuthGuard)
@Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 requests per minute
export class ResearchController {
  constructor(private readonly researchService: ResearchService) {}

  @Get()
  async getUserScope(@Req() req: any) {
    const userId = req.user.userId; // JWT payload uses 'userId', not 'id'
    const scope = await this.researchService.getUserScope(userId);

    // Return null if no scope exists (frontend handles this case)
    return scope || null;
  }

  @Get('keyword-suggestions')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  async getKeywordSuggestions(
    @Req() req: any,
  ): Promise<KeywordSuggestionsResponse> {
    const userId = req.user.userId;
    return this.researchService.generateKeywordSuggestions(userId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createOrUpdateScope(
    @Req() req: any,
    @Body() createScopeDto: CreateResearchScopeDto,
  ) {
    const userId = req.user.userId; // JWT payload uses 'userId', not 'id'
    return this.researchService.createOrUpdateScope(userId, createScopeDto);
  }
}
