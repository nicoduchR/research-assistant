import { QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';
import { CreateResearchScopesTable1738346400000 } from './1738346400000-CreateResearchScopesTable';

describe('CreateResearchScopesTable Migration', () => {
  let migration: CreateResearchScopesTable1738346400000;
  let queryRunner: jest.Mocked<QueryRunner>;

  beforeEach(() => {
    migration = new CreateResearchScopesTable1738346400000();
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

    it('should create research_scopes table with correct schema', async () => {
      await migration.up(queryRunner);

      expect(queryRunner.createTable).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'research_scopes',
        }),
        true,
      );

      const tableArg = (queryRunner.createTable as jest.Mock).mock
        .calls[0][0] as Table;
      const columns = tableArg.columns;

      expect(columns).toHaveLength(7);
      expect(columns.find((c) => c.name === 'id')).toMatchObject({
        name: 'id',
        type: 'uuid',
        isPrimary: true,
      });
      expect(columns.find((c) => c.name === 'user_id')).toMatchObject({
        name: 'user_id',
        type: 'uuid',
        isNullable: false,
        isUnique: true,
      });
      expect(columns.find((c) => c.name === 'title')).toMatchObject({
        name: 'title',
        type: 'varchar',
        length: '200',
        isNullable: false,
      });
      expect(columns.find((c) => c.name === 'problematique')).toMatchObject({
        name: 'problematique',
        type: 'text',
        isNullable: false,
      });
      expect(columns.find((c) => c.name === 'objectives')).toMatchObject({
        name: 'objectives',
        type: 'text',
        isNullable: true,
      });
      expect(columns.find((c) => c.name === 'created_at')).toBeDefined();
      expect(columns.find((c) => c.name === 'updated_at')).toBeDefined();
    });

    it('should create index on user_id', async () => {
      await migration.up(queryRunner);

      expect(queryRunner.createIndex).toHaveBeenCalledWith(
        'research_scopes',
        expect.objectContaining({
          name: 'idx_research_scopes_user_id',
          columnNames: ['user_id'],
        }),
      );
    });

    it('should create foreign key to users table', async () => {
      await migration.up(queryRunner);

      expect(queryRunner.createForeignKey).toHaveBeenCalledWith(
        'research_scopes',
        expect.objectContaining({
          name: 'fk_research_scopes_user_id',
          columnNames: ['user_id'],
          referencedTableName: 'users',
          referencedColumnNames: ['id'],
          onDelete: 'CASCADE',
        }),
      );
    });
  });

  describe('down', () => {
    it('should drop foreign key, index, and table in correct order', async () => {
      await migration.down(queryRunner);

      expect(queryRunner.dropForeignKey).toHaveBeenCalledWith(
        'research_scopes',
        'fk_research_scopes_user_id',
      );
      expect(queryRunner.dropIndex).toHaveBeenCalledWith(
        'research_scopes',
        'idx_research_scopes_user_id',
      );
      expect(queryRunner.dropTable).toHaveBeenCalledWith('research_scopes');

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
