import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';

export const getAnthropicClient = (configService: ConfigService): Anthropic => {
  const apiKey = configService.get<string>('ANTHROPIC_API_KEY');

  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY is not configured');
  }

  return new Anthropic({
    apiKey,
  });
};
