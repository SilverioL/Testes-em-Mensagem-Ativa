import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MessageLog, MessageLogDocument } from '../schemas/message-log.schema';

export interface MessageCommand {
  from?: string;
  to: string;
  templateName: string;
}

@Injectable()
export class MessageLogService {
  private readonly logger = new Logger(MessageLogService.name);

  constructor(
    @InjectModel(MessageLog.name)
    private messageLogModel: Model<MessageLogDocument>,
  ) {}

  /**
   * Salva log da tentativa de envio (sucesso ou erro)
   */
  async logAttempt(params: {
    command: MessageCommand;
    messageId: string;
    providerStatus: number;
    providerResponse: any;
    ok: boolean;
  }): Promise<void> {
    const { command, messageId, providerStatus, providerResponse, ok } = params;

    try {
      await this.messageLogModel.create({
        messageId,
        from: command.from || '',
        to: command.to,
        templateName: command.templateName,
        providerStatus,
        providerResponse,
        ok,
      });

      this.logger.log(
        `Message log saved - messageId: ${messageId}, status: ${providerStatus}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to save message log - ${messageId}: ${error.message}`,
      );
    }
  }

  /**
   * Busca logs por filtros (opcional para consultas futuras)
   */
  async getMessageLogs(
    filters: {
      to?: string;
      templateName?: string;
      limit?: number;
      skip?: number;
    } = {},
  ): Promise<MessageLogDocument[]> {
    const query = this.messageLogModel.find();

    if (filters.to) query.where('to', filters.to);
    if (filters.templateName) query.where('templateName', filters.templateName);

    return query
      .sort({ createdAt: -1 })
      .limit(filters.limit || 50)
      .skip(filters.skip || 0)
      .exec();
  }
}
