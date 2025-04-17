// src/routes/userRoutes.ts
import { FastifyInstance, RouteShorthandOptions } from 'fastify';
import { userController } from '../controllers/userController';

interface UpdateUserProfileBody {
  Body: { name: string; address: string };
}

export async function userRoutes(fastify: FastifyInstance) {
  fastify.get(
    '/users/me',
    { preHandler: [fastify.authenticate] },
    userController.getUserProfile
  );

  const updateUserProfileOpts: RouteShorthandOptions = {
    preHandler: [fastify.authenticate],
  };
  fastify.put<UpdateUserProfileBody>(
    '/users/me',
    updateUserProfileOpts,
    userController.updateUserProfile
  );
}
