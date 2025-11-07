import { WhatsAppTemplateCommand } from '../domain/commands/whatsapp-template.command';

export interface MessageSender {
  // sendSms?(options: SmsOptions): Promise<void>;
  sendWhatsApp(options: WhatsAppTemplateCommand): Promise<void>;
}
