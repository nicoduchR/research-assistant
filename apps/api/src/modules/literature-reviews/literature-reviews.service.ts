import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { LiteratureReview } from '../../entities/literature-review.entity';
import { Citation } from '../../entities/citation.entity';
import { ResearchDocument } from '../../entities/research-document.entity';
import { UpdateLiteratureReviewDto } from './dto/update-literature-review.dto';
import { BibliographyExportService } from './bibliography-export.service';

@Injectable()
export class LiteratureReviewsService {
  constructor(
    @InjectRepository(LiteratureReview)
    private reviewRepository: Repository<LiteratureReview>,
    @InjectRepository(Citation)
    private citationRepository: Repository<Citation>,
    @InjectRepository(ResearchDocument)
    private documentRepository: Repository<ResearchDocument>,
    private readonly bibliographyExportService: BibliographyExportService,
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

  async exportBibliography(
    reviewId: string,
    userId: string,
    format: string,
  ): Promise<{
    content: string;
    filename: string;
    warnings: string[];
  }> {
    const review = await this.reviewRepository.findOne({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundException('Literature review not found');
    }

    if (review.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to access this review',
      );
    }

    // Load citations for this review
    const citations = await this.citationRepository.find({
      where: { literatureReviewId: reviewId },
      order: { positionInReview: 'ASC' },
    });

    // Get unique document IDs from citations
    const uniqueDocumentIds = [
      ...new Set(citations.map((c) => c.documentId)),
    ];

    // Load documents with bibliographic metadata
    const documents =
      uniqueDocumentIds.length > 0
        ? await this.documentRepository.find({
            where: { id: In(uniqueDocumentIds) },
          })
        : [];

    // Build documents with metadata for the formatter
    const documentsWithMetadata = documents.map((doc) => ({
      id: doc.id,
      metadata: doc.bibliographicMetadata,
      fileName: doc.fileName,
    }));

    const validFormat = format as 'apa' | 'mla' | 'chicago' | 'bibtex';
    const result = this.bibliographyExportService.formatBibliography(
      documentsWithMetadata,
      validFormat,
    );

    const filename =
      format === 'bibtex'
        ? `bibliography-${reviewId}.bib`
        : `bibliography-${format}-${reviewId}.txt`;

    return {
      content: result.content,
      filename,
      warnings: result.warnings,
    };
  }
}
