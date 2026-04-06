import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { CombinedAuthGuard } from '../../auth/guards/combined-auth.guard';
import { ThesisQuestionsService } from './thesis-questions.service';
import { UpdateThesisQuestionDto } from './dto/update-thesis-question.dto';
import { UpsertThesisDraftDto } from './dto/upsert-thesis-draft.dto';

@Controller('thesis-questions')
@UseGuards(CombinedAuthGuard)
export class ThesisQuestionsController {
  constructor(
    private readonly thesisQuestionsService: ThesisQuestionsService,
  ) {}

  @Post('bootstrap')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  async bootstrap(@Req() req: any) {
    this.assertUser(req);
    return this.thesisQuestionsService.bootstrapQuestions(req.user.userId);
  }

  @Get()
  async listQuestions(@Req() req: any) {
    this.assertUser(req);
    return this.thesisQuestionsService.listQuestions(req.user.userId);
  }

  @Patch(':id')
  async updateQuestion(
    @Req() req: any,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateThesisQuestionDto,
  ) {
    this.assertUser(req);
    return this.thesisQuestionsService.updateQuestion(id, req.user.userId, dto);
  }

  @Post(':id/generate-answer')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  async generateAnswer(
    @Req() req: any,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    this.assertUser(req);
    return this.thesisQuestionsService.generateAnswer(id, req.user.userId);
  }

  @Get(':id/draft')
  async getDraft(
    @Req() req: any,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    this.assertUser(req);
    return this.thesisQuestionsService.getDraft(id, req.user.userId);
  }

  @Put(':id/draft')
  async upsertDraft(
    @Req() req: any,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpsertThesisDraftDto,
  ) {
    this.assertUser(req);
    return this.thesisQuestionsService.upsertDraft(id, req.user.userId, dto);
  }

  @Post(':id/ebsco-queries')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  async generateEbscoQueries(
    @Req() req: any,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    this.assertUser(req);
    return this.thesisQuestionsService.generateEbscoQueries(
      id,
      req.user.userId,
    );
  }

  private assertUser(req: any): void {
    if (!req.user || !req.user.userId) {
      throw new BadRequestException('Invalid authentication token');
    }
  }
}
