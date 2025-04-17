"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartController = void 0;
const supabase_1 = require("../config/supabase");
exports.cartController = {
    getCart: async (request, reply) => {
        try {
            const userId = request.user.id; // Should now be typed as AuthenticatedUser
            const { data, error } = await supabase_1.supabase
                .from('cart_items')
                .select('*, product:products(*)')
                .eq('user_id', userId);
            if (error)
                throw error;
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
                .select('stock')
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
            const { error } = await supabase_1.supabase
                .from('cart_items')
                .delete()
                .eq('id', itemId)
                .eq('user_id', userId);
            if (error)
                throw error;
            reply.status(204).send();
        }
        catch (error) {
            reply.status(500).send({ error: 'Internal Server Error' });
        }
    },
};
