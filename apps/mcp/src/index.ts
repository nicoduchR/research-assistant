import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { registerResearchScopeTools } from './tools/research-scope.js';
import { registerDocumentTools } from './tools/documents.js';
import { registerLiteratureReviewTools } from './tools/literature-reviews.js';
import { registerThesisQuestionTools } from './tools/thesis-questions.js';
import { registerKeywordTools } from './tools/keywords.js';
import { registerJobTools } from './tools/jobs.js';

const server = new McpServer({
  name: 'research-assistant',
  version: '0.1.0',
});

registerResearchScopeTools(server);
registerDocumentTools(server);
registerLiteratureReviewTools(server);
registerThesisQuestionTools(server);
registerKeywordTools(server);
registerJobTools(server);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error('MCP server failed to start:', err);
  process.exit(1);
});
