// src/controllers/metricsController.ts
import { FastifyRequest, FastifyReply } from 'fastify';
import { supabase } from '../config/supabase';
import redisClient from '../config/redis';

interface ProductMetrics {
  product_id: string;
  quantity: number;
  products: { name: string }[]; // Ajustado para ser um array
}

export const metricsController = {
  getMetrics: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      let cachedMetrics: string | null = null;

      try {
        cachedMetrics = await redisClient.get('metrics');
      } catch (redisError) {
        console.warn('Redis unavailable, skipping cache:', redisError);
      }

      if (cachedMetrics) {
        return reply.send(JSON.parse(cachedMetrics));
      }

      const { data: salesData, error: salesError } = await supabase
        .from('orders')
        .select('total')
        .eq('status', 'completed');
      if (salesError) throw salesError;

      const totalSales = salesData.reduce((sum, order) => sum + order.total, 0);

      const { data: accessData, error: accessError } = await supabase
        .from('access_logs')
        .select('id');
      if (accessError) throw accessError;

      const totalAccesses = accessData.length;

      const { data: topProductsData, error: topProductsError } = await supabase
        .from('order_items')
        .select('product_id, products(name), quantity')
        .limit(5);
      if (topProductsError) throw topProductsError;

      const topProducts = topProductsData.map((item: ProductMetrics) => ({
        name: item.products[0]?.name || 'Unknown Product', // Acessa o primeiro item do array
        sales: item.quantity,
      }));

      const metrics = { totalSales, totalAccesses, topProducts };

      try {
        await redisClient.setEx('metrics', 3600, JSON.stringify(metrics));
      } catch (redisError) {
        console.warn('Failed to cache metrics in Redis:', redisError);
      }

      reply.send(metrics);
    } catch (error: any) {
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  },
};
