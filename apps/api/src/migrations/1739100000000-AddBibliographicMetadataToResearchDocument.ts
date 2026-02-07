import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddBibliographicMetadataToResearchDocument1739100000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'research_documents',
      new TableColumn({
        name: 'bibliographic_metadata',
        type: 'jsonb',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn(
      'research_documents',
      'bibliographic_metadata',
    );
  }
}
