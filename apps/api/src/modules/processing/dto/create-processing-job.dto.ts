import { IsArray, IsUUID, ArrayMinSize, ArrayUnique } from 'class-validator';

export class CreateProcessingJobDto {
  @IsArray()
  @IsUUID('4', { each: true })
  @ArrayMinSize(1)
  @ArrayUnique()
  documentIds: string[];
}
