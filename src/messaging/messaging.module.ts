import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { WHATSAPP_SENDER, WEBHOOK_SERVICE } from './providers/tokens';
import { MessagingController } from './messaging.controller';
import { MessageLog, MessageLogSchema } from '../common/schemas/message-log.schema';
import { MessageLogService } from '../common/services/message-log.service';
import { WebhookService } from '../common/services/webhook-custom.service';
import { MessagingOrchestratorService } from '../common/services/messaging-orchestrator.service';
import { InfobipModule } from './providers/infobip/infobip.module';
import { InfobipSender } from './providers/infobip/infobip.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forFeature([
      {
        name: MessageLog.name,
        schema: MessageLogSchema,
        collection: 'message_logs',
      },
    ]),
    InfobipModule,
  ],
  controllers: [MessagingController],
  providers: [
    MessageLogService,
    WebhookService,
    MessagingOrchestratorService,
    {
      provide: WHATSAPP_SENDER,
      inject: [ConfigService, InfobipSender],
      useFactory: (cfg: ConfigService, infobip: InfobipSender) => {
        const provider = (
          cfg.get<string>('MESSAGING_PROVIDER') || 'infobip'
        ).toLowerCase();
        switch (provider) {
          case 'infobip':
            return infobip;
          default:
            throw new Error(`Provider inválido: ${provider}`);
        }
      },
    },
    {
      provide: WEBHOOK_SERVICE,
      useClass: WebhookService,
    },
  ],
  exports: [
    WHATSAPP_SENDER,
    MessagingOrchestratorService,
  ],
})
export class MessagingModule { }
