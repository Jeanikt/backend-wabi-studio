import { FastifyInstance } from "fastify";
import { cartController } from "../controllers/cartController";

export async function cartRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/cart",
    { preHandler: [fastify.authenticate] },
    cartController.getCart
  );
  fastify.post(
    "/cart",
    { preHandler: [fastify.authenticate] },
    cartController.addToCart
  );
  fastify.delete(
    "/cart/:itemId",
    { preHandler: [fastify.authenticate] },
    cartController.removeFromCart
  );
}
