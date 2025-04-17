"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = authRoutes;
const authController_1 = require("../controllers/authController");
async function authRoutes(fastify) {
    fastify.post('/login', authController_1.authController.login);
    fastify.post('/register', authController_1.authController.register);
}
