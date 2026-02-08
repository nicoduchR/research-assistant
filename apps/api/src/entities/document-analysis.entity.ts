import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { User } from './user.entity';
import { ResearchDocument } from './research-document.entity';

@Entity('document_analyses')
export class DocumentAnalysis {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'document_id', type: 'uuid', unique: true })
  documentId: string;

  @ManyToOne(() => ResearchDocument, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'document_id' })
  document: ResearchDocument;

  @Column({ name: 'user_id', type: 'uuid' })
  @Index('idx_document_analyses_user_id')
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'text' })
  summary: string;

  @Column({ name: 'key_citations', type: 'jsonb', default: '[]' })
  keyCitations: Array<{
    text: string;
    pageNumber: number | null;
    relevance: 'high' | 'medium' | 'low';
    context: string;
  }>;

  @Column({ type: 'jsonb' })
  relevance: {
    score: number;
    explanation: string;
    alignedObjectives: string[];
    recommendation: 'keep' | 'maybe' | 'skip';
  };

  @Column({ type: 'jsonb' })
  methodology: {
    type: string;
    description: string;
    strengths: string[];
    limitations: string[];
  };

  @Column({ name: 'error_message', type: 'text', nullable: true })
  errorMessage: string | null;

  @Column({ name: 'analyzed_at', type: 'timestamp', nullable: true })
  analyzedAt: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
