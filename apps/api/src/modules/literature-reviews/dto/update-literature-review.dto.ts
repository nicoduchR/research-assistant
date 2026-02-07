import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateLiteratureReviewDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500000)
  content?: string;
}
