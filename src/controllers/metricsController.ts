import { FastifyRequest, FastifyReply } from "fastify";
import { supabase } from "../config/supabase";
import redisClient from "../config/redis";

export const metricsController = {
  getMetrics: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const cachedMetrics = await redisClient.get("metrics");
      if (cachedMetrics) {
        return reply.send(JSON.parse(cachedMetrics));
      }

      const { data: salesData, error: salesError } = await supabase
        .from("orders")
        .select("total")
        .eq("status", "completed");
      if (salesError) throw salesError;

      const totalSales = salesData.reduce((sum, order) => sum + order.total, 0);

      const { data: accessData, error: accessError } = await supabase
        .from("access_logs")
        .select("id");
      if (accessError) throw accessError;

      const totalAccesses = accessData.length;

      const { data: topProductsData, error: topProductsError } = await supabase
        .from("order_items")
        .select("product_id, products(name), quantity")
        .limit(5);
      if (topProductsError) throw topProductsError;

      const topProducts = topProductsData.map((item) => ({
        name: item.products.name,
        sales: item.quantity,
      }));

      const metrics = { totalSales, totalAccesses, topProducts };
      await redisClient.setEx("metrics", 3600, JSON.stringify(metrics));

      reply.send(metrics);
    } catch (error) {
      reply.status(500).send({ error: "Internal Server Error" });
    }
  },
};
