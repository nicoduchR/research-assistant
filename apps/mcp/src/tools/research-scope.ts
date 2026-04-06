import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { apiGet, apiPost, toToolResult } from '../api-client.js';

export function registerResearchScopeTools(server: McpServer): void {
  server.tool(
    'get_research_scope',
    'Get the current research scope (title, problematique, objectives). Returns null if none exists.',
    async () => {
      const result = await apiGet('/research-scopes');
      return toToolResult(result);
    },
  );

  server.tool(
    'set_research_scope',
    'Create or update the research scope. The problematique must be at least 50 characters.',
    {
      title: z.string().describe('Research title (max 200 chars)'),
      problematique: z.string().describe('Research question/problematique (50-2000 chars)'),
      objectives: z.string().optional().describe('Research objectives (max 1000 chars)'),
    },
    async (args) => {
      const result = await apiPost('/research-scopes', {
        title: args.title,
        problematique: args.problematique,
        objectives: args.objectives,
      });
      return toToolResult(result);
    },
  );
}
