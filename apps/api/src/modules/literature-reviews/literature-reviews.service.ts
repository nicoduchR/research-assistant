import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LiteratureReview } from '../../entities/literature-review.entity';
import { Citation } from '../../entities/citation.entity';
import { UpdateLiteratureReviewDto } from './dto/update-literature-review.dto';

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
        'You do not have permission to view this review',
      );
    }

    const citations = await this.citationRepository.find({
      where: { literatureReviewId: reviewId },
      order: { positionInReview: 'ASC' },
    });

    return { ...review, citations };
  }

  async updateReview(
    reviewId: string,
    userId: string,
    dto: UpdateLiteratureReviewDto,
  ): Promise<LiteratureReview & { citations: Citation[] }> {
    const review = await this.reviewRepository.findOne({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundException('Literature review not found');
    }

    if (review.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to view this review',
      );
    }

    if (dto.title !== undefined) review.title = dto.title;
    if (dto.content !== undefined) review.content = dto.content;

    const saved = await this.reviewRepository.save(review);
    const citations = await this.citationRepository.find({
      where: { literatureReviewId: saved.id },
      order: { positionInReview: 'ASC' },
    });

    return { ...saved, citations };
  }
}
