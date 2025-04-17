import { FastifyInstance } from "fastify";
import { metricsController } from "../controllers/metricsController";

export async function metricsRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/metrics",
    { preHandler: [fastify.authenticate, fastify.isAdmin] },
    metricsController.getMetrics
  );
}
