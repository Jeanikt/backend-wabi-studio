"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const supabase_1 = require("../config/supabase");
exports.authController = {
    login: async (request, reply) => {
        try {
            const { email, password } = request.body;
            // Verificar o usuário no Supabase
            const { data: user, error } = await supabase_1.supabase
                .from('users')
                .select('id, email, role, password')
                .eq('email', email)
                .single();
            if (error || !user) {
                throw new Error('Usuário não encontrado');
            }
            // Verificar a senha (você deve usar um hash seguro na produção, como bcrypt)
            if (user.password !== password) {
                throw new Error('Senha incorreta');
            }
            // Gerar o token JWT
            const token = request.server.jwt.sign({ id: user.id, email: user.email, role: user.role }, { expiresIn: '1h' });
            reply.send({ token });
        }
        catch (error) {
            reply.status(401).send({ error: error.message });
        }
    },
    register: async (request, reply) => {
        try {
            const { email, password, role = 'user' } = request.body;
            // Inserir o novo usuário no Supabase
            const { data: user, error } = await supabase_1.supabase
                .from('users')
                .insert([{ email, password, role }]) // Ajuste para incluir outros campos necessários
                .select('id, email, role')
                .single();
            if (error) {
                throw new Error(error.message);
            }
            // Gerar o token JWT
            const token = request.server.jwt.sign({ id: user.id, email: user.email, role: user.role }, { expiresIn: '1h' });
            reply.status(201).send({ token });
        }
        catch (error) {
            reply.status(400).send({ error: error.message });
        }
    },
};
