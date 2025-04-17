import Fastify from "fastify";
import { cartRoutes } from "../src/routes/cartRoutes";

const fastify = Fastify();

beforeAll(async () => {
  await fastify.register(cartRoutes);
  fastify.decorate("authenticate", async (request: any, reply: any) => {
    request.user = { id: "test-user" };
  });
});

afterAll(async () => {
  await fastify.close();
});

describe("Cart Routes", () => {
  it("should get cart items", async () => {
    const response = await fastify.inject({
      method: "GET",
      url: "/cart",
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toBeInstanceOf(Array);
  });
});
