import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddSkippedDocumentsToProcessingJob1739000000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'processing_jobs',
      new TableColumn({
        name: 'skipped_documents',
        type: 'jsonb',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'processing_jobs',
      new TableColumn({
        name: 'processed_document_count',
        type: 'int',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('processing_jobs', 'processed_document_count');
    await queryRunner.dropColumn('processing_jobs', 'skipped_documents');
  }
}
