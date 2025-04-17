// src/services/discordService.ts
import axios from 'axios';

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL!;

console.log('DISCORD_WEBHOOK_URL:', DISCORD_WEBHOOK_URL);

interface DiscordEmbed {
  title: string;
  description?: string;
  color: number;
  fields?: { name: string; value: string; inline?: boolean }[];
  timestamp?: string;
}

export async function sendDiscordNotification(
  embed: DiscordEmbed,
  retries = 3,
  delay = 1000
) {
  if (!DISCORD_WEBHOOK_URL) {
    // Corrigido: Adicionado o operador de negação (!)
    console.warn(
      'DISCORD_WEBHOOK_URL não está definido. Notificação não será enviada.'
    );
    return;
  }

  const payload = {
    embeds: [
      { ...embed, timestamp: embed.timestamp || new Date().toISOString() },
    ],
  };

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(
        'Enviando notificação para o Discord (tentativa',
        attempt,
        '):',
        JSON.stringify(payload)
      );
      await axios.post(DISCORD_WEBHOOK_URL, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Notificação enviada com sucesso ao Discord.');
      return;
    } catch (error: any) {
      if (error.response?.status === 429 && attempt < retries) {
        const retryAfter = error.response?.headers['retry-after'] || delay;
        console.warn(
          `Limite de taxa atingido. Tentando novamente em ${retryAfter}ms...`
        );
        await new Promise((resolve) => setTimeout(resolve, retryAfter));
      } else {
        console.error(
          'Falha ao enviar notificação para o Discord:',
          error.response?.data || error.message
        );
        break;
      }
    }
  }
}
