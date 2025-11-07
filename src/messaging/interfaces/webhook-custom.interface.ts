  export interface IWebhookService {
    sendWebhook(data: IWebhookData): Promise<void>;
  }
 export interface IWebhookData {
  customMetaData?: object;
  customWebHook?: string;
  authorizationToken?: string;
} 