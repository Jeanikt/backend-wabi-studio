// src/server.ts
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../.env') });
import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import { productRoutes } from './routes/productRoutes';
import { cartRoutes } from './routes/cartRoutes';
import { orderRoutes } from './routes/orderRoutes';
import { userRoutes } from './routes/userRoutes';
import { authRoutes } from './routes/authRoutes'; // Novo
import { metricsRoutes } from './routes/metricsRoutes';
import { authenticate } from './middleware/auth';
import { isAdmin } from './middleware/admin';
import { trackAccess } from './middleware/trackAccess';

const fastify: FastifyInstance = Fastify({ logger: true });

fastify.register(cors, { origin: '*' });
fastify.register(jwt, { secret: process.env.JWT_SECRET! });

fastify.decorate('authenticate', authenticate);
fastify.decorate('isAdmin', isAdmin);

fastify.addHook('onRequest', trackAccess);

fastify.register(productRoutes);
fastify.register(cartRoutes);
fastify.register(orderRoutes);
fastify.register(userRoutes);
fastify.register(authRoutes); // Novo
fastify.register(metricsRoutes);

const start = async () => {
  try {
    await fastify.listen({ port: 3001, host: '0.0.0.0' });
    console.log('Server running on http://localhost:3001');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
