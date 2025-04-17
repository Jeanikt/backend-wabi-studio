export const createPayment = async (amount: number, userId: string) => {
  // Simulação de integração com gateway de pagamento
  // Substitua pelo seu serviço de pagamento real
  const response = await fetch(
    "https://www.abacatepay.com/api/create-payment",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, userId }),
    }
  );

  const data = await response.json();
  return { success: data.status === "success", paymentId: data.paymentId };
};
