import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.number().positive(),
  stock: z.number().int().nonnegative(),
  image_url: z.string().url(),
});

export const cartItemSchema = z.object({
  product_id: z.string(),
  quantity: z.number().int().positive(),
});

export const orderSchema = z.object({
  items: z.array(cartItemSchema),
  shipping_address: z.string().min(1),
});

export const userSchema = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
});
