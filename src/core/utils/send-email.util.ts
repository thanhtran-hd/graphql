import * as fs from 'fs/promises';
import * as path from 'path';
import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';
import { Config } from '../config';
import { SendMailDTO } from './send-mail.dto';

const TEMPLATE_DIR = 'email_templates';

let transporter: nodemailer.Transporter;

export async function verify() {
  transporter = nodemailer.createTransport({
    host: Config.EMAIL_HOST,
    service: Config.EMAIL_SERVICE,
    port: Config.EMAIL_PORT,
    secure: false,
    ignoreTLS: false,
    auth: {
      user: Config.EMAIL_AUTH_USER,
      pass: Config.EMAIL_AUTH_PASS,
    },
  });

  await transporter.verify();
}

export async function sendEmail({ email, subject, template, context }: SendMailDTO) {
  if (!transporter) {
    await verify();
  }

  const htmlString = await fs.readFile(path.resolve(TEMPLATE_DIR, `${template}.hbs`));
  const compiledTemplate = handlebars.compile(htmlString.toString('utf8'));
  const html = compiledTemplate(context);

  await transporter.sendMail({
    from: Config.EMAIL_AUTH_USER,
    to: email,
    subject,
    html,
  });
}
