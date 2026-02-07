import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import Cite from 'citation-js';
import { plugins } from '@citation-js/core';
import { BibliographicMetadata } from '../documents/bibliography-metadata.service';

interface DocumentWithMetadata {
  id: string;
  metadata: BibliographicMetadata | null;
  fileName: string;
}

interface CslEntry {
  id: string;
  type: string;
  title: string;
  author: Array<{ family?: string; given?: string; literal?: string }>;
  issued: { 'date-parts'?: number[][]; literal?: string };
  'container-title'?: string;
  volume?: string;
  issue?: string;
  page?: string;
  DOI?: string;
  publisher?: string;
}

@Injectable()
export class BibliographyExportService implements OnModuleInit {
  private readonly logger = new Logger(BibliographyExportService.name);

  onModuleInit() {
    this.loadCslStyles();
  }

  private loadCslStyles() {
    try {
      const stylesDir = path.join(__dirname, '..', '..', 'assets', 'csl-styles');
      const config = plugins.config.get('@csl');

      const mlaPath = path.join(stylesDir, 'modern-language-association.csl');
      if (fs.existsSync(mlaPath)) {
        const mlaXml = fs.readFileSync(mlaPath, 'utf-8');
        config.templates.add('mla', mlaXml);
        this.logger.log('MLA CSL template loaded');
      }

      const chicagoPath = path.join(
        stylesDir,
        'chicago-fullnote-bibliography.csl',
      );
      if (fs.existsSync(chicagoPath)) {
        const chicagoXml = fs.readFileSync(chicagoPath, 'utf-8');
        config.templates.add('chicago-fullnote-bibliography', chicagoXml);
        this.logger.log('Chicago CSL template loaded');
      }
    } catch (error) {
      this.logger.warn(
        `Failed to load CSL styles: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  formatBibliography(
    documentsWithMetadata: DocumentWithMetadata[],
    format: 'apa' | 'mla' | 'chicago' | 'bibtex',
  ): { content: string; warnings: string[] } {
    const { entries: cslEntries, warnings } = this.buildCslJsonEntries(
      documentsWithMetadata,
    );

    if (cslEntries.length === 0) {
      return { content: '', warnings: ['No citation entries to format.'] };
    }

    if (format === 'bibtex') {
      const cite = new Cite(cslEntries);
      return { content: cite.format('bibtex'), warnings };
    }

    const templateMap: Record<string, string> = {
      apa: 'apa',
      mla: 'mla',
      chicago: 'chicago-fullnote-bibliography',
    };

    const cite = new Cite(cslEntries);
    const content = cite.format('bibliography', {
      format: 'text',
      template: templateMap[format],
      lang: 'en-US',
    });

    return { content, warnings };
  }

  private buildCslJsonEntries(
    documentsWithMetadata: DocumentWithMetadata[],
  ): { entries: CslEntry[]; warnings: string[] } {
    const warnings: string[] = [];

    const entries = documentsWithMetadata.map((doc) => {
      const meta = doc.metadata || ({} as BibliographicMetadata);

      if (!meta.authors?.length) {
        warnings.push(`${doc.fileName}: Missing author information`);
      }
      if (!meta.year) {
        warnings.push(`${doc.fileName}: Missing publication year`);
      }

      return {
        id: doc.id,
        type: meta.type || 'article-journal',
        title: meta.title || doc.fileName.replace(/\.pdf$/i, ''),
        author: meta.authors?.length
          ? meta.authors.map((a) => ({ family: a.family, given: a.given }))
          : [{ literal: '[No author]' }],
        issued: meta.year
          ? { 'date-parts': [[meta.year]] }
          : { literal: '[Unknown year]' },
        'container-title': meta.journal,
        volume: meta.volume,
        issue: meta.issue,
        page: meta.pages,
        DOI: meta.doi,
        publisher: meta.publisher,
      } as CslEntry;
    });

    return { entries, warnings };
  }
}
