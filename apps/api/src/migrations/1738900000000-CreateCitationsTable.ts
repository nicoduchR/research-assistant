import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
} from 'typeorm';

export class CreateCitationsTable1738900000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    await queryRunner.createTable(
      new Table({
        name: 'citations',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'literature_review_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'document_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'page_number',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'claim_text',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'position_in_review',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'is_verified',
            type: 'boolean',
            default: false,
            isNullable: false,
          },
          {
            name: 'user_notes',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    // Create index on literature_review_id for query performance
    await queryRunner.createIndex(
      'citations',
      new TableIndex({
        name: 'idx_citations_literature_review_id',
        columnNames: ['literature_review_id'],
      }),
    );

    // Create index on document_id for query performance
    await queryRunner.createIndex(
      'citations',
      new TableIndex({
        name: 'idx_citations_document_id',
        columnNames: ['document_id'],
      }),
    );

    // Create foreign key to literature_reviews table with cascade delete
    await queryRunner.createForeignKey(
      'citations',
      new TableForeignKey({
        name: 'fk_citations_literature_review_id',
        columnNames: ['literature_review_id'],
        referencedTableName: 'literature_reviews',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );

    // Create foreign key to research_documents table with cascade delete
    await queryRunner.createForeignKey(
      'citations',
      new TableForeignKey({
        name: 'fk_citations_document_id',
        columnNames: ['document_id'],
        referencedTableName: 'research_documents',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'citations',
      'fk_citations_document_id',
    );
    await queryRunner.dropForeignKey(
      'citations',
      'fk_citations_literature_review_id',
    );
    await queryRunner.dropIndex(
      'citations',
      'idx_citations_document_id',
    );
    await queryRunner.dropIndex(
      'citations',
      'idx_citations_literature_review_id',
    );
    await queryRunner.dropTable('citations');
  }
}
