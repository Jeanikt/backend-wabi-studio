import { FastifyInstance } from "fastify";
import { productController } from "../controllers/productController";

export async function productRoutes(fastify: FastifyInstance) {
  fastify.get("/products", productController.getAllProducts);
  fastify.get("/products/:id", productController.getProductById);
  fastify.post(
    "/products",
    { preHandler: [fastify.authenticate, fastify.isAdmin] },
    productController.createProduct
  );
  fastify.put(
    "/products/:id",
    { preHandler: [fastify.authenticate, fastify.isAdmin] },
    productController.updateProduct
  );
  fastify.delete(
    "/products/:id",
    { preHandler: [fastify.authenticate, fastify.isAdmin] },
    productController.deleteProduct
  );
}
