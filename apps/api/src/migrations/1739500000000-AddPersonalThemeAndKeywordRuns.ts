import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPersonalThemeAndKeywordRuns1739500000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "research_scopes"
      ADD COLUMN "personal_theme" varchar(200)
    `);

    await queryRunner.query(`
      CREATE TABLE "keyword_suggestion_runs" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "theme_used" varchar(200),
        "based_on" jsonb NOT NULL DEFAULT '{}'::jsonb,
        "suggestions" jsonb NOT NULL DEFAULT '[]'::jsonb,
        "generated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_keyword_suggestion_runs" PRIMARY KEY ("id"),
        CONSTRAINT "FK_keyword_suggestion_runs_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(
      `CREATE INDEX "idx_keyword_suggestion_runs_user_id" ON "keyword_suggestion_runs" ("user_id")`,
    );

    await queryRunner.query(
      `CREATE INDEX "idx_keyword_suggestion_runs_user_generated" ON "keyword_suggestion_runs" ("user_id", "generated_at" DESC)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "keyword_suggestion_runs"`);
    await queryRunner.query(
      `ALTER TABLE "research_scopes" DROP COLUMN "personal_theme"`,
    );
  }
}
