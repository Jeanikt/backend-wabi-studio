import nodemailer, { Transporter } from 'nodemailer';
import 'dotenv/config';

const transporter: Transporter = nodemailer.createTransport({
  host: 'smtp.zoho.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.ZOHO_EMAIL,
    pass: process.env.ZOHO_PASSWORD,
  },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  await transporter.sendMail({
    from: process.env.ZOHO_EMAIL,
    to,
    subject,
    html,
  });
};
