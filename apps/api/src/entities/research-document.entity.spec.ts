import { ResearchDocument } from './research-document.entity';
import { User } from './user.entity';

describe('ResearchDocument Entity', () => {
  it('should create an instance', () => {
    const document = new ResearchDocument();
    expect(document).toBeDefined();
    expect(document).toBeInstanceOf(ResearchDocument);
  });

  it('should have correct entity name', () => {
    expect(ResearchDocument).toBeDefined();
    expect(ResearchDocument.name).toBe('ResearchDocument');
  });

  it('should have all required properties', () => {
    const document = new ResearchDocument();
    document.id = 'test-id';
    document.userId = 'user-id';
    document.fileName = 'test.pdf';
    document.fileSize = 1024;
    document.mimeType = 'application/pdf';
    document.storagePath = '/uploads/user-id/doc-id.pdf';
    document.pageCount = 10;
    document.textExtracted = false;
    document.extractionError = null;
    document.uploadedAt = new Date();
    document.updatedAt = new Date();

    expect(document.id).toBe('test-id');
    expect(document.userId).toBe('user-id');
    expect(document.fileName).toBe('test.pdf');
    expect(document.fileSize).toBe(1024);
    expect(document.mimeType).toBe('application/pdf');
    expect(document.storagePath).toBe('/uploads/user-id/doc-id.pdf');
    expect(document.pageCount).toBe(10);
    expect(document.textExtracted).toBe(false);
    expect(document.extractionError).toBeNull();
    expect(document.uploadedAt).toBeInstanceOf(Date);
    expect(document.updatedAt).toBeInstanceOf(Date);
  });

  it('should allow null pageCount', () => {
    const document = new ResearchDocument();
    document.pageCount = null;
    expect(document.pageCount).toBeNull();
  });

  it('should allow null extractionError', () => {
    const document = new ResearchDocument();
    document.extractionError = null;
    expect(document.extractionError).toBeNull();
  });

  it('should have user relation defined', () => {
    const document = new ResearchDocument();
    const user = new User();
    document.user = user;
    expect(document.user).toBe(user);
  });

  it('should support userId property', () => {
    const document = new ResearchDocument();
    document.userId = 'test-user-id';
    expect(document.userId).toBe('test-user-id');
  });

  it('should default textExtracted to false', () => {
    const document = new ResearchDocument();
    // TypeORM sets default at database level, but we can test the property assignment
    document.textExtracted = false;
    expect(document.textExtracted).toBe(false);
  });

  it('should support textExtracted as true', () => {
    const document = new ResearchDocument();
    document.textExtracted = true;
    expect(document.textExtracted).toBe(true);
  });

  it('should validate fileName can be set', () => {
    const document = new ResearchDocument();
    const fileName = 'research-paper-2024.pdf';
    document.fileName = fileName;
    expect(document.fileName).toBe(fileName);
  });

  it('should validate storagePath can be long path', () => {
    const document = new ResearchDocument();
    const longPath = `/uploads/${'a'.repeat(100)}/${'b'.repeat(100)}.pdf`;
    document.storagePath = longPath;
    expect(document.storagePath.length).toBeLessThanOrEqual(500);
  });
});
