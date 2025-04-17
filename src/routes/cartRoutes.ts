// src/routes/cartRoutes.ts
import { FastifyInstance, RouteShorthandOptions } from 'fastify';
import { cartController } from '../controllers/cartController';

interface AddToCartBody {
  Body: { product_id: string; quantity: number };
}

interface RemoveFromCartParams {
  Params: { itemId: string };
}

export async function cartRoutes(fastify: FastifyInstance) {
  fastify.get(
    '/cart',
    { preHandler: [fastify.authenticate] },
    cartController.getCart
  );

  const addToCartOpts: RouteShorthandOptions = {
    preHandler: [fastify.authenticate],
  };
  fastify.post<AddToCartBody>('/cart', addToCartOpts, cartController.addToCart);

  const removeFromCartOpts: RouteShorthandOptions = {
    preHandler: [fastify.authenticate],
  };
  fastify.delete<RemoveFromCartParams>(
    '/cart/:itemId',
    removeFromCartOpts,
    cartController.removeFromCart
  );
}
