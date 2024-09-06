import resend from '../config/resend';
import { EMAIL_SENDER, NODE_ENV } from '../constants/env';

type Params = {
  html: string;
  subject: string;
  text: string;
  to: string;
};

export const sendMail = async ({ html, subject, text, to }: Params) =>
  await resend.emails.send({
    from: NODE_ENV === 'production' ? EMAIL_SENDER : 'onboarding@resend.dev',
    to: NODE_ENV === 'production' ? to : 'delivered@resend.dev',
    html,
    subject,
    text,
  });
