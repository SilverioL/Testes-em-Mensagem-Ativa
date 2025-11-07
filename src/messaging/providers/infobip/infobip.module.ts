import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InfobipSender } from './infobip.service';
import { WHATSAPP_SENDER } from '../tokens';
import { MessageLogService } from '../../../common/services/message-log.service';
import { MessageLog, MessageLogSchema } from '../../../common/schemas/message-log.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: MessageLog.name,
        schema: MessageLogSchema,
        collection: 'message_logs',
      },
    ]),
  ],
  providers: [
    InfobipSender,
    MessageLogService,
    { provide: WHATSAPP_SENDER, useExisting: InfobipSender },
  ],
  exports: [WHATSAPP_SENDER, InfobipSender],
})
export class InfobipModule {}
