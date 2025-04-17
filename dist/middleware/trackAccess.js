"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trackAccess = trackAccess;
const supabase_1 = require("../config/supabase");
async function trackAccess(request, reply) {
    const userId = request.user?.id || null;
    const page = request.url;
    await supabase_1.supabase.from('access_logs').insert([{ user_id: userId, page }]);
}
