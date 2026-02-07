import { QueryRunner, TableColumn } from 'typeorm';
import { AddExtractedTextColumn1738528800000 } from './1738528800000-AddExtractedTextColumn';

describe('AddExtractedTextColumn Migration', () => {
  let migration: AddExtractedTextColumn1738528800000;
  let queryRunner: jest.Mocked<QueryRunner>;

  beforeEach(() => {
    migration = new AddExtractedTextColumn1738528800000();
    queryRunner = {
      addColumn: jest.fn(),
      dropColumn: jest.fn(),
    } as unknown as jest.Mocked<QueryRunner>;
  });

  describe('up', () => {
    it('should add extracted_text column to research_documents table', async () => {
      await migration.up(queryRunner);

      expect(queryRunner.addColumn).toHaveBeenCalledWith(
        'research_documents',
        expect.any(TableColumn),
      );

      const columnArg = (queryRunner.addColumn as jest.Mock).mock
        .calls[0][1] as TableColumn;
      expect(columnArg.name).toBe('extracted_text');
      expect(columnArg.type).toBe('text');
      expect(columnArg.isNullable).toBe(true);
    });
  });

  describe('down', () => {
    it('should drop extracted_text column from research_documents table', async () => {
      await migration.down(queryRunner);

      expect(queryRunner.dropColumn).toHaveBeenCalledWith(
        'research_documents',
        'extracted_text',
      );
    });
  });
});
