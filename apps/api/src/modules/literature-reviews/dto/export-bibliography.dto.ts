import { IsEnum } from 'class-validator';

export enum BibliographyFormat {
  APA = 'apa',
  MLA = 'mla',
  CHICAGO = 'chicago',
  BIBTEX = 'bibtex',
}

export class ExportBibliographyDto {
  @IsEnum(BibliographyFormat, {
    message: 'format must be one of: apa, mla, chicago, bibtex',
  })
  format: BibliographyFormat;
}
