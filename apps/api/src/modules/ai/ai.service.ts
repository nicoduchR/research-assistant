import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';
import { UnrecoverableError } from 'bullmq';
import { getAnthropicClient } from '../../config/anthropic.config';
import type {
  DocumentMetadata,
  CitationResult,
  LiteratureReviewResult,
  AiHealthResponse,
  DocumentAnalysisResult,
  KeywordSuggestion,
  KeywordSuggestionContextDocument,
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

const DOCUMENT_ANALYSIS_PROMPT = `You are an academic research assistant. Analyze the provided research document and return a structured JSON analysis.

You will receive:
1. The document text
2. The research scope (title, problematique, and optionally objectives)

Return ONLY a valid JSON object with this exact structure (no markdown, no code blocks, just raw JSON):
{
  "summary": "A comprehensive summary of the document (200-400 words in the document's language)",
  "keyCitations": [
    {
      "text": "Exact quote from the document",
      "pageNumber": 5,
      "relevance": "high",
      "context": "Why this citation is important for the research"
    }
  ],
  "relevance": {
    "score": 7,
    "explanation": "Explanation of how relevant this document is to the research scope",
    "alignedObjectives": ["objective 1 that this document addresses"],
    "recommendation": "keep"
  },
  "methodology": {
    "type": "qualitative",
    "description": "Description of the methodology used",
    "strengths": ["strength 1"],
    "limitations": ["limitation 1"]
  }
}

Guidelines:
- summary: Write in the same language as the document. Be comprehensive but concise (200-400 words).
- keyCitations: Extract 3-8 key citations. pageNumber should be the approximate page number (or null if unknown). relevance must be "high", "medium", or "low".
- relevance.score: 1-10 where 10 is perfectly aligned with the research scope. recommendation: "keep" (score >= 7), "maybe" (4-6), "skip" (< 4).
- methodology.type: e.g. "qualitative", "quantitative", "mixed methods", "systematic review", "meta-analysis", "theoretical", "case study", etc.`;

const KEYWORD_SUGGESTIONS_PROMPT = `You are an expert academic search strategist.
Your task is to propose high-value keywords and boolean queries for EBSCO-like databases.

You will receive:
1. A research scope (title, problematique, objectives)
2. Evidence from already collected documents and article analyses

Return ONLY a valid JSON object with this exact structure (no markdown, no code blocks):
{
  "suggestions": [
    {
      "keyword": "exact keyword or short keyphrase",
      "intent": "broaden",
      "rationale": "why this keyword extends or deepens the search based on the provided evidence",
      "ebscoQuery": "\"keyword\" AND \"second term\"",
      "relatedQuestion": "research question angle this keyword opens"
    }
  ]
}

Constraints:
- Provide 6 to 10 suggestions.
- intent must be one of: "broaden", "deepen", "complementary", "methodology", "emerging".
- Use the same language as the research scope.
- Make suggestions non-redundant and academically relevant.
- For ebscoQuery, include practical boolean operators (AND/OR/NOT), quotes when useful, and at least one complementary term.
- Prefer suggestions grounded in document limitations, recurring concepts, and citation signals.`;

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

  async analyzeDocument(
    document: DocumentMetadata,
    extractedText: string,
    researchScope: { title: string; problematique: string; objectives?: string | null },
  ): Promise<DocumentAnalysisResult> {
    const model = this.configService.get<string>(
      'ANTHROPIC_MODEL',
      'claude-sonnet-4-5-20250929',
    );

    const scopeSection = [
      `Research Title: ${researchScope.title}`,
      `Problematique: ${researchScope.problematique}`,
      researchScope.objectives ? `Objectives: ${researchScope.objectives}` : null,
    ]
      .filter(Boolean)
      .join('\n');

    // Truncate text to avoid exceeding token limits (roughly ~100k chars ≈ 25k tokens)
    const maxTextLength = 100000;
    const truncatedText =
      extractedText.length > maxTextLength
        ? extractedText.substring(0, maxTextLength) + '\n\n[Text truncated due to length]'
        : extractedText;

    const userPrompt = `Analyze the following research document in the context of this research scope:

--- RESEARCH SCOPE ---
${scopeSection}

--- DOCUMENT: ${document.fileName} (Pages: ${document.pageCount ?? 'unknown'}) ---
${truncatedText}`;

    try {
      const message = await this.client.messages.create({
        model,
        max_tokens: 4096,
        system: DOCUMENT_ANALYSIS_PROMPT,
        messages: [{ role: 'user', content: userPrompt }],
      });

      const responseText =
        message.content[0].type === 'text' ? message.content[0].text : '';

      this.logger.log(
        `Document analysis generated for ${document.id}: ${message.usage.input_tokens} input tokens, ${message.usage.output_tokens} output tokens`,
      );

      return this.parseAnalysisResponse(responseText);
    } catch (error) {
      this.handleApiError(error, 'analyze-document', {
        documentId: document.id,
      });
    }
  }

  async generateKeywordSuggestions(
    researchScope: { title: string; problematique: string; objectives?: string | null },
    documents: KeywordSuggestionContextDocument[],
  ): Promise<KeywordSuggestion[]> {
    if (!documents.length) {
      throw new Error('At least one document is required to generate keyword suggestions');
    }

    const model = this.configService.get<string>(
      'ANTHROPIC_MODEL',
      'claude-sonnet-4-5-20250929',
    );

    const scopeSection = [
      `Research Title: ${researchScope.title}`,
      `Problematique: ${researchScope.problematique}`,
      researchScope.objectives ? `Objectives: ${researchScope.objectives}` : null,
    ]
      .filter(Boolean)
      .join('\n');

    const documentsSection = documents
      .map((document, index) => {
        const citations =
          document.keyCitations && document.keyCitations.length > 0
            ? document.keyCitations
                .map(
                  (citation, citationIndex) =>
                    `  ${citationIndex + 1}. (${citation.relevance}) "${this.truncateText(citation.text, 220)}" | context: ${this.truncateText(citation.context, 180)}`,
                )
                .join('\n')
            : '  none';

        const limitations =
          document.limitations && document.limitations.length > 0
            ? document.limitations.map((limitation) => `- ${limitation}`).join('\n')
            : '- none';

        const alignedObjectives =
          document.alignedObjectives && document.alignedObjectives.length > 0
            ? document.alignedObjectives.map((objective) => `- ${objective}`).join('\n')
            : '- none';

        return [
          `--- DOCUMENT ${index + 1} ---`,
          `id: ${document.id}`,
          `fileName: ${document.fileName}`,
          `title: ${document.title ?? 'unknown'}`,
          `year: ${document.year ?? 'unknown'}`,
          `journal: ${document.journal ?? 'unknown'}`,
          `methodologyType: ${document.methodologyType ?? 'unknown'}`,
          `summary: ${this.truncateText(document.summary, 1000)}`,
          `alignedObjectives:\n${alignedObjectives}`,
          `limitations:\n${limitations}`,
          `keyCitations:\n${citations}`,
        ].join('\n');
      })
      .join('\n\n');

    const userPrompt = `Generate keyword suggestions for this research context.

--- RESEARCH SCOPE ---
${scopeSection}

--- EVIDENCE FROM EXISTING DOCUMENTS ---
${documentsSection}`;

    try {
      const message = await this.client.messages.create({
        model,
        max_tokens: 4096,
        system: KEYWORD_SUGGESTIONS_PROMPT,
        messages: [{ role: 'user', content: userPrompt }],
      });

      const responseText =
        message.content[0].type === 'text' ? message.content[0].text : '';

      this.logger.log(
        `Keyword suggestions generated: ${message.usage.input_tokens} input tokens, ${message.usage.output_tokens} output tokens`,
      );

      return this.parseKeywordSuggestionsResponse(responseText);
    } catch (error) {
      this.handleApiError(error, 'generate-keyword-suggestions', {
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

  private parseAnalysisResponse(responseText: string): DocumentAnalysisResult {
    // Strip any markdown code block wrapping if present
    let jsonText = responseText.trim();
    const codeBlockMatch = jsonText.match(/```(?:json)?\s*\n?([\s\S]*?)```/);
    if (codeBlockMatch) {
      jsonText = codeBlockMatch[1].trim();
    }

    try {
      const parsed = JSON.parse(jsonText);

      // Validate and provide defaults for required fields
      return {
        summary: parsed.summary || 'No summary generated',
        keyCitations: Array.isArray(parsed.keyCitations)
          ? parsed.keyCitations.map((c: Record<string, unknown>) => ({
              text: String(c.text || ''),
              pageNumber: typeof c.pageNumber === 'number' ? c.pageNumber : null,
              relevance: ['high', 'medium', 'low'].includes(c.relevance as string)
                ? (c.relevance as 'high' | 'medium' | 'low')
                : 'medium',
              context: String(c.context || ''),
            }))
          : [],
        relevance: {
          score: Math.min(10, Math.max(1, Number(parsed.relevance?.score) || 5)),
          explanation: String(parsed.relevance?.explanation || ''),
          alignedObjectives: Array.isArray(parsed.relevance?.alignedObjectives)
            ? parsed.relevance.alignedObjectives.map(String)
            : [],
          recommendation: ['keep', 'maybe', 'skip'].includes(
            parsed.relevance?.recommendation,
          )
            ? parsed.relevance.recommendation
            : 'maybe',
        },
        methodology: {
          type: String(parsed.methodology?.type || 'unknown'),
          description: String(parsed.methodology?.description || ''),
          strengths: Array.isArray(parsed.methodology?.strengths)
            ? parsed.methodology.strengths.map(String)
            : [],
          limitations: Array.isArray(parsed.methodology?.limitations)
            ? parsed.methodology.limitations.map(String)
            : [],
        },
      };
    } catch (e) {
      this.logger.error(
        `Failed to parse document analysis response: ${e instanceof Error ? e.message : String(e)}`,
      );
      throw new UnrecoverableError(
        'Failed to parse AI analysis response. The response was not valid JSON.',
      );
    }
  }

  private parseKeywordSuggestionsResponse(responseText: string): KeywordSuggestion[] {
    let jsonText = responseText.trim();
    const codeBlockMatch = jsonText.match(/```(?:json)?\s*\n?([\s\S]*?)```/);
    if (codeBlockMatch) {
      jsonText = codeBlockMatch[1].trim();
    }

    try {
      const parsed = JSON.parse(jsonText);
      const rawSuggestions = Array.isArray(parsed.suggestions)
        ? parsed.suggestions
        : [];

      const suggestions: KeywordSuggestion[] = rawSuggestions
        .map((suggestion: Record<string, unknown>) => {
          const intentCandidate = String(suggestion.intent || '').trim();
          const intent = ['broaden', 'deepen', 'complementary', 'methodology', 'emerging'].includes(
            intentCandidate,
          )
            ? (intentCandidate as KeywordSuggestion['intent'])
            : 'complementary';

          const keyword = this.truncateText(String(suggestion.keyword || '').trim(), 120);
          if (!keyword) {
            return null;
          }

          const rationale = this.truncateText(
            String(suggestion.rationale || '').trim(),
            420,
          );
          const ebscoQuery = this.truncateText(
            String(suggestion.ebscoQuery || '').trim(),
            320,
          );
          const relatedQuestion = this.truncateText(
            String(suggestion.relatedQuestion || '').trim(),
            240,
          );

          return {
            keyword,
            intent,
            rationale: rationale || `Explore ${keyword} to expand the evidence base.`,
            ebscoQuery: ebscoQuery || `"${keyword}"`,
            relatedQuestion:
              relatedQuestion || `How does ${keyword} influence the research problem?`,
          } satisfies KeywordSuggestion;
        })
        .filter(
          (suggestion: KeywordSuggestion | null): suggestion is KeywordSuggestion =>
            suggestion !== null,
        )
        .slice(0, 10);

      if (!suggestions.length) {
        throw new UnrecoverableError(
          'AI response did not contain valid keyword suggestions.',
        );
      }

      return suggestions;
    } catch (e) {
      this.logger.error(
        `Failed to parse keyword suggestions response: ${e instanceof Error ? e.message : String(e)}`,
      );
      throw new UnrecoverableError(
        'Failed to parse AI keyword suggestions response. The response was not valid JSON.',
      );
    }
  }

  private truncateText(text: string | null | undefined, maxLength: number): string {
    if (!text) {
      return '';
    }

    const normalized = text.replace(/\s+/g, ' ').trim();
    if (normalized.length <= maxLength) {
      return normalized;
    }

    return `${normalized.slice(0, Math.max(0, maxLength - 3))}...`;
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
          // Non-retryable: bad API key
          this.logger.error(`Invalid Anthropic API key [${context}]${logMeta}`);
          throw new UnrecoverableError(
            'AI service authentication failed. Contact administrator.',
          );
        case 400:
          // Non-retryable: bad request
          this.logger.error(
            `Anthropic bad request [${context}]${logMeta}`,
          );
          throw new UnrecoverableError(`AI service error: ${error.message}`);
        case 429:
          // Retryable: rate limited
          this.logger.warn(
            `Anthropic rate limit exceeded [${context}]${logMeta}`,
          );
          throw new Error('AI service rate limited. Retrying...');
        case 500:
        case 503:
          // Retryable: server issues
          this.logger.error(
            `Anthropic service unavailable [${context}]${logMeta}`,
          );
          throw new Error('AI service temporarily unavailable. Retrying...');
        default:
          // Non-retryable: unknown client error
          this.logger.error(
            `Anthropic API error: ${error.status} ${error.message} [${context}]${logMeta}`,
          );
          throw new UnrecoverableError(`AI service error: ${error.message}`);
      }
    }
    // Network errors are retryable
    const logMeta = meta ? ` | ${JSON.stringify(meta)}` : '';
    this.logger.error(
      `AI service connection error [${context}]${logMeta}: ${(error as Error).message}`,
      (error as Error).stack,
    );
    throw new Error(
      `AI service unavailable. Please try again later.`,
    );
  }
}
