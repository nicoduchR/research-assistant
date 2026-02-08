import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAnalysisStatusToResearchDocument1739200000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "research_documents" ADD "analysis_status" varchar`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "research_documents" DROP COLUMN "analysis_status"`,
    );
  }
}
