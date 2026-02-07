import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

export interface BibliographicMetadata {
  authors?: Array<{ given: string; family: string }>;
  title?: string;
  year?: number;
  journal?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  doi?: string;
  publisher?: string;
  url?: string;
  type?: string;
}

@Injectable()
export class BibliographyMetadataService {
  private readonly logger = new Logger(BibliographyMetadataService.name);

  constructor(private readonly httpService: HttpService) {}

  extractDoi(text: string): string | null {
    const match = text.match(
      /\b(10\.\d{4,}(?:\.\d+)*\/(?:(?!["&'<>])\S)+)\b/,
    );
    return match ? match[1] : null;
  }

  async enrichFromCrossRef(
    doi: string,
  ): Promise<BibliographicMetadata | null> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `https://api.crossref.org/works/${encodeURIComponent(doi)}`,
          {
            headers: {
              'User-Agent':
                'ResearchAssistant/1.0 (mailto:contact@research-assistant.app)',
            },
            timeout: 10000,
          },
        ),
      );
      const item = response.data.message;
      return {
        title: item.title?.[0],
        authors: item.author?.map((a: any) => ({
          given: a.given,
          family: a.family,
        })),
        journal: item['container-title']?.[0],
        volume: item.volume,
        issue: item.issue,
        pages: item.page,
        year: item.issued?.['date-parts']?.[0]?.[0],
        doi: item.DOI,
        publisher: item.publisher,
        type:
          item.type === 'journal-article' ? 'article-journal' : item.type,
      };
    } catch (error) {
      this.logger.warn(
        `CrossRef enrichment failed for DOI ${doi}: ${error instanceof Error ? error.message : String(error)}`,
      );
      return null;
    }
  }

  async extractMetadataFromPdf(
    pdfInfo: { Title?: string; Author?: string; CreationDate?: string },
    extractedText: string,
  ): Promise<BibliographicMetadata> {
    // 1. Try DOI extraction + CrossRef first (most reliable)
    const doi = this.extractDoi(extractedText);
    if (doi) {
      const crossRefData = await this.enrichFromCrossRef(doi);
      if (crossRefData) return crossRefData;
    }

    // 2. Fall back to PDF info metadata
    return {
      title: pdfInfo.Title || undefined,
      authors: pdfInfo.Author
        ? this.parseAuthorsFromString(pdfInfo.Author)
        : undefined,
      year: pdfInfo.CreationDate
        ? this.parseYearFromDate(pdfInfo.CreationDate)
        : undefined,
      doi: doi || undefined,
      type: 'misc',
    };
  }

  private parseAuthorsFromString(
    authorStr: string,
  ): Array<{ given: string; family: string }> {
    // Split by common delimiters: semicolons, " and ", commas (when multiple authors)
    const parts = authorStr
      .split(/[;]|\band\b/i)
      .map((s) => s.trim())
      .filter(Boolean);

    return parts.map((part) => {
      // Handle "LastName, FirstName" format
      if (part.includes(',')) {
        const [family, given] = part.split(',').map((s) => s.trim());
        return { family: family || part, given: given || '' };
      }
      // Handle "FirstName LastName" format
      const words = part.trim().split(/\s+/);
      if (words.length >= 2) {
        const family = words[words.length - 1];
        const given = words.slice(0, -1).join(' ');
        return { family, given };
      }
      return { family: part, given: '' };
    });
  }

  private parseYearFromDate(dateStr: string): number | undefined {
    // PDF date format: "D:20260115123045" or just a year string
    const pdfDateMatch = dateStr.match(/D:(\d{4})/);
    if (pdfDateMatch) {
      return parseInt(pdfDateMatch[1], 10);
    }
    const yearMatch = dateStr.match(/(\d{4})/);
    if (yearMatch) {
      return parseInt(yearMatch[1], 10);
    }
    return undefined;
  }
}
