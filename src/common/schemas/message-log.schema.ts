import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MessageLogDocument = MessageLog & Document;

@Schema({ timestamps: true })
export class MessageLog {
  @Prop({ required: true, index: true })
  messageId: string;

  @Prop({ required: true })
  from: string;

  @Prop({ required: true, index: true })
  to: string;

  @Prop({ required: true })
  templateName: string;

  @Prop({ required: true })
  providerStatus: number;

  @Prop({ type: Object })
  providerResponse: any;

  @Prop({ default: true })
  ok: boolean;
}

export const MessageLogSchema = SchemaFactory.createForClass(MessageLog);

// Índices para consultas eficientes
MessageLogSchema.index({ messageId: 1, createdAt: -1 });
MessageLogSchema.index({ to: 1, createdAt: -1 });
MessageLogSchema.index({ templateName: 1, createdAt: -1 });
