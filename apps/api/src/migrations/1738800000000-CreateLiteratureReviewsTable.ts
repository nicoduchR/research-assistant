import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
} from 'typeorm';

export class CreateLiteratureReviewsTable1738800000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    await queryRunner.createTable(
      new Table({
        name: 'literature_reviews',
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
            name: 'job_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'title',
            type: 'varchar',
            length: '500',
            isNullable: false,
          },
          {
            name: 'content',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'document_ids',
            type: 'jsonb',
            isNullable: false,
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

    // Add CHECK constraint to ensure document_ids is a JSON array
    await queryRunner.query(
      `ALTER TABLE "literature_reviews" ADD CONSTRAINT "chk_literature_reviews_document_ids_array" CHECK (jsonb_typeof(document_ids) = 'array')`,
    );

    // Create index on user_id for faster lookups
    await queryRunner.createIndex(
      'literature_reviews',
      new TableIndex({
        name: 'idx_literature_reviews_user_id',
        columnNames: ['user_id'],
      }),
    );

    // Create foreign key to users table with cascade delete
    await queryRunner.createForeignKey(
      'literature_reviews',
      new TableForeignKey({
        name: 'fk_literature_reviews_user_id',
        columnNames: ['user_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );

    // Create foreign key to processing_jobs table with cascade delete
    await queryRunner.createForeignKey(
      'literature_reviews',
      new TableForeignKey({
        name: 'fk_literature_reviews_job_id',
        columnNames: ['job_id'],
        referencedTableName: 'processing_jobs',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'literature_reviews',
      'fk_literature_reviews_job_id',
    );
    await queryRunner.dropForeignKey(
      'literature_reviews',
      'fk_literature_reviews_user_id',
    );
    await queryRunner.dropIndex(
      'literature_reviews',
      'idx_literature_reviews_user_id',
    );
    await queryRunner.query(
      `ALTER TABLE "literature_reviews" DROP CONSTRAINT IF EXISTS "chk_literature_reviews_document_ids_array"`,
    );
    await queryRunner.dropTable('literature_reviews');
  }
}
