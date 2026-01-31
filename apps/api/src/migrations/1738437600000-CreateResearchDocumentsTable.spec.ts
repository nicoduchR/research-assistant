import { QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';
import { CreateResearchDocumentsTable1738437600000 } from './1738437600000-CreateResearchDocumentsTable';

describe('CreateResearchDocumentsTable Migration', () => {
  let migration: CreateResearchDocumentsTable1738437600000;
  let queryRunner: jest.Mocked<QueryRunner>;

  beforeEach(() => {
    migration = new CreateResearchDocumentsTable1738437600000();
    queryRunner = {
      query: jest.fn(),
      createTable: jest.fn(),
      createIndex: jest.fn(),
      createForeignKey: jest.fn(),
      dropTable: jest.fn(),
      dropIndex: jest.fn(),
      dropForeignKey: jest.fn(),
    } as unknown as jest.Mocked<QueryRunner>;
  });

  describe('up', () => {
    it('should create uuid extension', async () => {
      await migration.up(queryRunner);

      expect(queryRunner.query).toHaveBeenCalledWith(
        'CREATE EXTENSION IF NOT EXISTS "uuid-ossp"',
      );
    });

    it('should create research_documents table with correct schema', async () => {
      await migration.up(queryRunner);

      expect(queryRunner.createTable).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'research_documents',
        }),
        true,
      );

      const tableArg = (queryRunner.createTable as jest.Mock).mock
        .calls[0][0] as Table;
      const columns = tableArg.columns;

      expect(columns).toHaveLength(11);
      expect(columns.find((c) => c.name === 'id')).toMatchObject({
        name: 'id',
        type: 'uuid',
        isPrimary: true,
      });
      expect(columns.find((c) => c.name === 'user_id')).toMatchObject({
        name: 'user_id',
        type: 'uuid',
        isNullable: false,
      });
      expect(columns.find((c) => c.name === 'file_name')).toMatchObject({
        name: 'file_name',
        type: 'varchar',
        length: '255',
        isNullable: false,
      });
      expect(columns.find((c) => c.name === 'file_size')).toMatchObject({
        name: 'file_size',
        type: 'bigint',
        isNullable: false,
      });
      expect(columns.find((c) => c.name === 'mime_type')).toMatchObject({
        name: 'mime_type',
        type: 'varchar',
        length: '100',
        isNullable: false,
      });
      expect(columns.find((c) => c.name === 'storage_path')).toMatchObject({
        name: 'storage_path',
        type: 'varchar',
        length: '500',
        isNullable: false,
      });
      expect(columns.find((c) => c.name === 'page_count')).toMatchObject({
        name: 'page_count',
        type: 'integer',
        isNullable: true,
      });
      expect(columns.find((c) => c.name === 'text_extracted')).toMatchObject({
        name: 'text_extracted',
        type: 'boolean',
        default: false,
        isNullable: false,
      });
      expect(columns.find((c) => c.name === 'extraction_error')).toMatchObject(
        {
          name: 'extraction_error',
          type: 'text',
          isNullable: true,
        },
      );
      expect(columns.find((c) => c.name === 'uploaded_at')).toBeDefined();
      expect(columns.find((c) => c.name === 'updated_at')).toBeDefined();
    });

    it('should create index on user_id', async () => {
      await migration.up(queryRunner);

      expect(queryRunner.createIndex).toHaveBeenCalledWith(
        'research_documents',
        expect.objectContaining({
          name: 'idx_research_documents_user_id',
          columnNames: ['user_id'],
        }),
      );
    });

    it('should create foreign key to users table', async () => {
      await migration.up(queryRunner);

      expect(queryRunner.createForeignKey).toHaveBeenCalledWith(
        'research_documents',
        expect.objectContaining({
          name: 'fk_research_documents_user_id',
          columnNames: ['user_id'],
          referencedTableName: 'users',
          referencedColumnNames: ['id'],
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        }),
      );
    });
  });

  describe('down', () => {
    it('should drop foreign key, index, and table in correct order', async () => {
      await migration.down(queryRunner);

      expect(queryRunner.dropForeignKey).toHaveBeenCalledWith(
        'research_documents',
        'fk_research_documents_user_id',
      );
      expect(queryRunner.dropIndex).toHaveBeenCalledWith(
        'research_documents',
        'idx_research_documents_user_id',
      );
      expect(queryRunner.dropTable).toHaveBeenCalledWith('research_documents');

      // Verify order: FK first, then index, then table
      const calls = [
        queryRunner.dropForeignKey.mock.invocationCallOrder[0],
        queryRunner.dropIndex.mock.invocationCallOrder[0],
        queryRunner.dropTable.mock.invocationCallOrder[0],
      ];
      expect(calls[0]).toBeLessThan(calls[1]);
      expect(calls[1]).toBeLessThan(calls[2]);
    });
  });
});
