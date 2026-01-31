import { IsString, IsNotEmpty, MaxLength, MinLength, IsOptional } from 'class-validator';

export class CreateResearchScopeDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(50, {
    message: 'Problématique must be at least 50 characters to ensure meaningful research question',
  })
  @MaxLength(2000, {
    message: 'Problématique must not exceed 2000 characters',
  })
  problematique: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  objectives?: string;
}
