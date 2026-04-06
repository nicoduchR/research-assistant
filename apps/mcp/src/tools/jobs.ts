import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { apiGet, toToolResult } from '../api-client.js';

export function registerJobTools(server: McpServer): void {
  server.tool(
    'get_job_status',
    'Check the status and progress of a processing job (literature review generation). Returns status (queued/processing/completed/failed), progress percentage, and resultId when complete.',
    {
      jobId: z.string().uuid().describe('UUID of the processing job'),
    },
    async (args) => {
      const result = await apiGet(`/processing-jobs/${args.jobId}`);
      return toToolResult(result);
    },
  );
}
