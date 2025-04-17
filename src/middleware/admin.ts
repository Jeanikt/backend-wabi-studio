// src/middleware/admin.ts
import { FastifyRequest, FastifyReply } from 'fastify';

export async function isAdmin(request: FastifyRequest, reply: FastifyReply) {
  if (request.user.role !== 'admin') {
    reply.status(403).send({ error: 'Forbidden' });
    return;
  }
}
