import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  protected errorMessage =
    'Muitas requisições. Tente novamente em alguns segundos.';
}
