import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';
import { getAnthropicClient } from '../../config/anthropic.config';
import type {
  DocumentMetadata,
  CitationResult,
  LiteratureReviewResult,
  AiHealthResponse,
} from '@repo/types';

const SYSTEM_PROMPT = `You are an academic research assistant specializing in literature review synthesis.
Your task is to create a structured literature review from the provided research documents.

OUTPUT FORMAT:
1. A structured literature review in markdown with inline citation markers like [DOC_ID:PAGE]
2. After the review content, a JSON block with citation metadata

CITATION FORMAT in the review text:
Use markers like [doc-uuid:page_number] inline with claims.

After the review, output a JSON block:
\`\`\`json:citations
[
  {"text": "claim text", "sourceDocumentId": "doc-uuid", "pageNumber": 12}
]
\`\`\``;

@Injectable()
export class AiService implements OnModuleInit {
  private readonly logger = new Logger(AiService.name);
  private client: Anthropic;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.client = getAnthropicClient(this.configService);
    this.logger.log('Anthropic AI client initialized');
  }

  async checkHealth(): Promise<AiHealthResponse> {
    const model = this.configService.get<string>(
      'ANTHROPIC_MODEL',
      'claude-sonnet-4-5-20250929',
    );

    try {
      await this.client.messages.create({
        model,
        max_tokens: 32,
        messages: [{ role: 'user', content: 'Respond with "ok"' }],
      });

      return {
        status: 'ok',
        model,
      };
    } catch (error) {
      this.handleApiError(error, 'health-check');
    }
  }

  async generateLiteratureReview(
    documents: DocumentMetadata[],
    extractedTexts: Record<string, string>,
  ): Promise<LiteratureReviewResult> {
    if (!documents.length) {
      throw new Error('At least one document is required for literature review generation');
    }

    const model = this.configService.get<string>(
      'ANTHROPIC_MODEL',
      'claude-sonnet-4-5-20250929',
    );

    const documentSections = documents
      .map((doc) => {
        const text = extractedTexts[doc.id];
        if (!text) return null;
        return `--- DOCUMENT: ${doc.fileName} (ID: ${doc.id}, Pages: ${doc.pageCount ?? 'unknown'}) ---\n${text}`;
      })
      .filter(Boolean)
      .join('\n\n');

    if (!documentSections) {
      throw new Error('No extracted text found for any of the provided documents');
    }

    const userPrompt = `Please synthesize a structured literature review from the following ${documents.length} research document(s):\n\n${documentSections}`;

    try {
      const message = await this.client.messages.create({
        model,
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userPrompt }],
      });

      const responseText =
        message.content[0].type === 'text' ? message.content[0].text : '';

      this.logger.log(
        `Literature review generated: ${message.usage.input_tokens} input tokens, ${message.usage.output_tokens} output tokens`,
      );

      return this.parseResponse(responseText);
    } catch (error) {
      this.handleApiError(error, 'generate-literature-review', {
        documentCount: documents.length,
      });
    }
  }

  private parseResponse(responseText: string): LiteratureReviewResult {
    // Extract citations JSON block — tolerant regex handles:
    // ```json:citations, ```json, or ```citations variants
    const citationsMatch = responseText.match(
      /```(?:json(?::citations)?|citations)\s*\n([\s\S]*?)```/,
    );

    let citations: CitationResult[] = [];
    let content = responseText;

    if (citationsMatch) {
      try {
        citations = JSON.parse(citationsMatch[1]);
      } catch (e) {
        this.logger.warn('Failed to parse citations JSON block, continuing without structured citations');
      }
      // Remove the JSON block from the content
      content = responseText
        .replace(/```(?:json(?::citations)?|citations)\s*\n[\s\S]*?```/, '')
        .trim();
    } else {
      this.logger.warn('No citations JSON block found in AI response');
    }

    // Extract title from first heading or first line
    const titleMatch = content.match(/^#\s+(.+)/m);
    const title = titleMatch ? titleMatch[1].trim() : 'Literature Review';

    return { title, content, citations };
  }

  private handleApiError(
    error: unknown,
    context: string,
    meta?: Record<string, unknown>,
  ): never {
    if (error instanceof Anthropic.APIError) {
      const logMeta = meta ? ` | ${JSON.stringify(meta)}` : '';
      switch (error.status) {
        case 401:
          this.logger.error(`Invalid Anthropic API key [${context}]${logMeta}`);
          throw new Error('AI service authentication failed');
        case 429:
          this.logger.warn(
            `Anthropic rate limit exceeded [${context}]${logMeta}`,
          );
          throw new Error('AI service rate limited - please retry later');
        case 500:
        case 503:
          this.logger.error(
            `Anthropic service unavailable [${context}]${logMeta}`,
          );
          throw new Error('AI service temporarily unavailable');
        default:
          this.logger.error(
            `Anthropic API error: ${error.status} ${error.message} [${context}]${logMeta}`,
          );
          throw new Error(`AI service error: ${error.message}`);
      }
    }
    throw error;
  }
}
