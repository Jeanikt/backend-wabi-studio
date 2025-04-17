// src/middleware/trackAccess.ts
import { FastifyRequest, FastifyReply } from 'fastify';
import { supabase } from '../config/supabase';

export async function trackAccess(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const userId = request.user?.id || null;
    const page = request.url;

    await supabase.from('access_logs').insert([{ user_id: userId, page }]);
  } catch (error) {
    console.error('Erro ao registrar acesso:', error);
  }
}
