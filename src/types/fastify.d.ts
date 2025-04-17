// src/types/fastify.d.ts
import { FastifyRequest, FastifyReply } from 'fastify';

// Defina a interface para o payload do usuário autenticado
export interface AuthenticatedUser {
  id: string;
  email: string;
  role: string;
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: AuthenticatedUser; // Define o tipo do payload do JWT
    user: AuthenticatedUser; // Define o tipo de request.user
  }
}

declare module 'fastify' {
  interface FastifyRequest {
    user: AuthenticatedUser; // Garante que request.user seja tipado como AuthenticatedUser
  }

  interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply
    ) => Promise<void>;
    isAdmin: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}
