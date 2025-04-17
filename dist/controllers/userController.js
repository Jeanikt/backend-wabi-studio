"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const supabase_1 = require("../config/supabase");
const discordService_1 = require("../services/discordService");
exports.userController = {
    getUserProfile: async (request, reply) => {
        try {
            const userId = request.user.id;
            const { data, error } = await supabase_1.supabase
                .from('users')
                .select('*')
                .eq('id', userId)
                .single();
            if (error)
                throw error;
            if (!data)
                return reply.status(404).send({ error: 'User not found' });
            reply.send(data);
        }
        catch (error) {
            reply.status(500).send({ error: 'Internal Server Error' });
        }
    },
    updateUserProfile: async (request, reply) => {
        try {
            const userId = request.user.id;
            const { name, address } = request.body;
            const { data, error } = await supabase_1.supabase
                .from('users')
                .update({ name, address })
                .eq('id', userId)
                .select();
            if (error)
                throw error;
            if (!data)
                return reply.status(404).send({ error: 'User not found' });
            // Enviar notificação para o Discord
            await (0, discordService_1.sendDiscordNotification)(`👤 Perfil do usuário atualizado: ${data[0].name} (${data[0].email})`);
            reply.send(data[0]);
        }
        catch (error) {
            reply.status(500).send({ error: 'Internal Server Error' });
        }
    },
};
