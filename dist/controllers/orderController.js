"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderController = void 0;
const supabase_1 = require("../config/supabase");
const paymentService_1 = require("../services/paymentService");
const emailService_1 = require("../services/emailService");
const discordService_1 = require("../services/discordService");
exports.orderController = {
    createOrder: async (request, reply) => {
        try {
            const userId = request.user.id;
            const userEmail = request.user.email;
            const { items, shipping_address } = request.body;
            let total = 0;
            const products = await Promise.all(items.map(async (item) => {
                const { data, error } = await supabase_1.supabase
                    .from('products')
                    .select('id, price, stock')
                    .eq('id', item.product_id)
                    .single();
                if (error || !data)
                    throw new Error('Product not found');
                if (data.stock < item.quantity)
                    throw new Error(`Insufficient stock for ${data.id}`);
                total += data.price * item.quantity;
                return { ...item, price: data.price };
            }));
            const payment = await (0, paymentService_1.createPayment)(total, userId);
            if (!payment.success)
                throw new Error('Payment failed');
            const { data: order, error: orderError } = await supabase_1.supabase
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
            if (orderError)
                throw orderError;
            await Promise.all(products.map(async (item) => {
                await supabase_1.supabase
                    .from('products')
                    .update({
                    stock: supabase_1.supabase.rpc('decrement_stock', {
                        row_id: item.product_id,
                        amount: item.quantity,
                    }),
                })
                    .eq('id', item.product_id);
            }));
            await supabase_1.supabase.from('cart_items').delete().eq('user_id', userId);
            await (0, emailService_1.sendPurchaseConfirmation)(userEmail, order);
            // Enviar notificação para o Discord
            await (0, discordService_1.sendDiscordNotification)(`🛒 Novo pedido criado por ${userEmail} com total de R$${total.toFixed(2)}.`);
            reply.status(201).send(order);
        }
        catch (error) {
            reply.status(400).send({ error: error.message });
        }
    },
    getOrders: async (request, reply) => {
        try {
            const userId = request.user.id;
            const { data, error } = await supabase_1.supabase
                .from('orders')
                .select('*')
                .eq('user_id', userId);
            if (error)
                throw error;
            reply.send(data);
        }
        catch (error) {
            reply.status(500).send({ error: 'Internal Server Error' });
        }
    },
    getOrderById: async (request, reply) => {
        try {
            const userId = request.user.id;
            const { id } = request.params;
            const { data, error } = await supabase_1.supabase
                .from('orders')
                .select('*')
                .eq('id', id)
                .eq('user_id', userId)
                .single();
            if (error)
                throw error;
            if (!data)
                return reply.status(404).send({ error: 'Order not found' });
            reply.send(data);
        }
        catch (error) {
            reply.status(500).send({ error: 'Internal Server Error' });
        }
    },
    updateOrderStatus: async (request, reply) => {
        try {
            const { id } = request.params;
            const { status } = request.body;
            const { data, error } = await supabase_1.supabase
                .from('orders')
                .update({ status })
                .eq('id', id)
                .select();
            if (error)
                throw error;
            if (!data)
                return reply.status(404).send({ error: 'Order not found' });
            reply.send(data[0]);
        }
        catch (error) {
            reply.status(500).send({ error: 'Internal Server Error' });
        }
    },
};
