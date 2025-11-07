import { PartialType } from '@nestjs/mapped-types';
import { WhatsAppTemplateCommandDto } from './create-messaging.dto';

export class UpdateMessagingDto extends PartialType(
  WhatsAppTemplateCommandDto,
) {}
