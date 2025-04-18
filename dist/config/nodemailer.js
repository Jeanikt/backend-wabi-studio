"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // Carregar as variáveis do .env explicitamente
const nodemailer_1 = __importDefault(require("nodemailer"));
console.log('SMTP user:', process.env.ZOHO_EMAIL);
console.log('SMTP pass:', process.env.ZOHO_PASSWORD);
const transporter = nodemailer_1.default.createTransport({
    host: 'smtp.zoho.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.ZOHO_EMAIL,
        pass: process.env.ZOHO_PASSWORD,
    },
});
const sendEmail = async (to, subject, html) => {
    await transporter.sendMail({
        from: process.env.ZOHO_EMAIL,
        to,
        subject,
        html,
    });
};
exports.sendEmail = sendEmail;
