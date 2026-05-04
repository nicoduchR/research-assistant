import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import type { ThesisQuestionStatus } from '@repo/types';

export class UpdateThesisQuestionDto {
  @IsOptional()
  @IsIn(['a_traiter', 'en_cours', 'brouillon', 'validee'])
  status?: ThesisQuestionStatus;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  questionText?: string;
}
