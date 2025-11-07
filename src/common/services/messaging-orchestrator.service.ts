import { Injectable, Inject } from '@nestjs/common';
import { WhatsAppTemplateCommand } from 'src/messaging/domain/commands/whatsapp-template.command';
import { MessageSender } from 'src/messaging/interfaces/message-sender.interface';
import { IWebhookService } from 'src/messaging/interfaces/webhook-custom.interface';
import { WEBHOOK_SERVICE, WHATSAPP_SENDER } from 'src/messaging/providers/tokens';


@Injectable()
export class MessagingOrchestratorService {
  constructor(
    @Inject(WHATSAPP_SENDER) private readonly messageSender: MessageSender,
    @Inject(WEBHOOK_SERVICE) private readonly webhookService: IWebhookService,
  ) { }

  async sendWhatsAppWithWebhook(command: WhatsAppTemplateCommand): Promise<void> {
    await this.messageSender.sendWhatsApp(command);

    if (command.customWebHook || command.customMetaData || command.authorizationToken) {
      await this.webhookService.sendWebhook({
        customMetaData: command.customMetaData || {},
        customWebHook: command.customWebHook,
        authorizationToken: command.authorizationToken,
      });
    }
  }
}