import Fastify from "fastify";
import { orderRoutes } from "../src/routes/orderRoutes";

const fastify = Fastify();

beforeAll(async () => {
  await fastify.register(orderRoutes);
  fastify.decorate("authenticate", async (request: any, reply: any) => {
    request.user = { id: "test-user", email: "test@example.com" };
  });
});

afterAll(async () => {
  await fastify.close();
});

describe("Order Routes", () => {
  it("should create an order", async () => {
    const response = await fastify.inject({
      method: "POST",
      url: "/orders",
      payload: {
        items: [{ product_id: "1", quantity: 1 }],
        shipping_address: "123 Test St",
      },
    });

    expect(response.statusCode).toBe(201);
    expect(response.json()).toHaveProperty("id");
  });
});
