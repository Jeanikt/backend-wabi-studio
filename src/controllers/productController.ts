// src/controllers/productController.ts
import { FastifyRequest, FastifyReply } from 'fastify';
import { supabase } from '../config/supabase';
import redisClient from '../config/redis';
import { Product } from '../types';
import { sendDiscordNotification } from '../services/discordService';

export const productController = {
  getAllProducts: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const cachedProducts = await redisClient.get('products');
      if (cachedProducts) {
        return reply.send(JSON.parse(cachedProducts));
      }

      const { data, error } = await supabase.from('products').select('*');
      if (error) throw error;

      await redisClient.setEx('products', 3600, JSON.stringify(data));
      reply.send(data);
    } catch (error) {
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  },

  getProductById: async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const { id } = request.params;
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      if (!data) return reply.status(404).send({ error: 'Product not found' });
      reply.send(data);
    } catch (error) {
      reply.status(500).send({ error: 'Internal Server Error' });
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
        .from('products')
        .insert([
          { name, description, price, stock, image_url, sold_out: false },
        ])
        .select();
      if (error) throw error;

      await redisClient.del('products');

      // Enviar notificação para o Discord
      await sendDiscordNotification({
        title: '🛍️ Novo Produto Criado',
        description: `Um novo produto foi adicionado ao catálogo.`,
        color: 0x00ff00, // Verde
        fields: [
          { name: 'Nome', value: name, inline: true },
          { name: 'Preço', value: `R$${price.toFixed(2)}`, inline: true },
          { name: 'Estoque', value: stock.toString(), inline: true },
          { name: 'Descrição', value: description || 'N/A', inline: false },
          { name: 'Imagem', value: image_url || 'N/A', inline: false },
        ],
      });

      reply.status(201).send(data[0]);
    } catch (error) {
      reply.status(500).send({ error: 'Internal Server Error' });
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
      const { name, description, price, stock, image_url, sold_out } =
        request.body;
      const { data, error } = await supabase
        .from('products')
        .update(request.body)
        .eq('id', id)
        .select();
      if (error) throw error;
      if (!data) return reply.status(404).send({ error: 'Product not found' });

      await redisClient.del('products');

      // Enviar notificação para o Discord
      await sendDiscordNotification({
        title: '🛍️ Produto Atualizado',
        description: `O produto com ID ${id} foi atualizado.`,
        color: 0xffa500, // Laranja
        fields: [
          { name: 'ID do Produto', value: id, inline: true },
          { name: 'Nome', value: name || data[0].name, inline: true },
          {
            name: 'Preço',
            value: `R$${(price || data[0].price).toFixed(2)}`,
            inline: true,
          },
          {
            name: 'Estoque',
            value: (stock || data[0].stock).toString(),
            inline: true,
          },
          {
            name: 'Vendido',
            value: (sold_out !== undefined ? sold_out : data[0].sold_out)
              ? 'Sim'
              : 'Não',
            inline: true,
          },
          {
            name: 'Descrição',
            value: description || data[0].description || 'N/A',
            inline: false,
          },
          {
            name: 'Imagem',
            value: image_url || data[0].image_url || 'N/A',
            inline: false,
          },
        ],
      });

      reply.send(data[0]);
    } catch (error) {
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  },

  deleteProduct: async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const { id } = request.params;
      const { data: product, error: fetchError } = await supabase
        .from('products')
        .select('name')
        .eq('id', id)
        .single();
      if (fetchError) throw fetchError;

      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;

      await redisClient.del('products');

      // Enviar notificação para o Discord
      await sendDiscordNotification({
        title: '🛍️ Produto Excluído',
        description: `O produto com ID ${id} foi excluído do catálogo.`,
        color: 0xff0000, // Vermelho
        fields: [
          { name: 'ID do Produto', value: id, inline: true },
          {
            name: 'Nome',
            value: product?.name || 'Desconhecido',
            inline: true,
          },
        ],
      });

      reply.status(204).send();
    } catch (error) {
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  },
};
