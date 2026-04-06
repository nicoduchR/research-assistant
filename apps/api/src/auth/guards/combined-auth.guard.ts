import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ApiKeyAuthGuard } from './api-key-auth.guard';

@Injectable()
export class CombinedAuthGuard implements CanActivate {
  constructor(
    private jwtAuthGuard: JwtAuthGuard,
    private apiKeyAuthGuard: ApiKeyAuthGuard,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request & { user?: { userId: string; email: string; name: string } }>();
    const apiKey = request.headers['x-api-key'];

    if (apiKey) {
      return this.apiKeyAuthGuard.canActivate(context);
    }

    return this.jwtAuthGuard.canActivate(context) as Promise<boolean>;
  }
}
