// src/routes/productRoutes.ts
import { FastifyInstance, RouteShorthandOptions } from 'fastify';
import { Product } from '../types';
import { productController } from '../controllers/productController';

interface CreateProductBody {
  Body: {
    name: string;
    description: string;
    price: number;
    stock: number;
    image_url: string;
  };
}

interface UpdateProductParams {
  Params: { id: string };
  Body: Partial<Product>;
}

interface DeleteProductParams {
  Params: { id: string };
}

export async function productRoutes(fastify: FastifyInstance) {
  fastify.get('/products', productController.getAllProducts);
  fastify.get('/products/:id', productController.getProductById);

  const createProductOpts: RouteShorthandOptions = {
    preHandler: [fastify.authenticate, fastify.isAdmin],
  };
  fastify.post<CreateProductBody>(
    '/products',
    createProductOpts,
    productController.createProduct
  );

  const updateProductOpts: RouteShorthandOptions = {
    preHandler: [fastify.authenticate, fastify.isAdmin],
  };
  fastify.put<UpdateProductParams>(
    '/products/:id',
    updateProductOpts,
    productController.updateProduct
  );

  const deleteProductOpts: RouteShorthandOptions = {
    preHandler: [fastify.authenticate, fastify.isAdmin],
  };
  fastify.delete<DeleteProductParams>(
    '/products/:id',
    deleteProductOpts,
    productController.deleteProduct
  );
}
