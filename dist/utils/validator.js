"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = exports.orderSchema = exports.cartItemSchema = exports.productSchema = void 0;
const zod_1 = require("zod");
exports.productSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    description: zod_1.z.string().min(1),
    price: zod_1.z.number().positive(),
    stock: zod_1.z.number().int().nonnegative(),
    image_url: zod_1.z.string().url(),
});
exports.cartItemSchema = zod_1.z.object({
    product_id: zod_1.z.string(),
    quantity: zod_1.z.number().int().positive(),
});
exports.orderSchema = zod_1.z.object({
    items: zod_1.z.array(exports.cartItemSchema),
    shipping_address: zod_1.z.string().min(1),
});
exports.userSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    address: zod_1.z.string().min(1),
});
