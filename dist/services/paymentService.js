"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPayment = void 0;
// src/services/paymentService.ts
const createPayment = async (amount, userId) => {
    // Simulate payment integration (replace with real payment gateway logic)
    console.log(`Processing payment of ${amount} for user ${userId}`);
    return { success: true, paymentId: 'mock-payment-id' };
};
exports.createPayment = createPayment;
