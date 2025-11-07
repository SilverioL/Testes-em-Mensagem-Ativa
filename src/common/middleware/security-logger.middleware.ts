import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SecurityLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('SecurityLogger');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip, headers } = req;
    const userAgent = headers['user-agent'] || 'Unknown';
    const apiKey = headers['x-api-key'] ? '***HIDDEN***' : 'NOT_PROVIDED';

    const requestId = uuidv4();

    (req as any).requestId = requestId;

    this.logger.log(
      `[${requestId}] ${method} ${originalUrl} - IP: ${ip} - API_KEY: ${apiKey} - User-Agent: ${userAgent}`,
    );

    next();
  }
}
