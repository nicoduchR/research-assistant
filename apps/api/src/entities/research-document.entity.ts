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

@Entity('research_documents')
export class ResearchDocument {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid', nullable: false })
  @Index('idx_research_documents_user_id')
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'file_name', type: 'varchar', length: 255, nullable: false })
  fileName: string;

  @Column({ name: 'file_size', type: 'bigint', nullable: false })
  fileSize: number;

  @Column({ name: 'mime_type', type: 'varchar', length: 100, nullable: false })
  mimeType: string;

  @Column({
    name: 'storage_path',
    type: 'varchar',
    length: 500,
    nullable: false,
  })
  storagePath: string;

  @Column({ name: 'page_count', type: 'integer', nullable: true })
  pageCount: number | null;

  @Column({ name: 'text_extracted', type: 'boolean', default: false })
  textExtracted: boolean;

  @Column({ name: 'extraction_error', type: 'text', nullable: true })
  extractionError: string | null;

  @Column({ name: 'extracted_text', type: 'text', nullable: true })
  extractedText: string | null;

  @Column({ type: 'jsonb', nullable: true, name: 'bibliographic_metadata' })
  bibliographicMetadata: {
    authors?: Array<{ given: string; family: string }>;
    title?: string;
    year?: number;
    journal?: string;
    volume?: string;
    issue?: string;
    pages?: string;
    doi?: string;
    publisher?: string;
    url?: string;
    type?: string;
  } | null;

  @CreateDateColumn({ name: 'uploaded_at' })
  uploadedAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
