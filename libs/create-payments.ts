import { getStripeClient } from './stripe';

interface Props {
  description: string;
  orderId: number;
  amount: number;
  customerEmail: string;
}

const getAppUrl = () => {
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
};

export async function createPayment(details: Props) {
  const stripe = getStripeClient();
  const appUrl = getAppUrl();
  const amountInCents = Math.round(details.amount * 100);

  if (amountInCents <= 0) {
    throw new Error('Payment amount must be greater than 0');
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    customer_email: details.customerEmail,
    client_reference_id: String(details.orderId),
    metadata: {
      orderId: String(details.orderId),
    },
    payment_intent_data: {
      metadata: {
        orderId: String(details.orderId),
      },
    },
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'eur',
          unit_amount: amountInCents,
          product_data: {
            name: details.description,
          },
        },
      },
    ],
    success_url: `${appUrl}/api/stripe/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/api/stripe/cancel?orderId=${details.orderId}`,
  });

  if (!session.url) {
    throw new Error('Stripe checkout session URL was not created');
  }

  return {
    id: session.id,
    url: session.url,
  };
}
