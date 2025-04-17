// src/services/paymentService.ts
export const createPayment = async (amount: number, userId: string) => {
  // Simulate payment integration (replace with real payment gateway logic)
  console.log(`Processing payment of ${amount} for user ${userId}`);
  return { success: true, paymentId: 'mock-payment-id' };
};
