export type WhatsAppHeader =
  | { type: 'TEXT'; placeholder: string }
  | { type: 'DOCUMENT'; mediaUrl: string; filename: string }
  | { type: 'IMAGE'; mediaUrl: string }
  | { type: 'VIDEO'; mediaUrl: string }
  | { type: 'LOCATION'; latitude: number; longitude: number };

export type WhatsAppButton =
  | { type: 'QUICK_REPLY'; parameter: string }
  | { type: 'URL'; parameter: string };

export interface WhatsAppTemplateCommand {
  customMetaData?: object;
  authorizationToken?: string;
  customWebHook?: string;
  from?: string;
  to: string;
  messageId?: string;
  templateName: string;
  language: string;
  placeholders?: string[];

  header?: WhatsAppHeader;
  buttons?: WhatsAppButton[];

  callbackData?: string;
  notifyUrl?: string;
  urlOptions?: {
    shortenUrl?: boolean;
    trackClicks?: boolean;
    trackingUrl?: string;
    removeProtocol?: boolean;
    customDomain?: string;
  };
}
