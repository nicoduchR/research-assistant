import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResearchDocument } from '../../entities/research-document.entity';
import { DocumentAnalysis } from '../../entities/document-analysis.entity';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { AuthModule } from '../../auth/auth.module';
import { StorageModule } from '../storage/storage.module';
import { ProcessingModule } from '../processing/processing.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ResearchDocument, DocumentAnalysis]),
    AuthModule,
    StorageModule, // For filesystem operations
    ProcessingModule, // For PDF extraction queue
  ],
  controllers: [DocumentsController],
  providers: [DocumentsService],
  exports: [DocumentsService], // Export for future use by other modules
})
export class DocumentsModule {}
