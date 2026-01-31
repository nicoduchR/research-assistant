import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResearchScope } from '../../entities/research-scope.entity';
import { ResearchController } from './research.controller';
import { ResearchService } from './research.service';

@Module({
  imports: [TypeOrmModule.forFeature([ResearchScope])],
  controllers: [ResearchController],
  providers: [ResearchService],
  exports: [ResearchService], // Export for use in other modules (e.g., literature review)
})
export class ResearchModule {}
