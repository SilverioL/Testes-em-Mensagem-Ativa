import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsArray,
  IsEnum,
  ValidateNested,
  IsNumber,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import { WhatsAppTemplateCommand } from '../domain/commands/whatsapp-template.command';

export enum WhatsAppHeaderType {
  TEXT = 'TEXT',
  DOCUMENT = 'DOCUMENT',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  LOCATION = 'LOCATION',
}

export enum WhatsAppButtonType {
  QUICK_REPLY = 'QUICK_REPLY',
  URL = 'URL',
}

export class WhatsAppHeaderDto {
  @ApiProperty({ enum: WhatsAppHeaderType, description: 'Tipo do cabeçalho' })
  @IsEnum(WhatsAppHeaderType)
  type: WhatsAppHeaderType;

  @ApiPropertyOptional({ description: 'Texto do placeholder (para tipo TEXT)' })
  @IsOptional()
  @IsString()
  placeholder?: string;

  @ApiPropertyOptional({
    description: 'URL da mídia (para tipos DOCUMENT, IMAGE, VIDEO)',
  })
  @IsOptional()
  @IsString()
  mediaUrl?: string;

  @ApiPropertyOptional({ description: 'Nome do arquivo (para tipo DOCUMENT)' })
  @IsOptional()
  @IsString()
  filename?: string;

  @ApiPropertyOptional({ description: 'Latitude (para tipo LOCATION)' })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional({ description: 'Longitude (para tipo LOCATION)' })
  @IsOptional()
  @IsNumber()
  longitude?: number;
}

export class WhatsAppButtonDto {
  @ApiProperty({ enum: WhatsAppButtonType, description: 'Tipo do botão' })
  @IsEnum(WhatsAppButtonType)
  type: WhatsAppButtonType;

  @ApiProperty({ description: 'Parâmetro do botão' })
  @IsString()
  parameter: string;
}

export class SendWhatsAppMessageDto {
  @ApiPropertyOptional({
    description: 'Número do remetente',
    example: '551128735031',
  })
  @IsOptional()
  @IsString()
  from?: string;

  @ApiProperty({
    description: 'Número do destinatário',
    example: '5511987654321',
  })
  @IsString()
  to: string;

  @ApiProperty({
    description: 'Nome do template no Infobip',
    example: 'brf_welcome_message',
  })
  @IsString()
  templateName: string;

  @ApiProperty({
    description: 'Idioma do template',
    example: 'pt_BR',
    default: 'pt_BR',
  })
  @IsString()
  language: string;

  @ApiPropertyOptional({
    description: 'Lista de placeholders para substituição no template',
    example: ['João', 'Silva', '123456'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  placeholders?: string[];

  @ApiPropertyOptional({
    description: 'Cabeçalho da mensagem',
    type: WhatsAppHeaderDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => WhatsAppHeaderDto)
  header?: WhatsAppHeaderDto;

  @ApiPropertyOptional({
    description: 'Botões da mensagem',
    type: [WhatsAppButtonDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WhatsAppButtonDto)
  buttons?: WhatsAppButtonDto[];

  @ApiPropertyOptional({
    description: 'Dados de callback',
  })
  @IsOptional()
  @IsString()
  callbackData?: string;

  @ApiPropertyOptional({
    description: 'URL para notificações de status',
  })
  @IsOptional()
  @IsString()
  notifyUrl?: string;

  @ApiPropertyOptional({
    description: 'Dados de utilizados para regras de negócio',
  })
  @IsOptional()
  @IsObject()
  customMetaData?: object;

  @ApiPropertyOptional({
    description: 'URL para webhook customizado',
  })
  @IsOptional()
  @IsString()
  customWebHook?: string;

  @ApiPropertyOptional({
    description: 'Token de autorização para webhook customizado',
  })
  @IsOptional()
  @IsString()
  authorizationToken?: string;


  static toCommand(dto: SendWhatsAppMessageDto): WhatsAppTemplateCommand {
    return {
      from: dto.from,
      to: dto.to,
      templateName: dto.templateName,
      language: dto.language || 'pt_BR',
      placeholders: dto.placeholders,
      header: dto.header ? this.mapHeader(dto.header) : undefined,
      buttons: dto.buttons
        ? dto.buttons.map((btn) => this.mapButton(btn))
        : undefined,
      callbackData: dto.callbackData,
      notifyUrl: dto.notifyUrl,
      customMetaData: dto.customMetaData,
      customWebHook: dto.customWebHook,
      authorizationToken: dto.authorizationToken,
    };
  }

  private static mapHeader(
    headerDto: WhatsAppHeaderDto,
  ): WhatsAppTemplateCommand['header'] {
    switch (headerDto.type) {
      case WhatsAppHeaderType.TEXT:
        return {
          type: 'TEXT',
          placeholder: headerDto.placeholder!,
        };
      case WhatsAppHeaderType.DOCUMENT:
        return {
          type: 'DOCUMENT',
          mediaUrl: headerDto.mediaUrl!,
          filename: headerDto.filename!,
        };
      case WhatsAppHeaderType.IMAGE:
        return {
          type: 'IMAGE',
          mediaUrl: headerDto.mediaUrl!,
        };
      case WhatsAppHeaderType.VIDEO:
        return {
          type: 'VIDEO',
          mediaUrl: headerDto.mediaUrl!,
        };
      case WhatsAppHeaderType.LOCATION:
        return {
          type: 'LOCATION',
          latitude: headerDto.latitude!,
          longitude: headerDto.longitude!,
        };
    }
  }

  private static mapButton(
    buttonDto: WhatsAppButtonDto,
  ): NonNullable<WhatsAppTemplateCommand['buttons']>[0] {
    return {
      type: buttonDto.type as 'QUICK_REPLY' | 'URL',
      parameter: buttonDto.parameter,
    };
  }
}
