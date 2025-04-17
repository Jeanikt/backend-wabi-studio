// src/controllers/userController.ts
import { FastifyRequest, FastifyReply } from 'fastify';
import { supabase } from '../config/supabase';
import { sendDiscordNotification } from '../services/discordService';

export const userController = {
  getUserProfile: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = request.user.id;
      const { data, error } = await supabase
        .from('users')
        .select('id, email, name, address, role') // Excluímos o password
        .eq('id', userId)
        .single();
      if (error) throw error;
      if (!data) return reply.status(404).send({ error: 'User not found' });

      // Enviar notificação para o Discord
      await sendDiscordNotification({
        title: '👤 Perfil do Usuário Acessado',
        description: `O usuário com ID ${userId} acessou seu perfil.`,
        color: 0x1e90ff, // Azul
        fields: [
          { name: 'Usuário ID', value: userId, inline: true },
          { name: 'Email', value: data.email, inline: true },
          { name: 'Nome', value: data.name || 'N/A', inline: true },
        ],
      });

      reply.send(data);
    } catch (error: any) {
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  },

  updateUserProfile: async (
    request: FastifyRequest<{ Body: { name: string; address: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const userId = request.user.id;
      const { name, address } = request.body;
      const { data, error } = await supabase
        .from('users')
        .update({ name, address })
        .eq('id', userId)
        .select('id, email, name, address, role'); // Excluímos o password
      if (error) throw error;
      if (!data) return reply.status(404).send({ error: 'User not found' });

      // Enviar notificação para o Discord
      await sendDiscordNotification({
        title: '👤 Perfil do Usuário Atualizado',
        description: `O usuário com ID ${userId} atualizou seu perfil.`,
        color: 0xffa500, // Laranja
        fields: [
          { name: 'Usuário ID', value: userId, inline: true },
          { name: 'Email', value: data[0].email, inline: true },
          { name: 'Novo Nome', value: name || 'N/A', inline: true },
          { name: 'Novo Endereço', value: address || 'N/A', inline: false },
        ],
      });

      reply.send(data[0]);
    } catch (error: any) {
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  },
};
