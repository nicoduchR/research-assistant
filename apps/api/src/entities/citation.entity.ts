import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { LiteratureReview } from './literature-review.entity';
import { ResearchDocument } from './research-document.entity';

@Entity('citations')
export class Citation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'literature_review_id', type: 'uuid' })
  @Index('idx_citations_literature_review_id')
  literatureReviewId: string;

  @ManyToOne(() => LiteratureReview, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'literature_review_id' })
  literatureReview: LiteratureReview;

  @Column({ name: 'document_id', type: 'uuid' })
  @Index('idx_citations_document_id')
  documentId: string;

  @ManyToOne(() => ResearchDocument, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'document_id' })
  document: ResearchDocument;

  @Column({ name: 'page_number', type: 'integer', nullable: true })
  pageNumber: number | null;

  @Column({ name: 'claim_text', type: 'text' })
  claimText: string;

  @Column({ name: 'position_in_review', type: 'integer' })
  positionInReview: number;

  @Column({ name: 'is_verified', type: 'boolean', default: false })
  isVerified: boolean;

  @Column({ name: 'user_notes', type: 'text', nullable: true })
  userNotes: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
