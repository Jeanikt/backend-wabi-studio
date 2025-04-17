"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.metricsController = void 0;
const supabase_1 = require("../config/supabase");
const redis_1 = __importDefault(require("../config/redis"));
exports.metricsController = {
    getMetrics: async (request, reply) => {
        try {
            let cachedMetrics = null;
            try {
                cachedMetrics = await redis_1.default.get('metrics');
            }
            catch (redisError) {
                console.warn('Redis unavailable, skipping cache:', redisError);
            }
            if (cachedMetrics) {
                return reply.send(JSON.parse(cachedMetrics));
            }
            const { data: salesData, error: salesError } = await supabase_1.supabase
                .from('orders')
                .select('total')
                .eq('status', 'completed');
            if (salesError)
                throw salesError;
            const totalSales = salesData.reduce((sum, order) => sum + order.total, 0);
            const { data: accessData, error: accessError } = await supabase_1.supabase
                .from('access_logs')
                .select('id');
            if (accessError)
                throw accessError;
            const totalAccesses = accessData.length;
            const { data: topProductsData, error: topProductsError } = await supabase_1.supabase
                .from('order_items')
                .select('product_id, products(name), quantity')
                .limit(5);
            if (topProductsError)
                throw topProductsError;
            const topProducts = topProductsData.map((item) => ({
                name: item.products[0]?.name || 'Unknown Product', // Acessa o primeiro item do array
                sales: item.quantity,
            }));
            const metrics = { totalSales, totalAccesses, topProducts };
            try {
                await redis_1.default.setEx('metrics', 3600, JSON.stringify(metrics));
            }
            catch (redisError) {
                console.warn('Failed to cache metrics in Redis:', redisError);
            }
            reply.send(metrics);
        }
        catch (error) {
            reply.status(500).send({ error: 'Internal Server Error' });
        }
    },
};
