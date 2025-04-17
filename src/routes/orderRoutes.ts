import { FastifyInstance } from "fastify";
import { orderController } from "../controllers/orderController";

export async function orderRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/orders",
    { preHandler: [fastify.authenticate] },
    orderController.createOrder
  );
  fastify.get(
    "/orders",
    { preHandler: [fastify.authenticate] },
    orderController.getOrders
  );
  fastify.get(
    "/orders/:id",
    { preHandler: [fastify.authenticate] },
    orderController.getOrderById
  );
  fastify.put(
    "/orders/:id",
    { preHandler: [fastify.authenticate, fastify.isAdmin] },
    orderController.updateOrderStatus
  );
}
