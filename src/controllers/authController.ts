// src/controllers/authController.ts
import { FastifyRequest, FastifyReply } from 'fastify';
import { supabase } from '../config/supabase';
import bcrypt from 'bcrypt';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email('Email inválido').nonempty('Email é obrigatório'),
  password: z
    .string()
    .min(6, 'A senha deve ter pelo menos 6 caracteres')
    .nonempty('Senha é obrigatória'),
  role: z.enum(['user', 'admin']).optional().default('user'),
});

export const authController = {
  register: async (
    request: FastifyRequest<{
      Body: { email: string; password: string; role?: string };
    }>,
    reply: FastifyReply
  ) => {
    try {
      // Validar os dados de entrada
      const { email, password, role } = registerSchema.parse(request.body);

      // Gerar o hash da senha
      const hashedPassword = await bcrypt.hash(password, 10);

      // Inserir o novo usuário no Supabase
      const { data: user, error } = await supabase
        .from('users')
        .insert([{ email, password: hashedPassword, role }])
        .select('id, email, role')
        .single();
      if (error) {
        throw new Error(error.message);
      }

      // Gerar o token JWT
      const token = request.server.jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        { expiresIn: '1h' }
      );

      reply.status(201).send({ token });
    } catch (error: any) {
      reply
        .status(400)
        .send({ error: error.message || 'Erro ao registrar usuário' });
    }
  },

  login: async (
    request: FastifyRequest<{ Body: { email: string; password: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const { email, password } = request.body;

      const { data: user, error } = await supabase
        .from('users')
        .select('id, email, role, password')
        .eq('email', email)
        .single();
      if (error || !user) {
        throw new Error('Usuário não encontrado');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error('Senha incorreta');
      }

      const token = request.server.jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        { expiresIn: '1h' }
      );

      reply.send({ token });
    } catch (error: any) {
      reply.status(401).send({ error: error.message || 'Erro ao fazer login' });
    }
  },
};
