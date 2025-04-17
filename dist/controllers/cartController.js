"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartController = void 0;
const supabase_1 = require("../config/supabase");
const discordService_1 = require("../services/discordService");
exports.cartController = {
    getCart: async (request, reply) => {
        try {
            const userId = request.user.id;
            const { data, error } = await supabase_1.supabase
                .from('cart_items')
                .select('*, product:products(name, price)')
                .eq('user_id', userId);
            if (error)
                throw error;
            // Enviar notificação para o Discord
            await (0, discordService_1.sendDiscordNotification)({
                title: '🛒 Carrinho Acessado',
                description: `O usuário com ID ${userId} acessou seu carrinho de compras.`,
                color: 0x1e90ff, // Azul
                fields: [
                    { name: 'Usuário ID', value: userId, inline: true },
                    {
                        name: 'Itens no Carrinho',
                        value: data.length.toString(),
                        inline: true,
                    },
                    {
                        name: 'Detalhes dos Itens',
                        value: data.length > 0
                            ? data
                                .map((item) => `- ${item.product?.name || 'Desconhecido'} (Qtd: ${item.quantity}, Preço: R$${item.product?.price?.toFixed(2) || '0.00'})`)
                                .join('\n')
                            : 'Carrinho vazio',
                        inline: false,
                    },
                ],
            });
            reply.send(data);
        }
        catch (error) {
            reply.status(500).send({ error: 'Internal Server Error' });
        }
    },
    addToCart: async (request, reply) => {
        try {
            const userId = request.user.id;
            const { product_id, quantity } = request.body;
            const { data: product, error: productError } = await supabase_1.supabase
                .from('products')
                .select('stock, name, price')
                .eq('id', product_id)
                .single();
            if (productError || !product)
                throw new Error('Product not found');
            if (product.stock < quantity)
                throw new Error('Insufficient stock');
            const { data, error } = await supabase_1.supabase
                .from('cart_items')
                .upsert({ user_id: userId, product_id, quantity }, { onConflict: 'user_id,product_id' })
                .select();
            if (error)
                throw error;
            // Enviar notificação para o Discord
            await (0, discordService_1.sendDiscordNotification)({
                title: '🛒 Produto Adicionado ao Carrinho',
                description: `O usuário com ID ${userId} adicionou um produto ao carrinho.`,
                color: 0x00ff00, // Verde
                fields: [
                    { name: 'Usuário ID', value: userId, inline: true },
                    { name: 'Produto', value: product.name, inline: true },
                    { name: 'Quantidade', value: quantity.toString(), inline: true },
                    {
                        name: 'Preço Unitário',
                        value: `R$${product.price.toFixed(2)}`,
                        inline: true,
                    },
                ],
            });
            reply.status(201).send(data[0]);
        }
        catch (error) {
            reply.status(400).send({ error: error.message });
        }
    },
    removeFromCart: async (request, reply) => {
        try {
            const userId = request.user.id;
            const { itemId } = request.params;
            const { data: item, error: fetchError } = await supabase_1.supabase
                .from('cart_items')
                .select('*, product:products(name)') // Ajustado para incluir todos os campos de cart_items
                .eq('id', itemId)
                .eq('user_id', userId)
                .single();
            if (fetchError)
                throw fetchError;
            const { error } = await supabase_1.supabase
                .from('cart_items')
                .delete()
                .eq('id', itemId)
                .eq('user_id', userId);
            if (error)
                throw error;
            // Enviar notificação para o Discord
            await (0, discordService_1.sendDiscordNotification)({
                title: '🛒 Produto Removido do Carrinho',
                description: `O usuário com ID ${userId} removeu um item do carrinho.`,
                color: 0xff0000, // Vermelho
                fields: [
                    { name: 'Usuário ID', value: userId, inline: true },
                    { name: 'Item ID', value: itemId, inline: true },
                    {
                        name: 'Produto',
                        value: item?.product?.name || 'Desconhecido', // Removido o cast (item as CartItem)
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
