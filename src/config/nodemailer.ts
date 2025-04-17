import dotenv from 'dotenv';
dotenv.config(); // Carregar as variáveis do .env explicitamente
import nodemailer, { Transporter } from 'nodemailer';

console.log('SMTP user:', process.env.ZOHO_EMAIL);
console.log('SMTP pass:', process.env.ZOHO_PASSWORD);

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
