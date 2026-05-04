import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  Unique,
  OneToOne,
} from 'typeorm';
import { User } from './user.entity';
import { ResearchScope } from './research-scope.entity';
import { ThesisAnswerDraft } from './thesis-answer-draft.entity';
import type { ThesisQuestionStatus } from '@repo/types';

@Entity('thesis_questions')
@Unique(['userId', 'code'])
export class ThesisQuestion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  @Index('idx_thesis_questions_user_id')
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'research_scope_id', type: 'uuid' })
  @Index('idx_thesis_questions_research_scope_id')
  researchScopeId: string;

  @ManyToOne(() => ResearchScope, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'research_scope_id' })
  researchScope: ResearchScope;

  @Column({ type: 'varchar', length: 10 })
  code: string;

  @Column({ type: 'varchar', length: 10 })
  section: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ name: 'question_text', type: 'text' })
  questionText: string;

  @Column({ name: 'target_references', type: 'jsonb', default: '[]' })
  targetReferences: string[];

  @Column({
    type: 'varchar',
    length: 20,
    default: 'a_traiter',
  })
  @Index('idx_thesis_questions_status')
  status: ThesisQuestionStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToOne(() => ThesisAnswerDraft, (draft) => draft.question)
  draft: ThesisAnswerDraft | null;
}
