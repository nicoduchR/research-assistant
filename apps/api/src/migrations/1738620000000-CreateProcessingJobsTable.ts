import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
} from 'typeorm';

export class CreateProcessingJobsTable1738620000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    // Create enum type for processing job status
    await queryRunner.query(
      `CREATE TYPE "processing_job_status_enum" AS ENUM ('queued', 'processing', 'completed', 'failed')`,
    );

    await queryRunner.createTable(
      new Table({
        name: 'processing_jobs',
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
            name: 'status',
            type: 'processing_job_status_enum',
            default: `'queued'`,
            isNullable: false,
          },
          {
            name: 'document_ids',
            type: 'jsonb',
            isNullable: false,
          },
          {
            name: 'result_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'error_message',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'progress_percentage',
            type: 'integer',
            default: 0,
            isNullable: false,
          },
          {
            name: 'progress_message',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'queued_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'started_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'completed_at',
            type: 'timestamp',
            isNullable: true,
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
      `ALTER TABLE "processing_jobs" ADD CONSTRAINT "chk_processing_jobs_document_ids_array" CHECK (jsonb_typeof(document_ids) = 'array')`,
    );

    // Create index on user_id for faster lookups
    await queryRunner.createIndex(
      'processing_jobs',
      new TableIndex({
        name: 'idx_processing_jobs_user_id',
        columnNames: ['user_id'],
      }),
    );

    // Create foreign key to users table with cascade delete
    await queryRunner.createForeignKey(
      'processing_jobs',
      new TableForeignKey({
        name: 'fk_processing_jobs_user_id',
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
      'processing_jobs',
      'fk_processing_jobs_user_id',
    );
    await queryRunner.dropIndex(
      'processing_jobs',
      'idx_processing_jobs_user_id',
    );
    await queryRunner.query(
      `ALTER TABLE "processing_jobs" DROP CONSTRAINT IF EXISTS "chk_processing_jobs_document_ids_array"`,
    );
    await queryRunner.dropTable('processing_jobs');
    await queryRunner.query('DROP TYPE IF EXISTS "processing_job_status_enum"');
  }
}
