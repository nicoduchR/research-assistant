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

// Defined locally (not imported from @repo/types) because @repo/types serves raw
// TypeScript and its extensionless relative imports fail under Node.js ESM resolution
// at runtime. Keep in sync with packages/types/src/processing.ts.
export enum ProcessingJobStatus {
  QUEUED = 'queued',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

@Entity('processing_jobs')
export class ProcessingJob {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  @Index('idx_processing_jobs_user_id')
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    type: 'enum',
    enum: ProcessingJobStatus,
    default: ProcessingJobStatus.QUEUED,
  })
  status: ProcessingJobStatus;

  @Column({ name: 'document_ids', type: 'jsonb' })
  documentIds: string[];

  @Column({ name: 'result_id', type: 'uuid', nullable: true })
  resultId: string | null;

  @Column({ name: 'error_message', type: 'text', nullable: true })
  errorMessage: string | null;

  @Column({ name: 'progress_percentage', type: 'integer', default: 0 })
  progressPercentage: number;

  @Column({ name: 'progress_message', type: 'text', nullable: true })
  progressMessage: string | null;

  @CreateDateColumn({ name: 'queued_at' })
  queuedAt: Date;

  @Column({ name: 'started_at', type: 'timestamp', nullable: true })
  startedAt: Date | null;

  @Column({ name: 'completed_at', type: 'timestamp', nullable: true })
  completedAt: Date | null;

  @Column({ name: 'skipped_documents', type: 'jsonb', nullable: true })
  skippedDocuments: Array<{
    documentId: string;
    fileName: string;
    reason: string;
  }> | null;

  @Column({ name: 'processed_document_count', type: 'int', nullable: true })
  processedDocumentCount: number | null;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
