import { CreateUsersTable1738255200000 } from './1738255200000-CreateUsersTable';

describe('CreateUsersTable Migration', () => {
  let migration: CreateUsersTable1738255200000;
  let mockQueryRunner: any;

  beforeEach(() => {
    migration = new CreateUsersTable1738255200000();
    mockQueryRunner = {
      query: jest.fn(),
      createTable: jest.fn(),
      createIndex: jest.fn(),
      dropIndex: jest.fn(),
      dropTable: jest.fn(),
    };
  });

  describe('up', () => {
    it('should enable UUID extension before creating table', async () => {
      await migration.up(mockQueryRunner);

      expect(mockQueryRunner.query).toHaveBeenCalledWith(
        'CREATE EXTENSION IF NOT EXISTS "uuid-ossp"',
      );
      expect(mockQueryRunner.query).toHaveBeenCalled();
    });

    it('should create users table with correct schema', async () => {
      await migration.up(mockQueryRunner);

      expect(mockQueryRunner.createTable).toHaveBeenCalledTimes(1);

      const tableArg = mockQueryRunner.createTable.mock.calls[0][0];
      expect(tableArg.name).toBe('users');
      expect(tableArg.columns).toHaveLength(7);

      // Verify primary key
      const idColumn = tableArg.columns.find((col: any) => col.name === 'id');
      expect(idColumn.type).toBe('uuid');
      expect(idColumn.isPrimary).toBe(true);

      // Verify google_id column
      const googleIdColumn = tableArg.columns.find((col: any) => col.name === 'google_id');
      expect(googleIdColumn.type).toBe('varchar');
      expect(googleIdColumn.isUnique).toBe(true);
      expect(googleIdColumn.isNullable).toBe(false);

      // Verify email column
      const emailColumn = tableArg.columns.find((col: any) => col.name === 'email');
      expect(emailColumn.type).toBe('varchar');
      expect(emailColumn.isNullable).toBe(false);

      // Verify avatar_url column (nullable)
      const avatarColumn = tableArg.columns.find((col: any) => col.name === 'avatar_url');
      expect(avatarColumn.type).toBe('varchar');
      expect(avatarColumn.isNullable).toBe(true);

      // Verify timestamps
      const createdAtColumn = tableArg.columns.find((col: any) => col.name === 'created_at');
      expect(createdAtColumn.type).toBe('timestamp');
      expect(createdAtColumn.default).toBe('CURRENT_TIMESTAMP');

      const updatedAtColumn = tableArg.columns.find((col: any) => col.name === 'updated_at');
      expect(updatedAtColumn.type).toBe('timestamp');
      expect(updatedAtColumn.default).toBe('CURRENT_TIMESTAMP');
    });

    it('should create indexes on google_id and email', async () => {
      await migration.up(mockQueryRunner);

      expect(mockQueryRunner.createIndex).toHaveBeenCalledTimes(2);

      // Verify google_id index
      const googleIdIndex = mockQueryRunner.createIndex.mock.calls[0][1];
      expect(googleIdIndex.name).toBe('idx_users_google_id');
      expect(googleIdIndex.columnNames).toEqual(['google_id']);

      // Verify email index
      const emailIndex = mockQueryRunner.createIndex.mock.calls[1][1];
      expect(emailIndex.name).toBe('idx_users_email');
      expect(emailIndex.columnNames).toEqual(['email']);
    });
  });

  describe('down', () => {
    it('should drop indexes and table in correct order', async () => {
      await migration.down(mockQueryRunner);

      expect(mockQueryRunner.dropIndex).toHaveBeenCalledTimes(2);
      expect(mockQueryRunner.dropTable).toHaveBeenCalledTimes(1);

      // Verify indexes dropped before table
      expect(mockQueryRunner.dropIndex).toHaveBeenNthCalledWith(1, 'users', 'idx_users_email');
      expect(mockQueryRunner.dropIndex).toHaveBeenNthCalledWith(2, 'users', 'idx_users_google_id');
      expect(mockQueryRunner.dropTable).toHaveBeenCalledWith('users');
    });
  });
});
