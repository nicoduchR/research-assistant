import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { apiGet, apiPost, apiPut, toToolResult } from '../api-client.js';

export function registerLiteratureReviewTools(server: McpServer): void {
  server.tool(
    'create_literature_review',
    'Start generating a literature review synthesis from selected documents. Returns a processing job ID that can be polled with get_job_status. Once the job completes, use its resultId with get_literature_review.',
    {
      documentIds: z.array(z.string().uuid()).min(1).describe('Array of document UUIDs to include in the review'),
    },
    async (args) => {
      const result = await apiPost('/processing-jobs', { documentIds: args.documentIds });
      return toToolResult(result);
    },
  );

  server.tool(
    'get_literature_review',
    'Get a literature review with its full content (markdown) and citations.',
    {
      reviewId: z.string().uuid().describe('UUID of the literature review'),
    },
    async (args) => {
      const result = await apiGet(`/literature-reviews/${args.reviewId}`);
      return toToolResult(result);
    },
  );

  server.tool(
    'update_literature_review',
    'Update the title or content of a literature review.',
    {
      reviewId: z.string().uuid().describe('UUID of the literature review'),
      title: z.string().max(500).optional().describe('New title for the review'),
      content: z.string().optional().describe('New markdown content for the review'),
    },
    async (args) => {
      const body: Record<string, unknown> = {};
      if (args.title !== undefined) body.title = args.title;
      if (args.content !== undefined) body.content = args.content;
      const result = await apiPut(`/literature-reviews/${args.reviewId}`, body);
      return toToolResult(result);
    },
  );

  server.tool(
    'export_bibliography',
    'Export the bibliography of a literature review in a given format.',
    {
      reviewId: z.string().uuid().describe('UUID of the literature review'),
      format: z.enum(['apa', 'mla', 'chicago', 'bibtex']).describe('Bibliography format'),
    },
    async (args) => {
      const result = await apiGet(`/literature-reviews/${args.reviewId}/bibliography?format=${args.format}`);
      return toToolResult(result);
    },
  );
}
