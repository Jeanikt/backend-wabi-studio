import Fastify from "fastify";
import { productRoutes } from "../src/routes/productRoutes";

const fastify = Fastify();

beforeAll(async () => {
  await fastify.register(productRoutes);
});

afterAll(async () => {
  await fastify.close();
});

describe("Product Routes", () => {
  it("should get all products", async () => {
    const response = await fastify.inject({
      method: "GET",
      url: "/products",
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toBeInstanceOf(Array);
  });
});
