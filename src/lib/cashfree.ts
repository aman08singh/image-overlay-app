interface PaymentOptions {
  orderId: string;
  amount: number;
  customerName: string;
  customerEmail: string;
}

export async function createPaymentOrder({
  orderId,
  amount,
  customerName,
  customerEmail,
}: PaymentOptions) {
  const response = await fetch(`${process.env.CASHFREE_API_ENDPOINT}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-version': '2022-09-01',
      'x-client-id': process.env.CASHFREE_APP_ID!,
      'x-client-secret': process.env.CASHFREE_SECRET_KEY!,
    },
    body: JSON.stringify({
      order_id: orderId,
      order_amount: amount,
      order_currency: 'INR',
      customer_details: {
        customer_id: orderId,
        customer_name: customerName,
        customer_email: customerEmail,
      },
    }),
  });

  return response.json();
}