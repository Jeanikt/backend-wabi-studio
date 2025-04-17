import Fastify from "fastify";
import { metricsRoutes } from "../src/routes/metricsRoutes";

const fastify = Fastify();

beforeAll(async () => {
  await fastify.register(metricsRoutes);
  fastify.decorate("authenticate", async (request: any, reply: any) => {
    request.user = { id: "test-user", role: "admin" };
  });
  fastify.decorate("isAdmin", async (request: any, reply: any) => {});
});

afterAll(async () => {
  await fastify.close();
});

describe("Metrics Routes", () => {
  it("should get metrics", async () => {
    const response = await fastify.inject({
      method: "GET",
      url: "/metrics",
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toHaveProperty("totalSales");
  });
});
