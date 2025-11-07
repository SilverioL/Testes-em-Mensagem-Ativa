import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const apiKey = this.extractApiKeyFromHeader(request);

    if (!apiKey) {
      throw new UnauthorizedException('API Key é obrigatória');
    }

    const validApiKey = this.configService.get<string>('API_KEY');

    if (apiKey !== validApiKey) {
      throw new UnauthorizedException('API Key inválida');
    }

    return true;
  }

  private extractApiKeyFromHeader(request: Request): string | undefined {
    return (request.headers['x-api-key'] ||
      request.headers['api-key'] ||
      request.headers.authorization?.replace('Bearer ', '') ||
      request.headers.authorization?.replace('ApiKey ', '')) as string;
  }
}
