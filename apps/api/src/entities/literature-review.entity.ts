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
import { ProcessingJob } from './processing-job.entity';

@Entity('literature_reviews')
export class LiteratureReview {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  @Index('idx_literature_reviews_user_id')
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'job_id', type: 'uuid' })
  jobId: string;

  @ManyToOne(() => ProcessingJob, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'job_id' })
  job: ProcessingJob;

  @Column({ type: 'varchar', length: 500 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ name: 'document_ids', type: 'jsonb' })
  documentIds: string[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
