import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import type {
  KeywordSuggestion,
  KeywordSuggestionsBasedOn,
} from '@repo/types';
import { User } from './user.entity';

@Entity('keyword_suggestion_runs')
export class KeywordSuggestionRun {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  @Index('idx_keyword_suggestion_runs_user_id')
  userId: string;

  @Column({ name: 'theme_used', type: 'varchar', length: 200, nullable: true })
  themeUsed: string | null;

  @Column({ name: 'based_on', type: 'jsonb' })
  basedOn: KeywordSuggestionsBasedOn;

  @Column({ type: 'jsonb' })
  suggestions: KeywordSuggestion[];

  @Column({ name: 'generated_at', type: 'timestamp', default: () => 'now()' })
  generatedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
