import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddExtractedTextColumn1738528800000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'research_documents',
      new TableColumn({
        name: 'extracted_text',
        type: 'text',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('research_documents', 'extracted_text');
  }
}
