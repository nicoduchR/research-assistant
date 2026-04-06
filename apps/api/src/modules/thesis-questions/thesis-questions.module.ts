import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThesisQuestion } from '../../entities/thesis-question.entity';
import { ThesisAnswerDraft } from '../../entities/thesis-answer-draft.entity';
import { ResearchScope } from '../../entities/research-scope.entity';
import { ResearchDocument } from '../../entities/research-document.entity';
import { DocumentAnalysis } from '../../entities/document-analysis.entity';
import { AuthModule } from '../../auth/auth.module';
import { AiModule } from '../ai/ai.module';
import { ThesisQuestionsController } from './thesis-questions.controller';
import { ThesisQuestionsService } from './thesis-questions.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ThesisQuestion,
      ThesisAnswerDraft,
      ResearchScope,
      ResearchDocument,
      DocumentAnalysis,
    ]),
    AuthModule,
    AiModule,
  ],
  controllers: [ThesisQuestionsController],
  providers: [ThesisQuestionsService],
  exports: [ThesisQuestionsService],
})
export class ThesisQuestionsModule {}
