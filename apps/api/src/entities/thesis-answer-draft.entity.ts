import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { ThesisQuestion } from './thesis-question.entity';
import type { EvidenceRow } from '@repo/types';

@Entity('thesis_answer_drafts')
export class ThesisAnswerDraft {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'question_id', type: 'uuid', unique: true })
  @Index('idx_thesis_answer_drafts_question_id')
  questionId: string;

  @OneToOne(() => ThesisQuestion, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'question_id' })
  question: ThesisQuestion;

  @Column({ name: 'answer_markdown', type: 'text', default: '' })
  answerMarkdown: string;

  @Column({ name: 'evidence_rows', type: 'jsonb', default: '[]' })
  evidenceRows: EvidenceRow[];

  @Column({ type: 'jsonb', default: '[]' })
  gaps: string[];

  @Column({ name: 'confidence_score', type: 'int', default: 0 })
  confidenceScore: number;

  @Column({ name: 'generated_at', type: 'timestamp', nullable: true })
  generatedAt: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
