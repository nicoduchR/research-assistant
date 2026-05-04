import {
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import type { EvidenceConfidence, ThesisQuestionStatus } from '@repo/types';

class EvidenceRowDto {
  @IsString()
  @MaxLength(2000)
  claim: string;

  @IsUUID()
  documentId: string;

  @IsString()
  @MaxLength(255)
  fileName: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageNumber: number | null;

  @IsString()
  @MaxLength(4000)
  sourceSnippet: string;

  @IsString()
  @MaxLength(1000)
  limitation: string;

  @IsIn(['low', 'medium', 'high'])
  confidence: EvidenceConfidence;
}

export class UpsertThesisDraftDto {
  @IsOptional()
  @IsString()
  @MaxLength(500000)
  answerMarkdown?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EvidenceRowDto)
  evidenceRows?: EvidenceRowDto[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(2000, { each: true })
  gaps?: string[];

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(100)
  confidenceScore?: number;

  @IsOptional()
  @IsIn(['a_traiter', 'en_cours', 'brouillon', 'validee'])
  status?: ThesisQuestionStatus;
}
