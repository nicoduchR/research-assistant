import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
} from 'typeorm';

export class CreateResearchScopesTable1738346400000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // UUID extension should already exist from users migration
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    await queryRunner.createTable(
      new Table({
        name: 'research_scopes',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'user_id',
            type: 'uuid',
            isNullable: false,
            isUnique: true, // One scope per user (MVP constraint)
          },
          {
            name: 'title',
            type: 'varchar',
            length: '200',
            isNullable: false,
          },
          {
            name: 'problematique',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'objectives',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    // Create index on user_id for faster lookups
    await queryRunner.createIndex(
      'research_scopes',
      new TableIndex({
        name: 'idx_research_scopes_user_id',
        columnNames: ['user_id'],
      }),
    );

    // Create foreign key to users table with cascade delete
    await queryRunner.createForeignKey(
      'research_scopes',
      new TableForeignKey({
        name: 'fk_research_scopes_user_id',
        columnNames: ['user_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'research_scopes',
      'fk_research_scopes_user_id',
    );
    await queryRunner.dropIndex(
      'research_scopes',
      'idx_research_scopes_user_id',
    );
    await queryRunner.dropTable('research_scopes');
  }
}
