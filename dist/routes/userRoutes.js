"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = userRoutes;
const userController_1 = require("../controllers/userController");
async function userRoutes(fastify) {
    fastify.get('/users/me', { preHandler: [fastify.authenticate] }, userController_1.userController.getUserProfile);
    const updateUserProfileOpts = {
        preHandler: [fastify.authenticate],
    };
    fastify.put('/users/me', updateUserProfileOpts, userController_1.userController.updateUserProfile);
}
