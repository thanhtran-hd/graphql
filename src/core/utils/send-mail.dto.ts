export class SendMailDTO {
  email: string;
  subject: string;
  template: string;
  context?: object;
}
