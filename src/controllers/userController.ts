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
        .select('*')
        .eq('id', userId)
        .single();
      if (error) throw error;
      if (!data) return reply.status(404).send({ error: 'User not found' });
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
        .select();
      if (error) throw error;
      if (!data) return reply.status(404).send({ error: 'User not found' });
      // Enviar notificação para o Discord
      await sendDiscordNotification(
        `👤 Perfil do usuário atualizado: ${data[0].name} (${data[0].email})`
      );
      reply.send(data[0]);
    } catch (error: any) {
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  },
};
