"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
async function authenticate(request, reply) {
    try {
        await request.jwtVerify();
        if (!request.user || !request.user.id) {
            reply.status(401).send({ error: 'Usuário não autenticado: ID ausente' });
            return;
        }
        // Validar se o userId é um UUID
        if (!uuidRegex.test(request.user.id)) {
            reply
                .status(401)
                .send({ error: 'ID do usuário inválido: deve ser um UUID' });
            return;
        }
    }
    catch (err) {
        reply.status(401).send({ error: 'Token inválido ou ausente' });
        return;
    }
}
