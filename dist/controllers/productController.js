"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productController = void 0;
const supabase_1 = require("../config/supabase");
const redis_1 = __importDefault(require("../config/redis"));
const discordService_1 = require("../services/discordService");
exports.productController = {
    getAllProducts: async (request, reply) => {
        try {
            const cachedProducts = await redis_1.default.get('products');
            if (cachedProducts) {
                return reply.send(JSON.parse(cachedProducts));
            }
            const { data, error } = await supabase_1.supabase.from('products').select('*');
            if (error)
                throw error;
            await redis_1.default.setEx('products', 3600, JSON.stringify(data));
            reply.send(data);
        }
        catch (error) {
            reply.status(500).send({ error: 'Internal Server Error' });
        }
    },
    getProductById: async (request, reply) => {
        try {
            const { id } = request.params;
            const { data, error } = await supabase_1.supabase
                .from('products')
                .select('*')
                .eq('id', id)
                .single();
            if (error)
                throw error;
            if (!data)
                return reply.status(404).send({ error: 'Product not found' });
            reply.send(data);
        }
        catch (error) {
            reply.status(500).send({ error: 'Internal Server Error' });
        }
    },
    createProduct: async (request, reply) => {
        try {
            const { name, description, price, stock, image_url } = request.body;
            const { data, error } = await supabase_1.supabase
                .from('products')
                .insert([
                { name, description, price, stock, image_url, sold_out: false },
            ])
                .select();
            if (error)
                throw error;
            await redis_1.default.del('products');
            // Enviar notificação para o Discord
            await (0, discordService_1.sendDiscordNotification)({
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
        }
        catch (error) {
            reply.status(500).send({ error: 'Internal Server Error' });
        }
    },
    updateProduct: async (request, reply) => {
        try {
            const { id } = request.params;
            const { name, description, price, stock, image_url, sold_out } = request.body;
            const { data, error } = await supabase_1.supabase
                .from('products')
                .update(request.body)
                .eq('id', id)
                .select();
            if (error)
                throw error;
            if (!data)
                return reply.status(404).send({ error: 'Product not found' });
            await redis_1.default.del('products');
            // Enviar notificação para o Discord
            await (0, discordService_1.sendDiscordNotification)({
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
        }
        catch (error) {
            reply.status(500).send({ error: 'Internal Server Error' });
        }
    },
    deleteProduct: async (request, reply) => {
        try {
            const { id } = request.params;
            const { data: product, error: fetchError } = await supabase_1.supabase
                .from('products')
                .select('name')
                .eq('id', id)
                .single();
            if (fetchError)
                throw fetchError;
            const { error } = await supabase_1.supabase.from('products').delete().eq('id', id);
            if (error)
                throw error;
            await redis_1.default.del('products');
            // Enviar notificação para o Discord
            await (0, discordService_1.sendDiscordNotification)({
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
        }
        catch (error) {
            reply.status(500).send({ error: 'Internal Server Error' });
        }
    },
};
