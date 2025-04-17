"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/server.ts
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../.env') });
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const jwt_1 = __importDefault(require("@fastify/jwt"));
const productRoutes_1 = require("./routes/productRoutes");
const cartRoutes_1 = require("./routes/cartRoutes");
const orderRoutes_1 = require("./routes/orderRoutes");
const userRoutes_1 = require("./routes/userRoutes");
const authRoutes_1 = require("./routes/authRoutes"); // Novo
const metricsRoutes_1 = require("./routes/metricsRoutes");
const auth_1 = require("./middleware/auth");
const admin_1 = require("./middleware/admin");
const trackAccess_1 = require("./middleware/trackAccess");
const fastify = (0, fastify_1.default)({ logger: true });
fastify.register(cors_1.default, { origin: '*' });
fastify.register(jwt_1.default, { secret: process.env.JWT_SECRET });
fastify.decorate('authenticate', auth_1.authenticate);
fastify.decorate('isAdmin', admin_1.isAdmin);
fastify.addHook('onRequest', trackAccess_1.trackAccess);
fastify.register(productRoutes_1.productRoutes);
fastify.register(cartRoutes_1.cartRoutes);
fastify.register(orderRoutes_1.orderRoutes);
fastify.register(userRoutes_1.userRoutes);
fastify.register(authRoutes_1.authRoutes); // Novo
fastify.register(metricsRoutes_1.metricsRoutes);
const start = async () => {
    try {
        await fastify.listen({ port: 3001, host: '0.0.0.0' });
        console.log('Server running on http://localhost:3001');
    }
    catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};
start();
