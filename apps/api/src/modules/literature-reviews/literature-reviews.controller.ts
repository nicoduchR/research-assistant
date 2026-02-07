import {
  Controller,
  Get,
  Param,
  Req,
  UseGuards,
  BadRequestException,
  ParseUUIDPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { LiteratureReviewsService } from './literature-reviews.service';

@Controller('literature-reviews')
@UseGuards(JwtAuthGuard)
export class LiteratureReviewsController {
  constructor(
    private readonly literatureReviewsService: LiteratureReviewsService,
  ) {}

  @Get(':id')
  async getReview(@Req() req: any, @Param('id', ParseUUIDPipe) id: string) {
    if (!req.user || !req.user.userId) {
      throw new BadRequestException('Invalid authentication token');
    }

    const review = await this.literatureReviewsService.getReview(
      id,
      req.user.userId,
    );

    return {
      id: review.id,
      title: review.title,
      content: review.content,
      documentIds: review.documentIds,
      citations: review.citations.map((c) => ({
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
