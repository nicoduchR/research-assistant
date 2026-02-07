import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LiteratureReview } from '../../entities/literature-review.entity';
import { Citation } from '../../entities/citation.entity';
import { LiteratureReviewsService } from './literature-reviews.service';
import { LiteratureReviewsController } from './literature-reviews.controller';

@Module({
  imports: [TypeOrmModule.forFeature([LiteratureReview, Citation])],
  providers: [LiteratureReviewsService],
  controllers: [LiteratureReviewsController],
})
export class LiteratureReviewsModule {}
