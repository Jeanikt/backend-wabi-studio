"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPurchaseConfirmation = void 0;
// src/services/emailService.ts
const nodemailer_1 = require("../config/nodemailer");
const sendPurchaseConfirmation = async (to, order) => {
    const html = `
    <h1>Thank You for Your Purchase!</h1>
    <p>Order ID: ${order.id}</p>
    <p>Total: €${order.total}</p>
    <p>We will notify you once your order is shipped.</p>
  `;
    await (0, nodemailer_1.sendEmail)(to, 'Purchase Confirmation - WABI Studio', html);
};
exports.sendPurchaseConfirmation = sendPurchaseConfirmation;
