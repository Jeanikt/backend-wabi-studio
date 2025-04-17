"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartRoutes = cartRoutes;
const cartController_1 = require("../controllers/cartController");
async function cartRoutes(fastify) {
    fastify.get('/cart', { preHandler: [fastify.authenticate] }, cartController_1.cartController.getCart);
    const addToCartOpts = {
        preHandler: [fastify.authenticate],
    };
    fastify.post('/cart', addToCartOpts, cartController_1.cartController.addToCart);
    const removeFromCartOpts = {
        preHandler: [fastify.authenticate],
    };
    fastify.delete('/cart/:itemId', removeFromCartOpts, cartController_1.cartController.removeFromCart);
}
