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
