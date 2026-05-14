import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import type {
  KeywordSuggestionsResponse,
  KeywordSuggestionRunSummary,
} from '@repo/types';
import { CombinedAuthGuard } from '../../auth/guards/combined-auth.guard';
import { ResearchService } from './research.service';
import { CreateResearchScopeDto } from './dto/create-research-scope.dto';

@Controller('research-scopes')
@UseGuards(CombinedAuthGuard)
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

  @Get('keyword-suggestions/latest')
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  async getLatestKeywordSuggestions(
    @Req() req: any,
  ): Promise<KeywordSuggestionsResponse | null> {
    const userId = req.user.userId;
    return this.researchService.getLatestKeywordSuggestionRun(userId);
  }

  @Get('keyword-suggestions/history')
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  async getKeywordSuggestionsHistory(
    @Req() req: any,
  ): Promise<KeywordSuggestionRunSummary[]> {
    const userId = req.user.userId;
    return this.researchService.listKeywordSuggestionRuns(userId);
  }

  @Get('keyword-suggestions/runs/:runId')
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  async getKeywordSuggestionRun(
    @Req() req: any,
    @Param('runId', ParseUUIDPipe) runId: string,
  ): Promise<KeywordSuggestionsResponse> {
    const userId = req.user.userId;
    return this.researchService.getKeywordSuggestionRun(userId, runId);
  }

  @Get('keyword-suggestions')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  async getKeywordSuggestions(
    @Req() req: any,
  ): Promise<KeywordSuggestionsResponse> {
    const userId = req.user.userId;
    return this.researchService.generateKeywordSuggestions(userId);
  }

  @Delete('keyword-suggestions/runs/:runId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteKeywordSuggestionRun(
    @Req() req: any,
    @Param('runId', ParseUUIDPipe) runId: string,
  ): Promise<void> {
    const userId = req.user.userId;
    await this.researchService.deleteKeywordSuggestionRun(userId, runId);
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
