"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendDiscordNotification = sendDiscordNotification;
const axios_1 = __importDefault(require("axios"));
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;
async function sendDiscordNotification(message) {
    if (!DISCORD_WEBHOOK_URL) {
        console.warn('DISCORD_WEBHOOK_URL não está definido.');
        return;
    }
    try {
        await axios_1.default.post(DISCORD_WEBHOOK_URL, {
            content: message,
        });
    }
    catch (error) {
        console.error('Erro ao enviar mensagem para o Discord:', error.message);
    }
}
