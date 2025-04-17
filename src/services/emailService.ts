import { sendEmail } from "../config/nodemailer";
import { Order } from "../types";

export const sendPurchaseConfirmation = async (to: string, order: Order) => {
  const html = `
    <h1>Thank You for Your Purchase!</h1>
    <p>Order ID: ${order.id}</p>
    <p>Total: €${order.total}</p>
    <p>We will notify you once your order is shipped.</p>
  `;
  await sendEmail(to, "Purchase Confirmation - WABI Studio", html);
};

export const sendWelcomeEmail = async (to: string) => {
  const html = `
    <h1>Welcome to WABI Studio!</h1>
    <p>Thank you for registering. Start shopping now!</p>
  `;
  await sendEmail(to, "Welcome to WABI Studio", html);
};
