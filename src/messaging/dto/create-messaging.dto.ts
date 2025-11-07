import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  Max,
  Min,
  ValidateNested,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

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

/**
 * Headers
 */
class HeaderBaseDto {
  @IsEnum(WhatsAppHeaderType)
  type!: WhatsAppHeaderType;
}

export class HeaderTextDto extends HeaderBaseDto {
  @IsIn([WhatsAppHeaderType.TEXT])
  declare type: WhatsAppHeaderType.TEXT;

  @IsString()
  @IsNotEmpty()
  placeholder!: string;
}

export class HeaderDocumentDto extends HeaderBaseDto {
  @IsIn([WhatsAppHeaderType.DOCUMENT])
  declare type: WhatsAppHeaderType.DOCUMENT;

  @IsUrl()
  mediaUrl!: string;

  @IsString()
  @IsNotEmpty()
  filename!: string;
}

export class HeaderImageDto extends HeaderBaseDto {
  @IsIn([WhatsAppHeaderType.IMAGE])
  declare type: WhatsAppHeaderType.IMAGE;

  @IsUrl()
  mediaUrl!: string;
}

export class HeaderVideoDto extends HeaderBaseDto {
  @IsIn([WhatsAppHeaderType.VIDEO])
  declare type: WhatsAppHeaderType.VIDEO;

  @IsUrl()
  mediaUrl!: string;
}

export class HeaderLocationDto extends HeaderBaseDto {
  @IsIn([WhatsAppHeaderType.LOCATION])
  declare type: WhatsAppHeaderType.LOCATION;

  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude!: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude!: number;
}

/**
 * Buttons
 */
class ButtonBaseDto {
  @IsEnum(WhatsAppButtonType)
  type!: WhatsAppButtonType;
}

export class ButtonQuickReplyDto extends ButtonBaseDto {
  @IsIn([WhatsAppButtonType.QUICK_REPLY])
  declare type: WhatsAppButtonType.QUICK_REPLY;

  @IsString()
  @IsNotEmpty()
  parameter!: string;
}

export class ButtonUrlDto extends ButtonBaseDto {
  @IsIn([WhatsAppButtonType.URL])
  declare type: WhatsAppButtonType.URL;

  @IsUrl()
  parameter!: string;
}

/**
 * UrlOptions e Overrides
 */
export class UrlOptionsDto {
  @IsOptional()
  @IsBoolean()
  shortenUrl?: boolean;

  @IsOptional()
  @IsBoolean()
  trackClicks?: boolean;

  @IsOptional()
  @IsUrl()
  trackingUrl?: string;

  @IsOptional()
  @IsBoolean()
  removeProtocol?: boolean;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  customDomain?: string;
}

export class OverridesDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  from?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  messageId?: string;
}

/**
 * Comando principal
 */
export class WhatsAppTemplateCommandDto {
  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: 'to deve estar em formato E.164 (ex: +5511999998888)',
  })
  to!: string;

  @IsString()
  @MinLength(1)
  templateName!: string;

  @IsString()
  @MinLength(1)
  language!: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  placeholders?: string[];

  @IsOptional()
  @ValidateNested()
  @Type(() => HeaderBaseDto, {
    discriminator: {
      property: 'type',
      subTypes: [
        { name: WhatsAppHeaderType.TEXT, value: HeaderTextDto },
        { name: WhatsAppHeaderType.DOCUMENT, value: HeaderDocumentDto },
        { name: WhatsAppHeaderType.IMAGE, value: HeaderImageDto },
        { name: WhatsAppHeaderType.VIDEO, value: HeaderVideoDto },
        { name: WhatsAppHeaderType.LOCATION, value: HeaderLocationDto },
      ],
    },
    keepDiscriminatorProperty: true,
  })
  header?:
    | HeaderTextDto
    | HeaderDocumentDto
    | HeaderImageDto
    | HeaderVideoDto
    | HeaderLocationDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ButtonBaseDto, {
    discriminator: {
      property: 'type',
      subTypes: [
        { name: WhatsAppButtonType.QUICK_REPLY, value: ButtonQuickReplyDto },
        { name: WhatsAppButtonType.URL, value: ButtonUrlDto },
      ],
    },
    keepDiscriminatorProperty: true,
  })
  buttons?: Array<ButtonQuickReplyDto | ButtonUrlDto>;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  callbackData?: string;

  @IsOptional()
  @IsUrl()
  notifyUrl?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => UrlOptionsDto)
  urlOptions?: UrlOptionsDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => OverridesDto)
  overrides?: OverridesDto;
}
