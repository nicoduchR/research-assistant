import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { apiGet, apiPost, apiPatch, apiPut, toToolResult } from '../api-client.js';

export function registerThesisQuestionTools(server: McpServer): void {
  server.tool(
    'bootstrap_thesis_questions',
    'Generate thesis questions from the current research scope. Requires a research scope to be set first. Returns ~20 structured questions organized by section.',
    async () => {
      const result = await apiPost('/thesis-questions/bootstrap');
      return toToolResult(result);
    },
  );

  server.tool(
    'list_thesis_questions',
    'List all thesis questions with their status (a_traiter, en_cours, brouillon, validee), section, and code.',
    async () => {
      const result = await apiGet('/thesis-questions');
      return toToolResult(result);
    },
  );

  server.tool(
    'update_thesis_question',
    'Update a thesis question status, title, or question text.',
    {
      questionId: z.string().uuid().describe('UUID of the thesis question'),
      status: z.enum(['a_traiter', 'en_cours', 'brouillon', 'validee']).optional().describe('New status'),
      title: z.string().max(255).optional().describe('New title'),
      questionText: z.string().max(5000).optional().describe('New question text'),
    },
    async (args) => {
      const body: Record<string, unknown> = {};
      if (args.status !== undefined) body.status = args.status;
      if (args.title !== undefined) body.title = args.title;
      if (args.questionText !== undefined) body.questionText = args.questionText;
      const result = await apiPatch(`/thesis-questions/${args.questionId}`, body);
      return toToolResult(result);
    },
  );

  server.tool(
    'generate_thesis_answer',
    'Generate an AI answer for a thesis question using all analyzed documents as corpus. Returns an answer draft with evidence rows, confidence score, and research gaps. This is a long-running operation.',
    {
      questionId: z.string().uuid().describe('UUID of the thesis question'),
    },
    async (args) => {
      const result = await apiPost(`/thesis-questions/${args.questionId}/generate-answer`);
      return toToolResult(result);
    },
  );

  server.tool(
    'get_thesis_draft',
    'Get the generated answer draft for a thesis question, including markdown answer, evidence rows with source references, gaps, and confidence score.',
    {
      questionId: z.string().uuid().describe('UUID of the thesis question'),
    },
    async (args) => {
      const result = await apiGet(`/thesis-questions/${args.questionId}/draft`);
      return toToolResult(result);
    },
  );

  server.tool(
    'save_thesis_draft',
    'Save or update an answer draft for a thesis question.',
    {
      questionId: z.string().uuid().describe('UUID of the thesis question'),
      answerMarkdown: z.string().optional().describe('Markdown content of the answer'),
      gaps: z.array(z.string()).optional().describe('Array of unresolved research gaps'),
      confidenceScore: z.number().int().min(0).max(100).optional().describe('Confidence score 0-100'),
      status: z.enum(['a_traiter', 'en_cours', 'brouillon', 'validee']).optional().describe('New status for the question'),
    },
    async (args) => {
      const body: Record<string, unknown> = {};
      if (args.answerMarkdown !== undefined) body.answerMarkdown = args.answerMarkdown;
      if (args.gaps !== undefined) body.gaps = args.gaps;
      if (args.confidenceScore !== undefined) body.confidenceScore = args.confidenceScore;
      if (args.status !== undefined) body.status = args.status;
      const result = await apiPut(`/thesis-questions/${args.questionId}/draft`, body);
      return toToolResult(result);
    },
  );
}
