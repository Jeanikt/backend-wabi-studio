"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metricsRoutes = metricsRoutes;
const metricsController_1 = require("../controllers/metricsController");
async function metricsRoutes(fastify) {
    fastify.get('/metrics', { preHandler: [fastify.authenticate, fastify.isAdmin] }, metricsController_1.metricsController.getMetrics);
}
