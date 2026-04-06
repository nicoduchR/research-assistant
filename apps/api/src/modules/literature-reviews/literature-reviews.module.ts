import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LiteratureReview } from '../../entities/literature-review.entity';
import { Citation } from '../../entities/citation.entity';
import { ResearchDocument } from '../../entities/research-document.entity';
import { AuthModule } from '../../auth/auth.module';
import { LiteratureReviewsService } from './literature-reviews.service';
import { LiteratureReviewsController } from './literature-reviews.controller';
import { BibliographyExportService } from './bibliography-export.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([LiteratureReview, Citation, ResearchDocument]),
    AuthModule,
  ],
  providers: [LiteratureReviewsService, BibliographyExportService],
  controllers: [LiteratureReviewsController],
})
export class LiteratureReviewsModule {}
