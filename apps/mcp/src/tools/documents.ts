import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { apiGet, apiDelete, apiUpload, toToolResult } from '../api-client.js';

export function registerDocumentTools(server: McpServer): void {
  server.tool(
    'list_documents',
    'List all uploaded documents with their extraction and analysis status, file size, page count, and bibliographic metadata.',
    async () => {
      const result = await apiGet('/documents');
      return toToolResult(result);
    },
  );

  server.tool(
    'upload_document',
    'Upload a PDF document from a local file path. The file will be extracted and can then be analyzed.',
    {
      filePath: z.string().describe('Absolute path to the PDF file on the local filesystem'),
    },
    async (args) => {
      const result = await apiUpload('/documents/upload', args.filePath);
      return toToolResult(result);
    },
  );

  server.tool(
    'get_document_analysis',
    'Get the AI analysis of a document, including summary, methodology assessment, relevance score (1-10), and key citations.',
    {
      documentId: z.string().uuid().describe('UUID of the document'),
    },
    async (args) => {
      const result = await apiGet(`/documents/${args.documentId}/analysis`);
      return toToolResult(result);
    },
  );

  server.tool(
    'delete_document',
    'Delete a document and its associated analysis.',
    {
      documentId: z.string().uuid().describe('UUID of the document to delete'),
    },
    async (args) => {
      const result = await apiDelete(`/documents/${args.documentId}`);
      return toToolResult(result);
    },
  );

  server.tool(
    'discard_citation',
    'Remove a specific citation from a document analysis by its index.',
    {
      documentId: z.string().uuid().describe('UUID of the document'),
      citationIndex: z.number().int().min(0).describe('Zero-based index of the citation to remove'),
    },
    async (args) => {
      const result = await apiDelete(`/documents/${args.documentId}/analysis/citations/${args.citationIndex}`);
      return toToolResult(result);
    },
  );
}
