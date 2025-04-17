"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendDiscordNotification = sendDiscordNotification;
// src/services/discordService.ts
const axios_1 = __importDefault(require("axios"));
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;
console.log('DISCORD_WEBHOOK_URL:', DISCORD_WEBHOOK_URL);
async function sendDiscordNotification(embed, retries = 3, delay = 1000) {
    if (!DISCORD_WEBHOOK_URL) {
        // Corrigido: Adicionado o operador de negação (!)
        console.warn('DISCORD_WEBHOOK_URL não está definido. Notificação não será enviada.');
        return;
    }
    const payload = {
        embeds: [
            { ...embed, timestamp: embed.timestamp || new Date().toISOString() },
        ],
    };
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            console.log('Enviando notificação para o Discord (tentativa', attempt, '):', JSON.stringify(payload));
            await axios_1.default.post(DISCORD_WEBHOOK_URL, payload, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log('Notificação enviada com sucesso ao Discord.');
            return;
        }
        catch (error) {
            if (error.response?.status === 429 && attempt < retries) {
                const retryAfter = error.response?.headers['retry-after'] || delay;
                console.warn(`Limite de taxa atingido. Tentando novamente em ${retryAfter}ms...`);
                await new Promise((resolve) => setTimeout(resolve, retryAfter));
            }
            else {
                console.error('Falha ao enviar notificação para o Discord:', error.response?.data || error.message);
                break;
            }
        }
    }
}
