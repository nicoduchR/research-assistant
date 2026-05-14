import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResearchScope } from '../../entities/research-scope.entity';
import { ResearchDocument } from '../../entities/research-document.entity';
import { DocumentAnalysis } from '../../entities/document-analysis.entity';
import { KeywordSuggestionRun } from '../../entities/keyword-suggestion-run.entity';
import { AuthModule } from '../../auth/auth.module';
import { AiModule } from '../ai/ai.module';
import { ResearchController } from './research.controller';
import { ResearchService } from './research.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ResearchScope,
      ResearchDocument,
      DocumentAnalysis,
      KeywordSuggestionRun,
    ]),
    AuthModule,
    AiModule,
  ],
  controllers: [ResearchController],
  providers: [ResearchService],
  exports: [ResearchService], // Export for use in other modules (e.g., literature review)
})
export class ResearchModule {}
