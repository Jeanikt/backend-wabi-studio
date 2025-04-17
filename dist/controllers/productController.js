"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productController = void 0;
const supabase_1 = require("../config/supabase");
const redis_1 = __importDefault(require("../config/redis"));
exports.productController = {
    getAllProducts: async (request, reply) => {
        try {
            const cachedProducts = await redis_1.default.get("products");
            if (cachedProducts) {
                return reply.send(JSON.parse(cachedProducts));
            }
            const { data, error } = await supabase_1.supabase.from("products").select("*");
            if (error)
                throw error;
            await redis_1.default.setEx("products", 3600, JSON.stringify(data));
            reply.send(data);
        }
        catch (error) {
            reply.status(500).send({ error: "Internal Server Error" });
        }
    },
    getProductById: async (request, reply) => {
        try {
            const { id } = request.params;
            const { data, error } = await supabase_1.supabase
                .from("products")
                .select("*")
                .eq("id", id)
                .single();
            if (error)
                throw error;
            if (!data)
                return reply.status(404).send({ error: "Product not found" });
            reply.send(data);
        }
        catch (error) {
            reply.status(500).send({ error: "Internal Server Error" });
        }
    },
    createProduct: async (request, reply) => {
        try {
            const { name, description, price, stock, image_url } = request.body;
            const { data, error } = await supabase_1.supabase
                .from("products")
                .insert([
                { name, description, price, stock, image_url, sold_out: false },
            ])
                .select();
            if (error)
                throw error;
            await redis_1.default.del("products");
            reply.status(201).send(data[0]);
        }
        catch (error) {
            reply.status(500).send({ error: "Internal Server Error" });
        }
    },
    updateProduct: async (request, reply) => {
        try {
            const { id } = request.params;
            const { data, error } = await supabase_1.supabase
                .from("products")
                .update(request.body)
                .eq("id", id)
                .select();
            if (error)
                throw error;
            if (!data)
                return reply.status(404).send({ error: "Product not found" });
            await redis_1.default.del("products");
            reply.send(data[0]);
        }
        catch (error) {
            reply.status(500).send({ error: "Internal Server Error" });
        }
    },
    deleteProduct: async (request, reply) => {
        try {
            const { id } = request.params;
            const { error } = await supabase_1.supabase.from("products").delete().eq("id", id);
            if (error)
                throw error;
            await redis_1.default.del("products");
            reply.status(204).send();
        }
        catch (error) {
            reply.status(500).send({ error: "Internal Server Error" });
        }
    },
};
