import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as sanitizeHtml from 'sanitize-html';
import { ResearchScope } from '../../entities/research-scope.entity';
import { CreateResearchScopeDto } from './dto/create-research-scope.dto';

@Injectable()
export class ResearchService {
  constructor(
    @InjectRepository(ResearchScope)
    private researchScopeRepository: Repository<ResearchScope>,
  ) {}

  /**
   * Sanitize user input to prevent XSS attacks
   * Strips all HTML tags and dangerous content
   */
  private sanitizeInput(input: string): string {
    return sanitizeHtml(input, {
      allowedTags: [], // No HTML tags allowed
      allowedAttributes: {},
      disallowedTagsMode: 'discard',
    }).trim();
  }

  async getUserScope(userId: string): Promise<ResearchScope | null> {
    return this.researchScopeRepository.findOne({
      where: { userId },
    });
  }

  async createOrUpdateScope(
    userId: string,
    dto: CreateResearchScopeDto,
  ): Promise<ResearchScope> {
    // Check if user already has a scope
    const existingScope = await this.getUserScope(userId);

    // Sanitize all user inputs to prevent XSS attacks
    const sanitizedTitle = this.sanitizeInput(dto.title);
    const sanitizedProblematique = this.sanitizeInput(dto.problematique);
    const sanitizedObjectives = dto.objectives
      ? this.sanitizeInput(dto.objectives)
      : null;

    if (existingScope) {
      // Update existing scope
      existingScope.title = sanitizedTitle;
      existingScope.problematique = sanitizedProblematique;
      existingScope.objectives = sanitizedObjectives;
      return this.researchScopeRepository.save(existingScope);
    }

    // Create new scope
    const scope = this.researchScopeRepository.create({
      userId,
      title: sanitizedTitle,
      problematique: sanitizedProblematique,
      objectives: sanitizedObjectives,
    });

    return this.researchScopeRepository.save(scope);
  }
}
