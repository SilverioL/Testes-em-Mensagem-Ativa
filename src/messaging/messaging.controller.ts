import {
  Controller,
  Post,
  Body,
  Inject,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { SendWhatsAppMessageDto } from './dto/send-whatsapp-message.dto';
import { UseGuards } from '@nestjs/common';
import { ApiSecurity, ApiHeader } from '@nestjs/swagger';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import { MessagingOrchestratorService } from '../common/services/messaging-orchestrator.service';

@ApiTags('Messaging')
@ApiSecurity('api-key')
@ApiHeader({
  name: 'x-api-key',
  description: 'API Key para autenticação',
  required: true,
})
@UseGuards(ApiKeyGuard)
@Controller('messaging')
export class MessagingController {
  constructor(
    private readonly messagingOrchestrator: MessagingOrchestratorService,
  ) { }

  @Post('whatsapp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Enviar mensagem WhatsApp',
    description: 'Envia uma mensagem WhatsApp usando template do Infobip',
  })
  @ApiBody({ type: SendWhatsAppMessageDto })
  @ApiResponse({
    status: 200,
    description: 'Mensagem enviada com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno do servidor',
  })
  async sendWhatsApp(
    @Body() dto: SendWhatsAppMessageDto,
  ): Promise<{ message: string }> {
    const command = SendWhatsAppMessageDto.toCommand(dto);

    await this.messagingOrchestrator.sendWhatsAppWithWebhook(command);

    return { message: 'Mensagem enviada com sucesso' };
  }
}
