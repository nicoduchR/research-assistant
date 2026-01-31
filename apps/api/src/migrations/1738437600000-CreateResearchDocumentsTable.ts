import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
} from 'typeorm';

export class CreateResearchDocumentsTable1738437600000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // UUID extension should already exist from users migration
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    await queryRunner.createTable(
      new Table({
        name: 'research_documents',
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
          },
          {
            name: 'file_name',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'file_size',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'mime_type',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'storage_path',
            type: 'varchar',
            length: '500',
            isNullable: false,
          },
          {
            name: 'page_count',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'text_extracted',
            type: 'boolean',
            default: false,
            isNullable: false,
          },
          {
            name: 'extraction_error',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'uploaded_at',
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
      'research_documents',
      new TableIndex({
        name: 'idx_research_documents_user_id',
        columnNames: ['user_id'],
      }),
    );

    // Create foreign key to users table with cascade delete
    await queryRunner.createForeignKey(
      'research_documents',
      new TableForeignKey({
        name: 'fk_research_documents_user_id',
        columnNames: ['user_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'research_documents',
      'fk_research_documents_user_id',
    );
    await queryRunner.dropIndex(
      'research_documents',
      'idx_research_documents_user_id',
    );
    await queryRunner.dropTable('research_documents');
  }
}
