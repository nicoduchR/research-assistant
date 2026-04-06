import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { timingSafeEqual } from 'crypto';
import { Request } from 'express';
import { AuthService } from '../auth.service';

@Injectable()
export class ApiKeyAuthGuard implements CanActivate {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request & { user?: { userId: string; email: string; name: string } }>();
    const apiKey = request.headers['x-api-key'];

    if (!apiKey || typeof apiKey !== 'string') {
      throw new UnauthorizedException('Missing API key');
    }

    const expectedKey = this.configService.get<string>('MCP_API_KEY');
    const keysMatch =
      expectedKey &&
      expectedKey.length === apiKey.length &&
      timingSafeEqual(Buffer.from(apiKey), Buffer.from(expectedKey));
    if (!expectedKey || !keysMatch) {
      throw new UnauthorizedException('Invalid API key');
    }

    const email = this.configService.get<string>('MCP_USER_EMAIL');
    if (!email) {
      throw new UnauthorizedException('MCP_USER_EMAIL not configured');
    }

    const user = await this.authService.findUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException('MCP user account not found');
    }

    request.user = {
      userId: user.id,
      email: user.email,
      name: user.name,
    };

    return true;
  }
}
