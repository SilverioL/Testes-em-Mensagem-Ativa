import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { MessageSender } from '../../interfaces/message-sender.interface';
import type { ITemplateMessage } from '../infobip/types/infobip-whatsapp-template.type';
import { WhatsAppTemplateCommand } from './../../domain/commands/whatsapp-template.command';
import { MessageLogService } from '../../../common/services/message-log.service';

@Injectable()
export class InfobipSender implements MessageSender {
  constructor(private readonly messageLogService: MessageLogService) {}

  async sendWhatsApp(options: WhatsAppTemplateCommand): Promise<void> {
    const url = `${process.env.INFOBIP_BASE_URL}/whatsapp/1/message/template`;
    const headers = {
      Authorization: `${process.env.INFOBIP_API_KEY}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    const messageId = options?.messageId || `${uuidv4()}`;

    const body: ITemplateMessage = {
      messages: [
        {
          from: options.from || process.env.INFOBIP_DEFAULT_SENDER || '',
          to: options.to,
          messageId,
          notifyUrl: options.notifyUrl,
          content: {
            templateName: options.templateName,
            templateData: {
              body: {
                placeholders: options.placeholders || [],
              },
            },
            language: options.language || 'pt_BR',
          },
        },
      ],
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });

      const responseText = await response.text();
      console.log('Infobip response:', response.status, responseText);

      let parsedResponse: any = responseText;
      try {
        parsedResponse = JSON.parse(responseText);
      } catch {}

      void this.messageLogService.logAttempt({
        command: {
          from: body.messages[0].from,
          to: options.to,
          templateName: options.templateName,
        },
        messageId,
        providerStatus: response.status,
        providerResponse: parsedResponse,
        ok: response.ok,
      });

      if (!response.ok) {
        throw new Error(
          `Infobip API error: ${response.status} - ${responseText}`,
        );
      }
    } catch (error) {
      void this.messageLogService.logAttempt({
        command: {
          from: options.from,
          to: options.to,
          templateName: options.templateName,
        },
        messageId,
        providerStatus: error.status || 500,
        providerResponse: { error: error.message },
        ok: false,
      });

      throw error;
    }
  }
}
