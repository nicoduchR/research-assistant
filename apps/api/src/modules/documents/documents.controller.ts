import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  ParseIntPipe,
  ParseUUIDPipe,
  StreamableFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { DocumentsService } from './documents.service';
import { DocumentResponseDto, DocumentListItemDto } from './dto/document-response.dto';
import { memoryStorage } from 'multer';
import { createReadStream } from 'fs';
import { Response } from 'express';

// Extract constant to avoid duplication
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

@Controller('documents')
@UseGuards(JwtAuthGuard)
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('upload')
  @HttpCode(HttpStatus.CREATED)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(), // Use memory storage - validate before disk write
      limits: {
        fileSize: MAX_FILE_SIZE,
      },
    }),
  )
  async uploadDocument(
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<DocumentResponseDto> {
    // Validate JWT payload exists
    if (!req.user || !req.user.userId) {
      throw new BadRequestException('Invalid authentication token');
    }

    // Validate file exists (multer might not populate if request is malformed)
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const userId = req.user.userId;
    const document = await this.documentsService.uploadDocument(userId, file);

    // Return response with camelCase fields (exclude internal fields)
    return {
      id: document.id,
      fileName: document.fileName,
      fileSize: document.fileSize,
      mimeType: document.mimeType,
      uploadedAt: document.uploadedAt.toISOString(),
    };
  }

  @Get()
  async listDocuments(@Req() req: any): Promise<DocumentListItemDto[]> {
    if (!req.user || !req.user.userId) {
      throw new BadRequestException('Invalid authentication token');
    }

    const documents = await this.documentsService.listDocuments(req.user.userId);
    return documents.map((doc) => ({
      id: doc.id,
      fileName: doc.fileName,
      fileSize: doc.fileSize,
      mimeType: doc.mimeType,
      pageCount: doc.pageCount,
      textExtracted: doc.textExtracted,
      extractionError: doc.extractionError,
      analysisStatus: doc.analysisStatus ?? null,
      bibliographicMetadata: doc.bibliographicMetadata ?? null,
      uploadedAt: doc.uploadedAt.toISOString(),
      updatedAt: doc.updatedAt.toISOString(),
    }));
  }

  @Get(':id/analysis')
  async getDocumentAnalysis(
    @Req() req: any,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    if (!req.user || !req.user.userId) {
      throw new BadRequestException('Invalid authentication token');
    }

    return this.documentsService.getDocumentAnalysis(id, req.user.userId);
  }

  @Delete(':id/analysis/citations/:citationIndex')
  async discardDocumentCitation(
    @Req() req: any,
    @Param('id', ParseUUIDPipe) id: string,
    @Param('citationIndex', ParseIntPipe) citationIndex: number,
  ) {
    if (!req.user || !req.user.userId) {
      throw new BadRequestException('Invalid authentication token');
    }

    return this.documentsService.discardDocumentCitation(
      id,
      req.user.userId,
      citationIndex,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteDocument(
    @Req() req: any,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    if (!req.user || !req.user.userId) {
      throw new BadRequestException('Invalid authentication token');
    }

    return this.documentsService.deleteDocument(id, req.user.userId);
  }

  @Get(':id/file')
  async getDocumentFile(
    @Req() req: any,
    @Param('id', ParseUUIDPipe) id: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    if (!req.user || !req.user.userId) {
      throw new BadRequestException('Invalid authentication token');
    }

    const { document, filePath } =
      await this.documentsService.getDocumentForServing(id, req.user.userId);

    const asciiFilename = document.fileName.replace(/[^\x20-\x7E]/g, '_');
    const encodedFilename = encodeURIComponent(document.fileName);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${asciiFilename}"; filename*=UTF-8''${encodedFilename}`,
      'Content-Length': document.fileSize.toString(),
    });

    const fileStream = createReadStream(filePath);
    return new StreamableFile(fileStream);
  }
}
