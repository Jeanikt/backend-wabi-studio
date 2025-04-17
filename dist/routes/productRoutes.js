"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRoutes = productRoutes;
const productController_1 = require("../controllers/productController");
async function productRoutes(fastify) {
    fastify.get('/products', productController_1.productController.getAllProducts);
    fastify.get('/products/:id', productController_1.productController.getProductById);
    const createProductOpts = {
        preHandler: [fastify.authenticate, fastify.isAdmin],
    };
    fastify.post('/products', createProductOpts, productController_1.productController.createProduct);
    const updateProductOpts = {
        preHandler: [fastify.authenticate, fastify.isAdmin],
    };
    fastify.put('/products/:id', updateProductOpts, productController_1.productController.updateProduct);
    const deleteProductOpts = {
        preHandler: [fastify.authenticate, fastify.isAdmin],
    };
    fastify.delete('/products/:id', deleteProductOpts, productController_1.productController.deleteProduct);
}
