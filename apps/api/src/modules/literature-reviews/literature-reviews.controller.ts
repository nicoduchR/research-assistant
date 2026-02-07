import {
  Controller,
  Get,
  Put,
  Param,
  Body,
  Query,
  Req,
  UseGuards,
  BadRequestException,
  ParseUUIDPipe,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { LiteratureReviewsService } from './literature-reviews.service';
import { UpdateLiteratureReviewDto } from './dto/update-literature-review.dto';
import { ExportBibliographyDto } from './dto/export-bibliography.dto';

@Controller('literature-reviews')
@UseGuards(JwtAuthGuard)
export class LiteratureReviewsController {
  constructor(
    private readonly literatureReviewsService: LiteratureReviewsService,
  ) {}

  @Get(':id/bibliography')
  async exportBibliography(
    @Req() req: any,
    @Param('id', ParseUUIDPipe) id: string,
    @Query(new ValidationPipe({ transform: true }))
    query: ExportBibliographyDto,
  ) {
    if (!req.user || !req.user.userId) {
      throw new BadRequestException('Invalid authentication token');
    }
    return this.literatureReviewsService.exportBibliography(
      id,
      req.user.userId,
      query.format,
    );
  }

  @Get(':id')
  async getReview(@Req() req: any, @Param('id', ParseUUIDPipe) id: string) {
    if (!req.user || !req.user.userId) {
      throw new BadRequestException('Invalid authentication token');
    }

    const review = await this.literatureReviewsService.getReview(
      id,
      req.user.userId,
    );

    return this.mapToResponse(review);
  }

  @Put(':id')
  async updateReview(
    @Req() req: any,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateLiteratureReviewDto,
  ) {
    if (!req.user || !req.user.userId) {
      throw new BadRequestException('Invalid authentication token');
    }

    const review = await this.literatureReviewsService.updateReview(
      id,
      req.user.userId,
      dto,
    );

    return this.mapToResponse(review);
  }

  private mapToResponse(review: any) {
    return {
      id: review.id,
      jobId: review.jobId,
      title: review.title,
      content: review.content,
      documentIds: review.documentIds,
      citations: review.citations.map((c: any) => ({
        id: c.id,
        documentId: c.documentId,
        pageNumber: c.pageNumber,
        claimText: c.claimText,
        positionInReview: c.positionInReview,
        isVerified: c.isVerified,
        userNotes: c.userNotes,
      })),
      createdAt: review.createdAt.toISOString(),
      updatedAt: review.updatedAt.toISOString(),
    };
  }
}
