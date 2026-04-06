import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { apiGet, apiPost, toToolResult } from '../api-client.js';

export function registerKeywordTools(server: McpServer): void {
  server.tool(
    'suggest_keywords',
    'Get AI-generated keyword suggestions for broadening research, based on the current corpus of analyzed documents. Returns 6-10 keywords with EBSCO-compatible search queries.',
    async () => {
      const result = await apiGet('/research-scopes/keyword-suggestions');
      return toToolResult(result);
    },
  );

  server.tool(
    'generate_ebsco_queries',
    'Generate 6-10 EBSCO boolean search queries tailored to a specific thesis question.',
    {
      questionId: z.string().uuid().describe('UUID of the thesis question'),
    },
    async (args) => {
      const result = await apiPost(`/thesis-questions/${args.questionId}/ebsco-queries`);
      return toToolResult(result);
    },
  );
}
