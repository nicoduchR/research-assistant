import {
  Controller,
  Post,
  UseGuards,
  HttpCode,
  HttpStatus,
  Req,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { DocumentsService } from './documents.service';
import { DocumentResponseDto } from './dto/document-response.dto';
import { memoryStorage } from 'multer';

// Extract constant to avoid duplication
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

@Controller('documents')
@UseGuards(JwtAuthGuard)
// NOTE: Current throttler is global (10 uploads/min across all users)
// For true per-user rate limiting, implement custom ThrottlerGuard with userId key
@Throttle({ default: { limit: 10, ttl: 60000 } })
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('upload')
  @HttpCode(HttpStatus.CREATED)
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
}
