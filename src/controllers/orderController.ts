// src/controllers/orderController.ts
import { FastifyRequest, FastifyReply } from 'fastify';
import { supabase } from '../config/supabase';
import { Order } from '../types';
import { createPayment } from '../services/paymentService';
import { sendPurchaseConfirmation } from '../services/emailService';
import { sendDiscordNotification } from '../services/discordService';

export const orderController = {
  createOrder: async (
    request: FastifyRequest<{
      Body: {
        items: { product_id: string; quantity: number }[];
        shipping_address: string;
      };
    }>,
    reply: FastifyReply
  ) => {
    try {
      const userId = request.user.id;
      const userEmail = request.user.email;
      const { items, shipping_address } = request.body;

      let total = 0;
      const products = await Promise.all(
        items.map(async (item) => {
          const { data, error } = await supabase
            .from('products')
            .select('id, price, stock')
            .eq('id', item.product_id)
            .single();
          if (error || !data) throw new Error('Product not found');
          if (data.stock < item.quantity)
            throw new Error(`Insufficient stock for ${data.id}`);
          total += data.price * item.quantity;
          return { ...item, price: data.price };
        })
      );

      const payment = await createPayment(total, userId);
      if (!payment.success) throw new Error('Payment failed');

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([
          {
            user_id: userId,
            total,
            status: 'pending',
            items,
            shipping_address,
          },
        ])
        .select()
        .single();
      if (orderError) throw orderError;

      await Promise.all(
        products.map(async (item) => {
          await supabase
            .from('products')
            .update({
              stock: supabase.rpc('decrement_stock', {
                row_id: item.product_id,
                amount: item.quantity,
              }),
            })
            .eq('id', item.product_id);
        })
      );

      await supabase.from('cart_items').delete().eq('user_id', userId);

      await sendPurchaseConfirmation(userEmail, order);

      // Enviar notificação para o Discord
      await sendDiscordNotification(
        `🛒 Novo pedido criado por ${userEmail} com total de R$${total.toFixed(
          2
        )}.`
      );

      reply.status(201).send(order);
    } catch (error: any) {
      reply.status(400).send({ error: error.message });
    }
  },

  getOrders: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = request.user.id;
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId);
      if (error) throw error;
      reply.send(data);
    } catch (error: any) {
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  },

  getOrderById: async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const userId = request.user.id;
      const { id } = request.params;
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single();
      if (error) throw error;
      if (!data) return reply.status(404).send({ error: 'Order not found' });
      reply.send(data);
    } catch (error: any) {
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  },

  updateOrderStatus: async (
    request: FastifyRequest<{
      Params: { id: string };
      Body: { status: 'pending' | 'completed' | 'shipped' | 'delivered' };
    }>,
    reply: FastifyReply
  ) => {
    try {
      const { id } = request.params;
      const { status } = request.body;
      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id)
        .select();
      if (error) throw error;
      if (!data) return reply.status(404).send({ error: 'Order not found' });
      reply.send(data[0]);
    } catch (error: any) {
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  },
};
