import Fastify from 'fastify';
import { userRoutes } from '../src/routes/userRoutes';

const fastify = Fastify();

beforeAll(async () => {
  await fastify.register(userRoutes);
  fastify.decorate('authenticate', async (request: any, reply: any) => {
    request.user = { id: 'test-user' }; // Supondo que você está mockando a autenticação.
  });
});

afterAll(async () => {
  await fastify.close();
});

describe('User Routes', () => {
  it('should get user profile', async () => {
    const response = await fastify.inject({
      method: 'GET',
      url: '/users/me', // Verifique se essa rota é válida.
      headers: {
        Authorization: 'Bearer test-token', // Aqui você pode adicionar o token ou mockar.
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toHaveProperty('id');
  });
});
