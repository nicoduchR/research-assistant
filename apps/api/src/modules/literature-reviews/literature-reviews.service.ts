import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LiteratureReview } from '../../entities/literature-review.entity';
import { Citation } from '../../entities/citation.entity';

@Injectable()
export class LiteratureReviewsService {
  constructor(
    @InjectRepository(LiteratureReview)
    private reviewRepository: Repository<LiteratureReview>,
    @InjectRepository(Citation)
    private citationRepository: Repository<Citation>,
  ) {}

  async getReview(
    reviewId: string,
    userId: string,
  ): Promise<LiteratureReview & { citations: Citation[] }> {
    const review = await this.reviewRepository.findOne({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundException('Literature review not found');
    }

    if (review.userId !== userId) {
      throw new ForbiddenException(
        'You do not have access to this literature review',
      );
    }

    const citations = await this.citationRepository.find({
      where: { literatureReviewId: reviewId },
      order: { positionInReview: 'ASC' },
    });

    return { ...review, citations };
  }
}
