import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateThesisQuestionsTables1739400000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "thesis_questions" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "research_scope_id" uuid NOT NULL,
        "code" varchar(10) NOT NULL,
        "section" varchar(10) NOT NULL,
        "title" varchar(255) NOT NULL,
        "question_text" text NOT NULL,
        "target_references" jsonb NOT NULL DEFAULT '[]',
        "status" varchar(20) NOT NULL DEFAULT 'a_traiter',
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_thesis_questions" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_thesis_questions_user_code" UNIQUE ("user_id", "code"),
        CONSTRAINT "FK_thesis_questions_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_thesis_questions_scope" FOREIGN KEY ("research_scope_id") REFERENCES "research_scopes"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(
      `CREATE INDEX "idx_thesis_questions_user_id" ON "thesis_questions" ("user_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_thesis_questions_research_scope_id" ON "thesis_questions" ("research_scope_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_thesis_questions_status" ON "thesis_questions" ("status")`,
    );

    await queryRunner.query(`
      CREATE TABLE "thesis_answer_drafts" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "question_id" uuid NOT NULL,
        "answer_markdown" text NOT NULL DEFAULT '',
        "evidence_rows" jsonb NOT NULL DEFAULT '[]',
        "gaps" jsonb NOT NULL DEFAULT '[]',
        "confidence_score" int NOT NULL DEFAULT 0,
        "generated_at" TIMESTAMP,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_thesis_answer_drafts" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_thesis_answer_drafts_question_id" UNIQUE ("question_id"),
        CONSTRAINT "FK_thesis_answer_drafts_question" FOREIGN KEY ("question_id") REFERENCES "thesis_questions"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(
      `CREATE INDEX "idx_thesis_answer_drafts_question_id" ON "thesis_answer_drafts" ("question_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "thesis_answer_drafts"`);
    await queryRunner.query(`DROP TABLE "thesis_questions"`);
  }
}
