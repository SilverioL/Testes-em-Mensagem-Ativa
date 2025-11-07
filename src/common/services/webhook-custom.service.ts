import { Injectable, Logger } from "@nestjs/common"
import { IWebhookService, IWebhookData } from "src/messaging/interfaces/webhook-custom.interface";

@Injectable()
export class WebhookService implements IWebhookService {
  private readonly logger = new Logger(WebhookService.name);

  async sendWebhook(webhookOptions: IWebhookData): Promise<void> {
    if (!webhookOptions.customWebHook) {
      this.logger.log('No customWebHook provided, skipping webhook call');
      return;
    }

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      };

      if (webhookOptions.authorizationToken) {
        headers['Authorization'] = webhookOptions.authorizationToken;
      }

      const body = webhookOptions.customMetaData || {};

      const response = await fetch(webhookOptions.customWebHook, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });

      const responseText = await response.text();

      if (!response.ok) {
        this.logger.error(`Webhook failed with status ${response.status}: ${responseText}`);
      } else {
        this.logger.log(`Webhook sent successfully to: ${webhookOptions.customWebHook}${webhookOptions.authorizationToken ? ' (with auth)' : ''}`);
      }
    } catch (error) {
      this.logger.error(`Failed to send webhook to ${webhookOptions.customWebHook}: ${error.message}`);
      this.logger.error(`Error stack: ${error.stack}`);
    }
  }
}