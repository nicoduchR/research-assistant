import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResearchDocument } from '../../entities/research-document.entity';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ResearchDocument]),
    StorageModule, // For filesystem operations
  ],
  controllers: [DocumentsController],
  providers: [DocumentsService],
  exports: [DocumentsService], // Export for future use by other modules
})
export class DocumentsModule {}
