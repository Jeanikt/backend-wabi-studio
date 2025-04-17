import { FastifyRequest, FastifyReply } from "fastify";
import { supabase } from "../config/supabase";
import redisClient from "../config/redis";
import { Product } from "../types";

export const productController = {
  getAllProducts: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const cachedProducts = await redisClient.get("products");
      if (cachedProducts) {
        return reply.send(JSON.parse(cachedProducts));
      }

      const { data, error } = await supabase.from("products").select("*");
      if (error) throw error;

      await redisClient.setEx("products", 3600, JSON.stringify(data));
      reply.send(data);
    } catch (error) {
      reply.status(500).send({ error: "Internal Server Error" });
    }
  },

  getProductById: async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const { id } = request.params;
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      if (!data) return reply.status(404).send({ error: "Product not found" });
      reply.send(data);
    } catch (error) {
      reply.status(500).send({ error: "Internal Server Error" });
    }
  },

  createProduct: async (
    request: FastifyRequest<{
      Body: {
        name: string;
        description: string;
        price: number;
        stock: number;
        image_url: string;
      };
    }>,
    reply: FastifyReply
  ) => {
    try {
      const { name, description, price, stock, image_url } = request.body;
      const { data, error } = await supabase
        .from("products")
        .insert([
          { name, description, price, stock, image_url, sold_out: false },
        ])
        .select();
      if (error) throw error;

      await redisClient.del("products");
      reply.status(201).send(data[0]);
    } catch (error) {
      reply.status(500).send({ error: "Internal Server Error" });
    }
  },

  updateProduct: async (
    request: FastifyRequest<{
      Params: { id: string };
      Body: Partial<Product>;
    }>,
    reply: FastifyReply
  ) => {
    try {
      const { id } = request.params;
      const { data, error } = await supabase
        .from("products")
        .update(request.body)
        .eq("id", id)
        .select();
      if (error) throw error;
      if (!data) return reply.status(404).send({ error: "Product not found" });

      await redisClient.del("products");
      reply.send(data[0]);
    } catch (error) {
      reply.status(500).send({ error: "Internal Server Error" });
    }
  },

  deleteProduct: async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const { id } = request.params;
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;

      await redisClient.del("products");
      reply.status(204).send();
    } catch (error) {
      reply.status(500).send({ error: "Internal Server Error" });
    }
  },
};
