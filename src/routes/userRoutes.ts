import { FastifyInstance } from "fastify";
import { userController } from "../controllers/userController";

export async function userRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/users/me",
    { preHandler: [fastify.authenticate] },
    userController.getUserProfile
  );
  fastify.put(
    "/users/me",
    { preHandler: [fastify.authenticate] },
    userController.updateUserProfile
  );
}
