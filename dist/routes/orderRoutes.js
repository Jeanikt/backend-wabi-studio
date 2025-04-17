"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderRoutes = orderRoutes;
const orderController_1 = require("../controllers/orderController");
async function orderRoutes(fastify) {
    const createOrderOpts = {
        preHandler: [fastify.authenticate],
    };
    fastify.post('/orders', createOrderOpts, orderController_1.orderController.createOrder);
    fastify.get('/orders', { preHandler: [fastify.authenticate] }, orderController_1.orderController.getOrders);
    const getOrderByIdOpts = {
        preHandler: [fastify.authenticate],
    };
    fastify.get('/orders/:id', getOrderByIdOpts, orderController_1.orderController.getOrderById);
    const updateOrderStatusOpts = {
        preHandler: [fastify.authenticate, fastify.isAdmin],
    };
    fastify.put('/orders/:id', updateOrderStatusOpts, orderController_1.orderController.updateOrderStatus);
}
