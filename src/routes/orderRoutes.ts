// src/routes/orderRoutes.ts
import { FastifyInstance, RouteShorthandOptions } from 'fastify';
import { orderController } from '../controllers/orderController';

interface CreateOrderBody {
  Body: {
    items: { product_id: string; quantity: number }[];
    shipping_address: string;
  };
}

interface OrderByIdParams {
  Params: { id: string };
}

interface UpdateOrderStatus {
  Params: { id: string };
  Body: { status: 'pending' | 'completed' | 'shipped' | 'delivered' };
}

export async function orderRoutes(fastify: FastifyInstance) {
  const createOrderOpts: RouteShorthandOptions = {
    preHandler: [fastify.authenticate],
  };
  fastify.post<CreateOrderBody>(
    '/orders',
    createOrderOpts,
    orderController.createOrder
  );

  fastify.get(
    '/orders',
    { preHandler: [fastify.authenticate] },
    orderController.getOrders
  );

  const getOrderByIdOpts: RouteShorthandOptions = {
    preHandler: [fastify.authenticate],
  };
  fastify.get<OrderByIdParams>(
    '/orders/:id',
    getOrderByIdOpts,
    orderController.getOrderById
  );

  const updateOrderStatusOpts: RouteShorthandOptions = {
    preHandler: [fastify.authenticate, fastify.isAdmin],
  };
  fastify.put<UpdateOrderStatus>(
    '/orders/:id',
    updateOrderStatusOpts,
    orderController.updateOrderStatus
  );
}
