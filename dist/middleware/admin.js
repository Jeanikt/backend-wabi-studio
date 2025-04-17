"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = isAdmin;
async function isAdmin(request, reply) {
    if (request.user.role !== 'admin') {
        reply.status(403).send({ error: 'Forbidden' });
        return;
    }
}
