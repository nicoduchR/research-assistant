import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDocumentAnalysesTable1739300000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "document_analyses" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "document_id" uuid NOT NULL,
        "user_id" uuid NOT NULL,
        "summary" text NOT NULL,
        "key_citations" jsonb NOT NULL DEFAULT '[]',
        "relevance" jsonb NOT NULL,
        "methodology" jsonb NOT NULL,
        "error_message" text,
        "analyzed_at" TIMESTAMP,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_document_analyses" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_document_analyses_document_id" UNIQUE ("document_id"),
        CONSTRAINT "FK_document_analyses_document" FOREIGN KEY ("document_id") REFERENCES "research_documents"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_document_analyses_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "idx_document_analyses_user_id" ON "document_analyses" ("user_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "document_analyses"`);
  }
}
