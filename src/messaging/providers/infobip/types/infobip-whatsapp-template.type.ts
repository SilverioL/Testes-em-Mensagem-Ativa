export interface ITemplateMessage {
  messages: IMessages[];
}

export interface IMessages {
  from: string;
  to: string;
  messageId: string;
  content: IContent;
  callbackData?: string;
  notifyUrl?: string;
  urlOptions?: IUrlOptions;
}

export interface IContent {
  templateName: string;
  templateData: ITemplateData;
  language: string;
}

export interface ITemplateData {
  body: IBody;
  header?: IHeader;
  buttons?: IButton[];
}

export interface IBody {
  placeholders: string[];
}

export type IHeader =
  | ITextHeader
  | IDocumentHeader
  | IImageHeader
  | IVideoHeader
  | ILocationHeader;

export interface ITextHeader {
  type: 'TEXT';
  placeholder: string;
}

export interface IDocumentHeader {
  type: 'DOCUMENT';
  mediaUrl: string;
  filename: string;
}

export interface IImageHeader {
  type: 'IMAGE';
  mediaUrl: string;
}

export interface IVideoHeader {
  type: 'VIDEO';
  mediaUrl: string;
}

export interface ILocationHeader {
  type: 'LOCATION';
  latitude: number;
  longitude: number;
}

export type IButton = IQuickReplyButton | IUrlButton;
// | ICopyCodeButton
// | IFlowButton
// | ICatalogButton
// | IMultiProductButton
// | IOrderDetailsButton;

export interface IQuickReplyButton {
  type: 'QUICK_REPLY';
  parameter: string;
}

export interface IUrlButton {
  type: 'URL';
  parameter: string;
}

export interface IUrlOptions {
  shortenUrl: boolean;
  trackClicks: boolean;
  trackingUrl: string;
  removeProtocol: boolean;
  customDomain: string;
}
